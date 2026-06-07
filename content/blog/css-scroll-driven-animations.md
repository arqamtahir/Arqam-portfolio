---
title: "CSS Scroll Driven Animations Without JavaScript"
date: "2026-02-13"
excerpt: "Scroll timelines and view timelines let the browser run scroll animations off the main thread. How they work and where they replace JavaScript."
category: "CSS"
tags: ["scroll-driven-animations", "css", "performance", "scroll-timeline"]
slug: "css-scroll-driven-animations"
draft: false
---

For years, any animation tied to scroll position meant JavaScript. You listened to the scroll event, read the scroll position, did some math, and updated styles, all on the main thread, all fighting for the same budget as everything else the page needed to do. Scroll driven animations move that entire pattern into CSS, where the browser can run it off the main thread. The result is smoother animations and a lot less code.

## The problem with scroll listeners

The traditional approach has a structural flaw. Scroll events fire rapidly, your handler runs on the main thread, and the work it does, reading layout and writing styles, is exactly the kind of work that causes jank when the main thread is busy. Even with throttling and `requestAnimationFrame`, you are coupling a visual effect to the responsiveness of your JavaScript. On a loaded page, the animation stutters precisely when the page is under stress.

There is a second, sneakier cost to the listener approach: layout thrashing. A naive scroll handler reads a layout property, like an element's bounding rectangle, and then writes a style based on it. Doing both in the same frame forces the browser to recalculate layout synchronously, and doing it on every scroll event multiplies that cost. Experienced engineers learn to batch reads and writes and to cache measurements, but that is a lot of careful machinery to maintain for what is conceptually a simple mapping from scroll position to style. Scroll driven animations remove the machinery entirely.

> A scroll listener ties your animation's smoothness to your main thread's free time. Scroll driven animations cut that cord and let the compositor run the effect regardless of what your JavaScript is doing.

## Two timelines, two use cases

CSS scroll driven animations introduce two new kinds of timeline. A scroll timeline maps an animation's progress to how far a scroll container has been scrolled. A view timeline maps progress to an element's position as it moves through the viewport. They cover the two things people actually build: effects driven by overall scroll position, like a reading progress bar, and effects driven by an element entering the viewport, like a reveal as a card scrolls into view.

A reading progress bar is the canonical scroll timeline example.

```css
@keyframes grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.progress-bar {
  transform-origin: left;
  animation: grow linear;
  animation-timeline: scroll(root block);
}
```

There is no JavaScript here at all. The `scroll(root block)` timeline ties the animation's progress to the document's vertical scroll, so the bar fills as the user reads. The browser runs it on the compositor, so it stays smooth no matter what else is happening.

The `linear` timing function is doing something important and easy to overlook. With a scroll driven animation, the timeline is scroll position, not elapsed time, so an easing curve would warp the relationship between how far you have scrolled and how full the bar is. For a progress indicator you almost always want `linear`, so the bar position is a faithful mirror of scroll position. For reveal effects, by contrast, a gentle ease can feel nicer, because there the goal is aesthetic rather than informational. Choosing the timing function is choosing whether the animation reports a fact or expresses a feeling.

## View timelines for reveal effects

The more common UI need is revealing elements as they enter the viewport. A view timeline drives an animation based on a subject's progress through the scroll port, and the `animation-range` lets you say which part of that traversal the animation should span.

```css
@keyframes reveal {
  from { opacity: 0; transform: translateY(2rem); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

The `view()` timeline tracks each card as it crosses the viewport, and the range says animate across the entry phase, from when the card first appears to when it has fully entered. This replaces the typical intersection observer plus class toggling pattern entirely, with no JavaScript and no observer to manage.

The `animation-range` keywords reward a closer look, because they are where you tune how the effect feels. The `entry` phase covers the subject crossing into the viewport from the leading edge, and `cover` covers its entire transit across the viewport. Saying `entry 0% entry 100%` means the card fully reveals by the time it has finished entering, which can feel abrupt for elements near the bottom of a tall card. A softer choice like `entry 0% cover 30%` lets the reveal complete a little later, after the element has settled into view, which often reads as more graceful. These keywords are the dial you turn to match the motion to the content.

## The progressive enhancement story

The right way to ship these today is as enhancement. Scroll driven animations are well supported in current browsers and are designed to fail gracefully. A browser that does not understand `animation-timeline` simply ignores it, so you want your base state to be the resolved, visible state, with the animation as a layer on top. Done this way, users on older browsers see the content in its final form rather than stuck in the animation's starting state.

```css
.card {
  opacity: 1; /* visible by default, so non supporting browsers are fine */
}

