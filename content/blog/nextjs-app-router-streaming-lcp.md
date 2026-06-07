---
title: "Streaming in the Next.js App Router: A Practical LCP Strategy"
date: "2026-06-02"
excerpt: "How streaming, Suspense boundaries, and the App Router change the way you protect Largest Contentful Paint on real production pages."
category: "Performance"
tags: ["app-router", "streaming", "LCP", "suspense"]
slug: "nextjs-app-router-streaming-lcp"
draft: false
---

Largest Contentful Paint is the metric users actually feel. It marks the moment the main content of a page becomes visible, and on most marketing and content pages it is the difference between a site that feels instant and one that feels sluggish. The App Router gives you a genuinely different toolset for protecting it, and the centerpiece of that toolset is streaming.

## What streaming actually changes

In the older model, a server rendered page was an all or nothing affair. The server gathered every piece of data, rendered the full HTML, and only then flushed a response. The slowest data dependency on the page set the floor for time to first byte. If your hero needed a fast query but your footer needed a slow one, the footer punished the hero.

Streaming breaks that coupling. With the App Router you wrap slow segments in a `Suspense` boundary, and the server flushes the shell immediately while the slow segment resolves out of band. The browser starts painting the parts that are ready.

> The single most useful mental shift is this: a Suspense boundary is a promise to the browser that everything outside it can paint now.

That promise is what protects LCP. Your largest contentful element, usually the hero heading or hero image, should live outside any Suspense boundary that depends on slow data.

It is worth being precise about the mechanism, because it explains why this works at the network level rather than just conceptually. The server sends the HTML for the shell and the fallbacks immediately, as the first part of a single streamed response. As each suspended segment resolves on the server, it streams additional chunks down the same connection, along with a tiny bit of script that swaps the fallback for the real content in place. The browser never waits for a second request. It is one response that arrives in pieces, fast parts first. That is why the hero can paint while a slow review section is still being fetched on the server: the bytes for the hero were flushed before the review query even finished.

## Placing boundaries with intent

The common mistake is to wrap the entire page body in one boundary. That gives you a loading spinner for the whole route and defeats the purpose. Instead, identify the LCP element and keep it in the static or fast path, then isolate the slow regions.

```tsx
export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <ProductHero id={params.id} />
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews id={params.id} />
      </Suspense>
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations id={params.id} />
      </Suspense>
    </main>
  );
}
```

Here `ProductHero` is rendered eagerly because it carries the LCP element. Reviews and recommendations are slower and personalized, so they stream in. The user sees the hero almost immediately, and the slower regions fill in without blocking.

The reasoning behind where to draw each boundary is worth making explicit, because it is a judgment call, not a mechanical rule. You want each boundary to wrap content that is both slow and not part of the first impression. Reviews qualify: they often require a separate query, they sit below the fold, and the user does not need them to understand what the page is. The hero does not qualify, because it is the first impression and must not be gated behind anything slow. A good heuristic is to ask, for each region, whether the page would feel broken if this appeared a second late. If the answer is no, it is a candidate for its own boundary. If the answer is yes, it belongs in the fast path.

## Skeletons are part of the contract

A streamed boundary needs a fallback that reserves layout. If your skeleton has a different height than the resolved content, the late arrival shifts the page and damages Cumulative Layout Shift even though LCP looks great. Match the skeleton dimensions to the real content. This is not polish, it is correctness.

The trap here is treating the skeleton as a decorative placeholder rather than a structural reservation. A spinner centered in an undersized box looks fine in isolation and then causes a jarring jump when the real content arrives and pushes everything below it down. The fix is to build skeletons that occupy the same space the real content will: the same number of rows at the same heights, the same card dimensions, the same vertical rhythm. Done well, the transition from skeleton to content is a quiet swap in place, with nothing below it moving. That stability is what keeps a good LCP from being undermined by a bad layout shift, and the two metrics have to be protected together or you have only solved half the problem.

## The data layer has to cooperate

Streaming only helps if your fast path is genuinely fast. If `ProductHero` itself awaits a slow database call, you have moved the problem, not solved it. Two patterns help here.

