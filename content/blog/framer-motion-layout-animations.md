---
title: "Framer Motion Layout Animations: A Deep Dive"
date: "2026-05-04"
excerpt: "How the layout prop and shared layout animations work under the hood, why they are smooth, and the pitfalls that cause janky transitions."
category: "React"
tags: ["framer-motion", "layout-animation", "shared-layout", "react"]
slug: "framer-motion-layout-animations"
draft: false
---

Layout animations are the feature that makes Framer Motion feel like magic. You change where an element lives in the DOM, and it glides to its new position instead of snapping. Understanding how that works turns the magic into a tool you can wield deliberately, including knowing when it will betray you.

## The core idea: animate the difference

When you add the `layout` prop to a motion element, Framer Motion does not animate your CSS properties directly. Instead it measures the element's position before the change, lets React commit the new layout, measures again, and then applies a transform that makes the element appear to still be in the old position. It then animates that transform to zero. The element snaps to its final layout instantly, but the transform makes the transition look continuous.

```tsx
<motion.div layout className="card">
  {expanded ? <FullContent /> : <Summary />}
</motion.div>
```

When `expanded` flips, the card's size changes. Framer Motion captures the old and new bounding boxes and animates the visual gap. Crucially it animates with `transform`, which is cheap and runs on the compositor, rather than animating width and height, which would force layout on every frame.

This technique has a name worth knowing, because it explains both the power and the limits of the feature. It is the FLIP approach: First, Last, Invert, Play. You record the First position, let the DOM jump to the Last position, Invert the change with a transform so it visually appears unchanged, and then Play the transform back to zero so it animates to the real position. Every smooth layout animation you have admired is some variation of this four step dance. Understanding it tells you immediately why certain things work and others do not: anything that can be expressed as a transform between two measured boxes will be smooth, and anything that cannot will fight the technique.

> The reason layout animations are smooth is that they never animate layout properties. They animate a transform that fakes the in between, and that is why they stay at sixty frames per second.

## Shared layout with layoutId

The second pillar is `layoutId`. Two elements that share a `layoutId` are treated as the same element across mounts. When one unmounts and another with the same id mounts, Framer Motion animates from the old element's box to the new one. This is how you build a tab indicator that slides, or a thumbnail that expands into a detail view.

```tsx
{tabs.map((tab) => (
  <button key={tab.id} onClick={() => setActive(tab.id)}>
    {tab.label}
    {active === tab.id && (
      <motion.span layoutId="indicator" className="underline" />
    )}
  </button>
))}
```

Only one indicator exists at a time, but because they share `layoutId="indicator"`, the underline appears to slide from the old tab to the new one. You did not animate position, you just moved which button renders the element, and the shared layout system connected the two.

The mental model that makes `layoutId` click is to think of it as identity across mounts rather than a single persistent element. There is never one underline moving between tabs. There is an underline that unmounts under the old tab and a different underline that mounts under the new one, and Framer Motion, seeing they share an id, animates the visual transition between their two boxes. This is why the pattern composes so well with conditional rendering: you render the element wherever it currently belongs, and the shared layout system handles the continuity. The classic application is the thumbnail to detail transition, where a small image in a grid carries the same `layoutId` as the large image in the opened detail view, and the grid item appears to expand into the detail.

## The distortion problem and how to correct it

The honest difficulty with layout animations is that animating a transform to fake a size change can distort children. If a card grows and you scale it, the text inside scales too, which looks wrong. Framer Motion handles the common cases by also applying a counter scale to children, but it needs your help in two ways.

First, give animating children their own `layout` prop so they participate in the correction. Second, prefer animating elements whose border radius and content can tolerate the transform. A border radius will visibly warp during a scale unless the element also has `layout`, which tells Framer Motion to keep the radius correct frame by frame.

```tsx
<motion.div layout style={{ borderRadius: 16 }}>
  <motion.h3 layout="position">{title}</motion.h3>
</motion.div>
```

Using `layout="position"` on the heading animates only its position, not its size, which is usually what you want for text that should move but not stretch.