@supports (animation-timeline: view()) {
  .card {
    animation: reveal linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 30%;
  }
}
```

Wrapping the animation in an `@supports` query and keeping the element visible by default means you never trap content behind an effect a browser cannot run.

This guards against the single worst failure mode of scroll reveals: content that starts at `opacity: 0` and stays there because the mechanism that was supposed to reveal it never ran. That failure does not just look broken, it hides content entirely, which is a correctness and accessibility problem, not a cosmetic one. The discipline of making the visible state the default and the animation the enhancement means the worst case is a missing flourish, never missing content. That is the right place for the risk to land.

## Respecting reduced motion

Because these are real animations, they fall under the same accessibility obligation as any other motion. Users who request reduced motion should not be subjected to scroll triggered movement. The clean approach is to gate the animation behind a media query so it only applies for users who have not asked motion to be reduced.

```css
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .card { animation: reveal linear both; animation-timeline: view(); }
  }
}
```

Note the structure of the guards, because the order communicates intent. The outer guard is the user's stated preference, the inner guard is browser capability, and only inside both do you opt the element into motion. This nesting reads as a sentence: if the user has not asked for less motion, and the browser can do this, then animate. Reduced motion is not only about vestibular comfort either. On a low powered device, suppressing a flood of scroll reveals can meaningfully improve how the page feels, so honoring the preference often helps more users than the ones who explicitly set it.

## Where they replace JavaScript and where they do not

Scroll driven animations replace the large category of scroll position effects: progress indicators, parallax, reveal on scroll, scroll linked color shifts, sticky header transitions. Anything whose progress is a pure function of scroll position is a candidate, and moving it to CSS is almost always a win in both performance and code size.

They do not replace effects that need logic beyond scroll position, such as animations that depend on application state, that trigger side effects, or that require complex sequencing tied to events other than scroll. For those, JavaScript is still the tool. The point is not to eliminate JavaScript but to stop using it for the large, common class of effects that are really just a mapping from scroll position to style.

A useful test is to ask whether the effect needs to do anything other than set styles as a function of scroll. A reveal that just changes opacity and transform is pure mapping and belongs in CSS. An effect that needs to fire analytics when an element is seen, or that pauses a video when it scrolls out of view, has a side effect, and side effects are still JavaScript's job. You can even combine the two: let CSS own the visual mapping and let a lightweight observer own the side effect, each doing the part it is good at.

## Practical takeaways

- Use a scroll timeline for effects tied to overall scroll position, like progress bars, and a view timeline for effects tied to an element entering the viewport, like reveals.
- Prefer `linear` timing for informational effects so the animation faithfully mirrors scroll position, and reserve easing for purely aesthetic motion.
- Tune `animation-range` with the `entry` and `cover` phases to control how early or late a reveal completes.
- Make the resolved, visible state the default and add the animation inside an `@supports` query, so unsupported browsers show content rather than hiding it.
- Gate motion behind `prefers-reduced-motion: no-preference`, nesting capability detection inside the preference check.
- Keep JavaScript for effects with side effects or logic beyond scroll position, and let CSS own the pure scroll to style mapping.

## The takeaway

Scroll driven animations let the browser do what it is good at, running visual effects on the compositor, and free your main thread for the work only JavaScript can do. For the many UI effects that are simply tied to scroll position, they are less code, smoother motion, and better behavior under load. Adopt them as progressive enhancement, gate them behind reduced motion, and you get a meaningful upgrade for free on the browsers that support them with no penalty on the ones that do not.
