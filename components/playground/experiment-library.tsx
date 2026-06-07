"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { categories as allCategories } from "@/lib/playground";
import type { ExperimentCategory, ExperimentMeta } from "@/lib/playground";
import { ExperimentCard } from "./experiment-card";

import { EASE as ease } from "@/lib/motion";

export function ExperimentLibrary({ experiments }: { experiments: ExperimentMeta[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState<ExperimentCategory | "All">("All");

  const filters = ["All", ...allCategories] as const;

  const filtered = React.useMemo(
    () =>
      active === "All"
        ? experiments
        : experiments.filter((e) => e.category === active),
    [experiments, active],
  );

  return (
    <div>
      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-5">
        {filters.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={[
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              active === c
                ? "border-accent bg-accent text-accent-fg"
                : "border-border text-muted hover:border-border-strong hover:text-foreground",
            ].join(" ")}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout={!reduce} className="mt-10 grid gap-6 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((meta) => (
            <motion.div
              key={meta.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease }}
              className="min-w-0"
            >
              <ExperimentCard meta={meta} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