First, colocate data fetching with the component that needs it so each Suspense boundary owns its own waterfall rather than inheriting the page wide one. Second, lean on the framework cache and request memoization so repeated reads of the same resource during a single render do not multiply your latency.

```ts
const getProduct = cache(async (id: string) => {
  const res = await db.product.findUnique({ where: { id } });
  if (!res) notFound();
  return res;
});
```

Wrapping the read in `cache` means the hero and any sibling that needs the same product share one query within the render pass.

There is a subtler waterfall risk that streaming alone does not fix: sequential awaits inside a single component. If the hero fetches the product, then awaits the product's brand, then awaits the brand's logo, those three round trips happen in series and stack up into exactly the slow fast path you were trying to avoid. The remedy is to parallelize independent reads with `Promise.all` so they overlap, and to push genuinely independent slow data into its own boundary so it streams rather than blocking. Streaming decides what is allowed to be late. Parallelizing and caching decide how fast the things that cannot be late actually are. You need both, because a well placed boundary in front of a serial waterfall still leaves the user staring at a slow hero.

## Measuring the thing you changed

Lab numbers from a fast laptop will lie to you. Streaming benefits are most visible on mid tier mobile hardware over a constrained network, which is exactly where real users live. Test with throttling on, and watch field data once the change ships. The lab tells you whether the mechanism works. The field tells you whether it mattered.

A reasonable target on content pages is an LCP under 2.5 seconds at the 75th percentile of real users. Streaming does not guarantee that number, but it removes the structural reason you would miss it, which is one slow dependency holding the whole page hostage.

The discipline of throttled testing is what separates a real improvement from a comforting illusion. On a fast connection, the whole page resolves so quickly that streaming and blocking look identical, and you will conclude the change did nothing. Throttle the CPU and network to mid tier mobile conditions and the difference becomes stark: the blocking version shows nothing until the slowest query returns, while the streamed version paints the hero in a fraction of the time. That gap is the entire value of the work, and it is invisible on the hardware most developers test on. Build the habit of clicking the throttle on before judging any performance change, and then confirm in field data, because the field is the only place that counts users you cannot see.

## When not to stream

Streaming adds complexity, and not every page needs it. A fully static page that renders from cached data has nothing to stream because everything is already fast. Reaching for Suspense there just adds skeletons that flash for no reason. Use streaming where you have a real split between fast primary content and slow secondary content. That is the shape of page where it pays for itself.

The flashing skeleton is a real anti pattern, not a hypothetical. If the content behind a boundary resolves almost instantly, the user sees the skeleton appear and vanish in a blink, which reads as a flicker and feels less polished than if you had simply rendered the content. A boundary is only worth its skeleton when the wait it covers is long enough to be worth acknowledging. For fast content, no boundary is the better choice. This is why streaming is a targeted tool rather than a default to apply everywhere: it earns its keep precisely on the pages that have a genuine fast and slow split, and it adds noise on the ones that do not.

## A workable default

For most teams the right starting posture is simple. Keep the hero and primary copy in the fast path. Wrap anything personalized, anything that hits a slow third party, and anything below the fold in its own boundary with a layout matched skeleton. Verify on throttled mobile, then confirm in field data.

## Practical takeaways

- Keep your LCP element, the hero heading or image, entirely outside any Suspense boundary that depends on slow data.
- Draw boundaries around content that is both slow and not part of the first impression. Ask whether the page would feel broken if this arrived a second late.
- Build skeletons that reserve the real content's dimensions, so streaming protects LCP without trading it for layout shift.
- Make the fast path genuinely fast with `cache`, request memoization, and parallelized independent reads, because streaming hides slow secondary content but not a slow hero.
- Test with CPU and network throttling on, where the benefit is visible, and confirm with field data at the 75th percentile.
- Skip streaming on pages that are already fast, where a flashing skeleton adds noise rather than value.

Streaming is not a magic switch that makes pages fast. It is a tool for making sure that the fast parts of a page are not held back by the slow parts. Used with intent, it is one of the most direct levers you have on the metric your users actually feel.
