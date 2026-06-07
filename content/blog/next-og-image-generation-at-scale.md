---
title: "OpenGraph Image Generation with next/og at Scale"
date: "2026-03-09"
excerpt: "Generating dynamic social cards with next/og: how the rendering works, caching strategies, font handling, and keeping it fast across many routes."
category: "Performance"
tags: ["next-og", "opengraph", "edge-runtime", "social-cards"]
slug: "next-og-image-generation-at-scale"
draft: false
---

A good OpenGraph image is the difference between a link that gets clicked when shared and one that gets scrolled past. Generating those images dynamically, one tailored to each page, used to mean running a headless browser or maintaining a separate image service. The `next/og` library collapses that into a function that renders an image from JSX. Using it at scale, across hundreds of pages, takes a little understanding of how it works.

## How next/og actually renders

It is tempting to assume `next/og` runs a browser, but it does not. It uses a library that takes a constrained subset of HTML and CSS expressed as JSX, computes a layout, and rasterizes the result to a PNG. There is no DOM, no JavaScript execution, no full CSS engine. You get flexbox layout, text, images, and a focused set of style properties. That constraint is the source of its speed, because it skips the enormous machinery of a real browser.

The practical consequence is that you write your card with flexbox and inline styles, and you avoid CSS features the renderer does not support. Once you internalize that you are targeting a layout engine and not a browser, the occasional surprise stops being surprising.

```tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const post = await getPost(params.slug);
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
          padding: 80,
          background: "#0f1115",
          color: "white",
        }}
      >
        <div style={{ fontSize: 28, color: "#818cf8" }}>{post.category}</div>
        <div style={{ fontSize: 64, fontWeight: 600 }}>{post.title}</div>
      </div>
    ),
    { ...size }
  );
}
```

Every style is inline, the layout is flexbox, and the result rasterizes in milliseconds.

A few constraints are worth committing to memory before you hit them in production. Every element that contains more than one child must explicitly declare `display: flex`, because the engine does not assume block layout the way a browser does. There is no grid, no float, and no cascade from a stylesheet, so all styling is inline. Background images and gradients work but must be expressed in the supported subset. And because there is no line clamping engine like a browser's, long titles do not truncate on their own. The mental model that prevents most surprises is to assume nothing from CSS works unless you have confirmed it does, and to lean entirely on flexbox for layout.

> The mental shift that makes next/og click is realizing you are not styling a web page. You are describing a layout to a rasterizer, and the rules of that rasterizer are narrower and stricter than CSS.

## Fonts are the most common stumbling block

The default font is fine for prototypes and wrong for a brand. To use your own typeface you load the font data and pass it to `ImageResponse`. The catch is that the renderer needs the actual font bytes, and it only includes glyphs for the weights and subsets you provide. If your title contains characters outside the loaded subset, they render as blanks.

```tsx
const font = await fetch(new URL("./Geist-SemiBold.ttf", import.meta.url)).then(
  (r) => r.arrayBuffer()
);

return new ImageResponse(<Card title={title} />, {
  ...size,
  fonts: [{ name: "Geist", data: font, weight: 600, style: "normal" }],
});
```

For applications with international content, this is where care pays off. Load a font that covers the scripts your content uses, or you will ship cards with missing glyphs to exactly the users whose language you failed to account for.

There is a real tension to manage here between coverage and weight. A font file that covers every script is large, and loading a large font on every image generation adds latency and bandwidth. The pragmatic approach for a multilingual site is to inspect the text you are about to render and load only the font subset that covers it, or to maintain a small set of per script fonts and choose the right one based on the content. Another sharp edge is emoji and symbols, which are not covered by typical text fonts at all and render as blanks unless you supply a dedicated emoji font or strip them. Titles with emoji are common in user generated content, so decide deliberately whether to support them rather than discovering blank boxes after launch.

## Caching is what makes it scale

Generating an image is cheap per request but not free, and you do not want to regenerate the same card on every share. The right posture is to treat these images as cacheable assets. For pages whose content is stable, the image can be generated once and served from cache thereafter. The route convention integrates with the framework's caching, so a statically known route produces a static image at build time, and a dynamic route can be cached at the edge after first generation.

