---
title: "Architecting a Design Token System"
date: "2026-02-25"
excerpt: "A token system is an architecture, not a color list. The three layer model of primitive, semantic, and component tokens, and why it scales."
category: "Design Systems"
tags: ["design-tokens", "design-systems", "theming", "css-variables"]
slug: "design-token-system-architecture"
draft: false
---

A design token system is one of those investments that looks like overhead until the day you need to add a dark mode, rebrand, or support a second product, at which point it is the difference between a config change and a month of find and replace. The mistake most teams make is treating tokens as a flat list of colors. A token system that scales is an architecture with layers, and the layers each have a distinct job.

## The flat list trap

The naive token system is a single layer: a list of named values like `blue500` and `gray900`, referenced directly throughout the UI. This works until the first time you need to change what a color means rather than what it is. When a stakeholder asks to make the brand color warmer, you discover `blue500` is used for the brand, for links, for focus rings, and for a chart series, and you cannot change one without changing all of them. The names describe the value, so they cannot describe intent.

The trap is seductive because it feels efficient at the start. Early in a project there is one brand color and it is blue, so naming it `blue500` and using it everywhere seems perfectly reasonable. The cost is invisible until the requirements change, and requirements always change. The first time a designer wants the focus ring to stay blue while the brand shifts to teal, you are stuck, because the codebase cannot tell the difference between a thing that is blue and a thing that is the brand. Every flat token system eventually hits this wall, and the larger the system, the more painful the day it does.

> A token named after its value can only ever be changed by changing every place it is used. A token named after its purpose can be changed in one place. The whole architecture follows from that distinction.

## The three layer model

The architecture that holds up separates tokens into three layers, each referencing the layer beneath it.

The first layer is primitives. These are the raw values: the full color ramp, the spacing scale, the type scale, the radius steps. They are named by what they are. They are never used directly in components.

```css
:root {
  --indigo-500: oklch(0.66 0.18 264);
  --indigo-600: oklch(0.55 0.2 264);
  --gray-950: oklch(0.16 0.006 265);
  --gray-50: oklch(0.97 0.004 265);
  --space-4: 1rem;
  --radius-lg: 0.75rem;
}
```

The second layer is semantic tokens. These describe intent and reference primitives. This is the layer components actually use. `accent`, `background`, `foreground`, `border`, `surface`. The name says what the token is for, not what color it happens to be.

```css
:root {
  --color-background: var(--gray-50);
  --color-foreground: var(--gray-950);
  --color-accent: var(--indigo-600);
  --color-border: var(--gray-200);
}
```

The third layer, used selectively, is component tokens. These are tokens scoped to a specific component that reference semantic tokens, for cases where a component needs a stable hook that might diverge from the global semantic later. `button-background`, `card-border`. You do not need these for every component, only where a component's styling is likely to be customized independently.

The discipline that makes the model work is the strict directionality of references. Primitives never reference anything, semantics reference only primitives, and component tokens reference only semantics. Components consume semantic or component tokens and never reach past them to a primitive. The moment a component references `--indigo-600` directly, it has punched through the abstraction and reintroduced the flat list problem for that one value, which is exactly the kind of leak that erodes a token system over time. Treat a primitive used directly in a component as a bug, the same way you would treat a magic number in application code.

## Why this scales

The power of the layering shows up the moment you need a variant of the system. A dark theme is not a sweep of overrides scattered through your CSS. It is a reassignment of the semantic layer to different primitives.

```css
.dark {
  --color-background: var(--gray-950);
  --color-foreground: var(--gray-50);
  --color-border: var(--gray-800);
}
```

Every component uses semantic tokens, so flipping the semantic layer flips the entire UI with no component changes. A rebrand is the same shape of change: point `accent` at a different primitive ramp and the whole product updates. The components never knew the literal color, so they never need to be touched.

This generalizes beyond two themes. A high contrast mode is another semantic mapping, one that points foreground and background at primitives further apart on the lightness scale. A second product brand sharing the same component library is yet another mapping over the same primitives. Each variant is a small, self contained block of semantic reassignments, and they can coexist without touching a single component. The reason this is possible is that the components depend on roles, and roles are stable while the values behind them are free to vary. That single property is what turns the most feared design changes into the most boring ones.

