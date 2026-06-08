/**
 * Motion system - single source of truth.
 * Every animated surface on the site shares this easing curve so timing reads
 * as one coherent system rather than per-component guesses. Server-safe (no
 * "use client") so it can be imported from anywhere.
 */

/** The one easing curve. cubic-bezier(0.21, 0.47, 0.32, 0.98) - calm, confident settle. */
export const EASE = [0.21, 0.47, 0.32, 0.98] as const;