The lever to reason about is how often the underlying content changes. A blog post card changes only when the post changes, so it should be cached aggressively. A card that embeds live data, such as a current follower count, needs a shorter cache life or it will show stale numbers. Match the cache lifetime to the volatility of the content, and the generation cost amortizes to nearly nothing across all the times the link is shared.

It helps to think about who actually requests these images, because it changes the caching math. The requester is almost never the end user's browser directly. It is a platform's link scraper, fetching the image once when someone pastes the URL, and then serving its own cached copy to everyone who sees the post. This means two layers of cache sit between your generator and the viewer: yours and the platform's. Your job is to make the first scrape cheap and correct, because the platform will hold onto whatever it gets for a long time. For content that never changes after publish, generating the image once at build time and serving it as a static asset is the ideal, because the per request cost drops to zero and the only generation ever happens during the build.

## Designing a card system, not one card

At scale you do not want to hand design a card per route. You want a small set of templates parameterized by content. Build a render function that takes a title, an eyebrow, an optional subtitle, and a few tags, and produces a consistent card. Every route then calls that function with its own content, and the visual system stays coherent without per page effort.

```tsx
export function renderCard({ eyebrow, title, subtitle }) {
  return new ImageResponse(
    <CardLayout eyebrow={eyebrow} title={title} subtitle={subtitle} />,
    { width: 1200, height: 630 }
  );
}
```

This is the same instinct you apply to the rest of your UI: build the system once, feed it data many times. A shared card renderer means a brand refresh is one change, not a hundred.

The detail that makes a templated system robust is handling variable content gracefully, because real titles are not all the same length. A template that looks perfect with a five word title overflows or shrinks awkwardly with a twenty word one. Build the template to handle the range: cap the title to a sensible number of lines, choose a font size that works for the longest realistic title rather than the prettiest short one, and ensure the layout degrades cleanly when an optional field like a subtitle is absent. The test of a good card template is not how it looks with ideal content, it is how it looks with the worst real content your routes will throw at it.

## Verifying the output

Social platforms cache the images they scrape, so a broken card can persist in a platform's cache even after you fix it. Verify cards before they ship by rendering the route directly and inspecting the PNG, and use the platforms' own debugging tools to force a fresh scrape when you update a template. Catching a layout overflow or a missing glyph before launch is far cheaper than discovering it after the link has been shared and cached widely.

The persistence of platform caches deserves real respect, because it changes how you ship template changes. When you redesign your card template, every link already shared keeps showing the old image until the platform re-scrapes, which may be never for old posts. The platform debugging tools let you force a refresh for specific URLs, but you cannot realistically refresh thousands of existing links. The practical consequence is to treat the card template as something close to an API: get it right before it ships widely, version it carefully, and accept that old shares will carry the old design for a long time. The cheapest moment to catch a problem is before the first scrape, which is why rendering the route directly and eyeballing the PNG during development is a habit worth keeping.

## Practical takeaways

- Treat `next/og` as a constrained flexbox rasterizer, not a browser. Declare `display: flex` on every multi child element and assume no CSS feature works until confirmed.
- Load real font bytes for your brand, supply only the weights and subsets you need, and plan deliberately for non Latin scripts and emoji rather than shipping blank glyphs.
- Cache in proportion to content volatility. Generate static cards at build time where possible, and remember the requester is usually a platform scraper that caches your output again.
- Build one parameterized card renderer rather than per route cards, so a brand change is one edit.
- Design templates for the worst realistic content: clamp long titles, size type for the longest case, and degrade cleanly when optional fields are missing.
- Verify the PNG before launch, because platform caches hold a broken card long after you fix it and cannot be refreshed in bulk.

## The summary

`next/og` turns dynamic social cards from an infrastructure project into a render function. The keys to using it well at scale are understanding that it is a constrained layout engine and not a browser, handling fonts deliberately so your brand and your international content render correctly, caching the output in proportion to how often the content changes, and building a small templated card system rather than bespoke cards. Get those right and every page on your site can have a tailored, on brand social image that costs almost nothing to serve.
