/**
 * Playground experiment registry - metadata only (no React).
 * The live components are mapped by `id` in components/playground/experiments.tsx.
 * This file is safe to import from Server Components.
 */

export type ExperimentCategory =
  | "Motion Systems"
  | "UI Interaction"
  | "Data Viz"
  | "Layout Systems"
  | "Microinteractions";

export const categories: ExperimentCategory[] = [
  "Motion Systems",
  "UI Interaction",
  "Data Viz",
  "Layout Systems",
  "Microinteractions",
];

export type ExperimentMeta = {
  id: string;
  title: string;
  category: ExperimentCategory;
  tags: string[];
  /** One line - what the experiment is. */
  purpose: string;
  /** Why it exists / what production problem it rehearses. */
  why: string;
  featured?: boolean;
};

export const experiments: ExperimentMeta[] = [
  {
    id: "spotlight-grid",
    title: "Spotlight Grid",
    category: "UI Interaction",
    tags: ["pointer-tracking", "CSS variables", "depth"],
    purpose:
      "A grid of cards that respond to the cursor with a radial spotlight and subtle parallax tilt.",
    why: "Pointer-aware surfaces add depth without weight. The same technique highlights focus in dashboards and pricing tables - and degrades to a calm static state on touch.",
    featured: true,
  },
  {
    id: "command-palette",
    title: "Command Palette",
    category: "UI Interaction",
    tags: ["keyboard-first", "fuzzy search", "a11y"],
    purpose:
      "A fully keyboard-navigable command surface with fuzzy filtering and an animated active state.",
    why: "Command palettes are how power users move through real products. This rehearses focus management, keyboard navigation, and shared-layout highlighting.",
    featured: true,
  },
  {
    id: "metric-explorer",
    title: "Metric Explorer",
    category: "Data Viz",
    tags: ["interactive model", "animation", "tabular-nums"],
    purpose:
      "Sliders feed a small latency model and animate the resulting distribution in real time.",
    why: "Performance work means making trade-offs legible. Turning inputs into an animated, readable chart is the core of any metrics dashboard.",
    featured: true,
  },
  {
    id: "stagger-lab",
    title: "Stagger Lab",
    category: "Motion Systems",
    tags: ["orchestration", "replayable", "reduced-motion"],
    purpose:
      "A replayable staggered reveal with adjustable choreography - tight, balanced, or loose.",
    why: "Stagger timing is the difference between motion that feels engineered and motion that feels random. This is the system behind every list and grid reveal on the site.",
  },
  {
    id: "bento-morph",
    title: "Bento Morph",
    category: "Layout Systems",
    tags: ["shared layout", "FLIP", "responsive"],
    purpose:
      "A bento layout that smoothly re-flows between an overview and a focused arrangement.",
    why: "Layout transitions keep users oriented when a view changes. Shared-layout animation makes a re-arrangement feel like one continuous space.",
  },
  {
    id: "magnetic-controls",
    title: "Magnetic Controls",
    category: "Microinteractions",
    tags: ["spring physics", "cursor", "touch-safe"],
    purpose:
      "Controls that lean toward the cursor with spring physics and settle back on release.",
    why: "Microinteractions signal that a surface is alive and responsive. Tuned springs - not linear tweens - are what make it feel physical rather than gimmicky.",
  },
  {
    id: "typewriter-intelligence",
    title: "Typewriter Intelligence",
    category: "Motion Systems",
    tags: ["variable timing", "cursor", "reduced-motion"],
    purpose:
      "A typewriter that types with human cadence - variable speed, punctuation pauses, faster deletes - across rotating phrases.",
    why: "Naive character loops read as robotic. Modeling real typing rhythm is the same instinct behind perceived-performance work: timing is what makes motion feel alive instead of mechanical.",
    featured: true,
  },
  {
    id: "spring-playground",
    title: "Physics Spring Playground",
    category: "Microinteractions",
    tags: ["drag", "spring physics", "live tuning"],
    purpose:
      "Draggable elements that spring back to origin with live-tunable stiffness and damping, and gently repel when they overlap.",
    why: "Spring constants are abstract until you feel them. Exposing stiffness and damping as live controls is how you build intuition for the physics behind every polished microinteraction.",
  },
  {
    id: "token-highlighter",
    title: "Live Code Token Highlighter",
    category: "UI Interaction",
    tags: ["regex tokenizer", "overlay mirror", "real-time"],
    purpose:
      "A code editor that classifies and colors tokens in real time using a regex tokenizer painted into a mirror overlay - no syntax library.",
    why: "The textarea-overlay mirror is the technique behind every in-browser code editor. Tokenizing by hand rehearses the parsing and DOM-sync discipline that real editors demand.",
  },
  {
    id: "scroll-timeline",
    title: "Scroll Timeline Visualizer",
    category: "Motion Systems",
    tags: ["scroll-driven", "IntersectionObserver", "keyboard"],
    purpose:
      "A horizontal timeline scrubbed by a contained scroll area - progress fills, milestones reveal in sequence, and a playhead tracks position.",
    why: "Scroll-linked motion is easy to do badly. Containing it to one element, falling back from CSS scroll-timelines to IntersectionObserver, and keeping it keyboard-driven is the production-grade version.",
  },
];

export const featuredExperiments = experiments.filter((e) => e.featured);