The distinction between `layout`, `layout="position"`, and `layout="size"` is the most useful tuning knob in the whole feature, and it is worth committing to memory. Plain `layout` animates both position and size, which is right for a container that genuinely changes dimensions. `layout="position"` animates only where the element sits, which is what you want for text and other content that should glide to a new location without being stretched along the way. `layout="size"` animates only dimensions. Reaching for `position` on text inside a resizing container is the single most common fix for the distortion problem, because it lets the container resize while its label simply travels to its new home undistorted.

## AnimatePresence is the other half

Shared layout transitions between mounted and unmounted elements need `AnimatePresence` so the exiting element stays in the tree long enough to animate out. Without it, the old element vanishes before the transition can run and you get a pop instead of a glide.

```tsx
<AnimatePresence>
  {selected && (
    <motion.div layoutId={`card-${selected.id}`}>
      <Detail item={selected} />
    </motion.div>
  )}
</AnimatePresence>
```

The reason `AnimatePresence` is necessary is a fact about React: when a component is removed from the tree, its DOM is gone immediately, with no opportunity to animate. `AnimatePresence` intercepts the removal, keeps the exiting element mounted until its exit animation finishes, and only then lets it leave. For shared layout transitions this matters because the system needs both the old and new boxes to exist at the moment of transition. A frequent real world bug is a detail view that pops in correctly but vanishes abruptly on close, and the cause is almost always a missing `AnimatePresence` around the exiting element.

## The pitfalls that cause jank

A few patterns reliably break layout animations. Animating a layout that changes on every render, such as a list that reorders constantly, fights the measurement cycle and produces stutter. Wrapping a layout animated element in a parent that also transforms can compound transforms in ways that look wrong. And applying `layout` to very large subtrees forces a lot of measurement, which can drop frames on lower end devices.

The defensive habit is to keep layout animated elements as small and self contained as the design allows, and to respect reduced motion preferences so users who opt out get an instant change instead of an animation they did not ask for.

```tsx
const reduce = useReducedMotion();

<motion.div layout transition={reduce ? { duration: 0 } : undefined}>
```

It is worth being concrete about the nested transform pitfall, because it produces bugs that look mysterious. If a layout animated element sits inside a parent that is itself being scaled or transformed, the two transforms multiply, and the child can appear to overshoot, lag, or warp in ways that seem to defy the code. The fix is structural: avoid nesting layout animations inside other transforming elements, and if you must, give the intermediate elements their own `layout` prop so Framer Motion can account for them in its measurement. The large subtree problem is more about budget than correctness. Measuring and counter scaling a deep tree on every frame is expensive, and on a mid tier phone it is where a buttery animation on your laptop becomes a stuttering one for real users. Keep the animated region tight.

## When it earns its place

Layout animations are not free, and not every state change deserves one. They earn their place when continuity communicates meaning: a list item moving to a new position, a panel expanding, a selected item growing into a detailed view. In those moments the animation is not decoration, it is an explanation of what just changed. Used there, and kept off the high churn parts of your UI, layout animations are one of the highest leverage tools for making an interface feel considered.

The question to ask before adding one is whether the motion explains a relationship. When a card expands into a detail view, the animation tells the user this detail came from that card, which preserves their sense of place. When a reordered list item slides to its new spot, the motion shows them what moved and where. Those are real communication. By contrast, animating a layout change that the user did not initiate and cannot connect to anything is just movement for its own sake, and movement without meaning is noise that costs performance and patience. The discipline is to spend layout animations where continuity carries information and to skip them everywhere else.

## Practical takeaways

- Remember the FLIP technique underneath: layout animations work by measuring two boxes and animating a transform between them, which is why transformable changes are smooth and others fight the system.
- Treat `layoutId` as identity across mounts. You render the element wherever it currently belongs and the shared layout system animates the continuity.
- Reach for `layout="position"` on text and content inside a resizing container to avoid the distortion that plain `layout` causes.
- Wrap exiting elements in `AnimatePresence` so they survive long enough to animate out, especially for shared layout transitions.
- Avoid nesting layout animations inside other transforming parents, and keep animated subtrees small to protect frame rate on low end devices.
- Respect reduced motion, and spend layout animations only where the motion explains a relationship rather than decorating a change.

Used deliberately, with the FLIP model in mind and the pitfalls avoided, layout animations turn ordinary state changes into transitions that feel like the interface is reasoning alongside the user.
