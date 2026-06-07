---
title: "INP Replaced FID: What It Means for React Apps"
date: "2026-04-26"
excerpt: "Interaction to Next Paint is a far stricter responsiveness metric than FID. Why React apps are exposed, and the patterns that fix it."
category: "Performance"
tags: ["INP", "core-web-vitals", "react", "responsiveness"]
slug: "inp-replacing-fid-react"
draft: false
---

Interaction to Next Paint replaced First Input Delay as a Core Web Vital, and the change matters far more than a metric swap usually does. FID was a low bar that most sites cleared by accident. INP is a strict, full lifecycle responsiveness metric, and React applications are unusually exposed to it.

## What changed and why it is harder

FID measured only the delay before the browser began processing your first interaction. It ignored everything after that: the work your handler did, the rendering it triggered, and the time until the user saw a result. A site could have a great FID and still feel sluggish on every click.

INP measures the full path from interaction to the next paint, and it does this for interactions throughout the page's life, reporting roughly the worst one. It captures input delay, processing time, and presentation delay. In plain terms, INP measures whether the page actually responds when the user does something, not just whether it started to.

The phrase throughout the page's life is the part that catches teams off guard. FID looked at one interaction, the first, which is often a simple click before the app has warmed up much complexity. INP watches every interaction across the whole session and reports near the worst of them. That means the expensive interaction buried deep in a flow, the one that re-renders a giant table or recomputes a derived dataset, is exactly the one INP surfaces. You cannot pass by optimizing the easy first click. You have to make the app responsive everywhere a user might poke it.

> FID asked whether the page picked up the phone. INP asks how long until you actually got an answer.

## Why React apps struggle

React's model is to respond to an interaction by updating state, which triggers a render, which reconciles and commits to the DOM. If that render is large, it runs on the main thread and blocks the paint. A click that sets state high in the tree can cause a re-render of a big subtree, and the user waits for all of it before seeing anything change.

The classic offender is a single piece of state that drives a large list or a complex view. Type into a filter input that re-renders a thousand rows on every keystroke and your INP will be poor, because each keystroke is an interaction that blocks paint while React reconciles the list.

The reason this is specifically a React shaped problem is the synchronous default. By default, a state update and the render it triggers happen as one blocking unit of work on the main thread before the browser gets a chance to paint. Most of the time that work is small and the blocking is imperceptible. But React makes it easy to accidentally connect a cheap interaction to an expensive render, because state and rendering are decoupled in your code even though they are coupled in execution. A one line `setState` in a handler can fan out into reconciling thousands of nodes, and nothing at the call site warns you. INP is the thing that finally makes that hidden cost visible.

## Fix one: separate urgent from non urgent updates

React's concurrent features exist largely for this problem. `useTransition` lets you mark a state update as non urgent, so React can keep the interaction responsive and render the heavy update without blocking the paint.

```tsx
const [query, setQuery] = useState("");
const [isPending, startTransition] = useTransition();

function onChange(e: React.ChangeEvent<HTMLInputElement>) {
  setQuery(e.target.value); // urgent: the input updates immediately
  startTransition(() => {
    setFilter(e.target.value); // non urgent: the heavy list update
  });
}
```

The input stays snappy because its update is urgent and paints right away. The expensive filtered list update happens in a transition that React can interrupt and schedule around, which keeps the interaction's next paint fast.

The mental split this encodes is between what the user must see immediately and what can arrive a beat later. The character they typed must appear in the input instantly, because nothing feels worse than a text field that lags behind your fingers. The filtered results can lag by a frame or two without anyone minding, because the user understands that filtering takes a moment. `useTransition` is how you tell React which is which. The `isPending` flag it returns is useful too: you can show a subtle loading affordance on the results while the transition runs, which communicates that work is happening without blocking the interaction that triggered it.

## Fix two: stop doing expensive work in handlers

INP includes processing time, so heavy synchronous work in an event handler counts directly against you. Parsing a large payload, doing layout math, or sorting a big array inside a click handler all delay the paint. Move that work off the critical path. Defer it, break it into chunks, or push it to a web worker if it is genuinely heavy.

