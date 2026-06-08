"use client";

import * as React from "react";
import { experimentComponents } from "./experiments";
import type { ExperimentMeta } from "@/lib/playground";

/**
 * Shared chrome for a single experiment: header (title · category),
 * purpose line, the live interactive area, tags, and a "why it exists" note.
 * Used by both the Featured section and the full Library.
 */
export function ExperimentCard({
  meta,
  variant = "default",
}: {
  meta: ExperimentMeta;
  variant?: "default" | "featured";
}) {
  const Live = experimentComponents[meta.id];
  const liveRef = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const node = liveRef.current;
    if (!node || inView) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView]);

  return (
    <article
      className={[
        "group flex w-full min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-colors hover:border-border-strong",
        variant === "featured" ? "" : "h-full",
      ].join(" ")}
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-4 border-b border-border p-6 md:p-7">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {meta.category}
          </div>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            {meta.title}
          </h3>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">
            {meta.purpose}
          </p>
        </div>
      </header>

      {/* Live area */}
      <div
        ref={liveRef}
        className="relative w-full min-w-0 flex-1 overflow-hidden bg-surface-muted/30 p-6 md:p-7"
      >
        {Live && inView ? <Live /> : <div className="min-h-[12rem]" aria-hidden />}
      </div>

      {/* Footer - tags + why */}
      <footer className="border-t border-border p-6 md:p-7">
        <div className="flex flex-wrap gap-1.5">
          {meta.tags.map((t) => (
            <span
              key={t}
              className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-subtle"
            >
              {t}
            </span>
          ))}
        </div>
        <p className="mt-4 border-l-2 border-border pl-3 text-sm leading-relaxed text-muted">
          <span className="font-medium text-foreground">Why it exists - </span>
          {meta.why}
        </p>
      </footer>
    </article>
  );
}