## Tokens are a contract, name them like one

Because the semantic layer is what the rest of the system consumes, its names are an API. They should describe roles in a vocabulary the team shares, and they should be stable. Renaming a semantic token is a breaking change in the same way renaming a function is. Invest in getting the names right, keep them consistent, and document what each role means so people use `surface` and `background` for the right things rather than guessing.

A good naming scheme has a clear axis. Many systems use a pattern of role plus modifier: `foreground`, `foreground-muted`, `foreground-subtle` for a hierarchy of text emphasis, or `surface`, `surface-muted` for elevation. The modifiers compose predictably, so a developer can guess the right token rather than hunting for it.

The test of a good naming scheme is whether a developer who has never seen your tokens can guess the right one and be correct. If text on a card needs slightly less emphasis than the heading, a scheme with `foreground` and `foreground-muted` makes the answer obvious, while a scheme with `text-1` and `text-2` forces a trip to the documentation every time. Names that encode intent are self teaching, and on a team that is the difference between a token system people use correctly by default and one they route around because they are not sure which token applies.

## Keep the source of truth singular

Whether your tokens live in CSS custom properties, a JSON file that compiles to multiple platforms, or a dedicated tokens tool, the non negotiable rule is one source of truth. The failure mode is tokens defined in CSS for the web and redefined in a JavaScript object for some other consumer, drifting apart over time until the brand color is subtly different in two places. Define once, generate everything else from that definition.

For a web only project, CSS custom properties are an excellent single source, because they are usable by every layer of the stack: utility frameworks read them, hand written CSS references them, and runtime code can read them with the platform API. There is no compilation step and no second copy.

If you do need to target multiple platforms, native apps, email, a design tool, the right architecture is still one source compiled into many outputs, never many hand maintained copies. A tokens pipeline that reads a single definition and emits CSS, a JavaScript object, and whatever the other platforms need keeps everything in lockstep by construction. The cost is a build step. The benefit is that the brand color is defined in exactly one place and physically cannot diverge across platforms, which is worth far more than the build step costs.

## Where to start

You do not need to architect the perfect system before writing any UI. Start with the two foundational layers, primitives and semantics, and add component tokens only where a real need appears. Resist the urge to tokenize everything immediately, because a token that is referenced in exactly one place and never varies is just indirection. Tokenize the things that recur and the things that need to change together, which is most colors, your spacing scale, your type scale, and your radii.

The pragmatic failure to avoid in the other direction is over tokenization. A token for a value used once, that has never changed and has no reason to, adds a layer of indirection that makes the code harder to read for no benefit. The signal that something deserves a token is recurrence or coordinated change: it appears in many places, or it needs to change in lockstep with other values when a theme flips. A one off margin on a single element is not a token, it is a margin. Reserving tokens for values that genuinely benefit keeps the system meaningful rather than ceremonial.

## Practical takeaways

- Separate primitives, semantics, and component tokens, and enforce strict downward references: components consume roles, never raw values.
- Treat a primitive used directly in a component as a bug, the same way you would treat a magic number.
- Implement theming as semantic remapping. Dark mode, high contrast, and second brands are all small blocks of reassigned semantic tokens over shared primitives.
- Name semantic tokens for intent so a developer can guess the right one. The names are an API and renaming them is a breaking change.
- Keep one source of truth. If you target multiple platforms, compile many outputs from one definition rather than maintaining copies.
- Tokenize what recurs or changes together. Resist tokenizing one off values, which adds indirection without benefit.

## The payoff

A layered token system turns the most painful design changes into the easiest ones. Dark mode becomes a remapping. A rebrand becomes a few lines. Adding a second product theme becomes a new semantic mapping over shared primitives. The reason it works is the one idea at the center: separate what a value is from what it is for, and let components depend only on purpose. Everything good about a token system flows from that single architectural decision.