```tsx
function onClick() {
  setSelected(id); // cheap, paints fast
  // expensive analytics work, deferred so it does not block the paint
  requestIdleCallback(() => trackInteraction(id));
}
```

The interaction's visible result happens immediately, and the bookkeeping runs when the main thread is idle.

Analytics is the most common culprit here, and it is almost always deferrable, because the user does not need the tracking call to complete before they see their click register. The same logic applies to any work whose result the user is not waiting on: logging, prefetching, cache warming, syncing state to storage. None of it needs to happen before the next paint, so none of it should run synchronously in the handler. For genuinely heavy computation that does feed the UI, like parsing a large file or running an expensive transform, a web worker is the right home, because it moves the work off the main thread entirely and leaves the thread free to paint.

## Fix three: shrink what re-renders

The cheapest INP win is often to render less. Memoize expensive subtrees so an unrelated state change does not re-reconcile them. Virtualize long lists so the DOM you touch on each interaction stays small regardless of data size. Push state down so it lives close to the components that need it, rather than at the top of the tree where every change re-renders the world.

These are old performance ideas, but INP gives them teeth, because now the cost of a bloated render shows up in a metric that affects how your site is ranked and perceived.

Of the three, pushing state down is the most structural and often the most effective. State lifted to the top of the tree for convenience means every update to it reconciles everything below, even components that do not read it. Moving that state into the smallest subtree that actually needs it shrinks the blast radius of each update from the whole page to a handful of components. Virtualization attacks the same problem from the DOM side: a list of ten thousand rows that only renders the visible fifty keeps both the initial render and every subsequent interaction cheap, regardless of how the data grows. Memoization is the finishing tool, useful for guarding a genuinely expensive subtree from unrelated churn, but it is a patch over a structure rather than a fix for it, so reach for the structural moves first.

## Measuring INP honestly

Lab tools can estimate INP, but it is fundamentally a field metric because it depends on real interactions over a real session. Instrument it with the web vitals library and watch your field data, segmented by device class. The worst INP almost always comes from mid tier mobile devices under load, which is where your real users are and where your development laptop lies to you.

```ts
import { onINP } from "web-vitals";

onINP((metric) => {
  sendToAnalytics({ name: metric.name, value: metric.value });
});
```

A practical target is an INP under 200 milliseconds at the 75th percentile. Crossing 500 milliseconds is the zone where users start to feel that the app is fighting them.

The segmentation by device class is not optional advice, it is the whole game. An aggregate INP number hides the truth, because your fast desktop users dilute the slow mobile ones into a comfortable looking average. Break the field data out by device tier and the real picture appears: the mid range Android phone on a congested network, doing exactly the interaction your laptop made look instant, is sitting at four times your target. That device is where your users actually live, and optimizing for it is what moves the metric. Trust field data over lab numbers, and trust the slow segment over the average.

## The mindset shift

The deeper lesson is that responsiveness is now a measured, ranked property of your app, not a vibe. For React developers that means treating every interaction as a small performance budget: keep the urgent update tiny, defer everything else, and render as little as the feature allows. INP rewards apps that respect the main thread, and it quietly penalizes the ones that treat every click as a license to re-render everything.

## Practical takeaways

- Understand that INP watches every interaction across the session and reports near the worst, so the expensive interaction deep in a flow is the one that defines your score.
- Split urgent from non urgent state with `useTransition`: paint the thing the user must see immediately and let heavy derived updates run in a transition.
- Keep handlers cheap. Defer analytics and other fire and forget work with `requestIdleCallback`, and push genuinely heavy computation to a web worker.
- Shrink the render blast radius by pushing state down to the smallest subtree that needs it, virtualizing long lists, and memoizing only where a subtree is genuinely expensive.
- Measure INP in the field with the web vitals library and segment by device class, because aggregate numbers hide the slow mobile reality.
- Target under 200 milliseconds at the 75th percentile, and treat anything past 500 as the zone where the app feels like it is fighting the user.
