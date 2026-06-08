"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { process } from "@/lib/resume";

import { EASE as ease } from "@/lib/motion";

export function Process() {
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState(0);

  return (
    <section id="process" className="border-t border-border bg-surface-muted/30 py-14 md:py-16">
      <div className="container-page">
        <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            How I work
          </h2>
          <p className="max-w-md text-sm text-muted">
            Seven deliberate stages - each one de-risks the next and keeps quality
            measurable.
          </p>
        </div>

        <div>
          {/* Rail */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute left-0 right-0 top-5 hidden h-px bg-border md:block"
            />
            <motion.div
              aria-hidden
              className="absolute left-0 top-5 hidden h-px origin-left bg-accent md:block"
              initial={reduce ? { width: "100%" } : { width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease, delay: 0.2 }}
            />

            <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 md:grid-cols-7 md:gap-0">
              {process.map((p, i) => (
                <motion.div
                  key={p.step}
                  onMouseEnter={() => setActive(i)}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease, delay: i * 0.07 }}
                  className="relative flex flex-col items-center px-2 text-center"
                >
                  <span
                    className={[
                      "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border font-mono text-xs transition-colors duration-300",
                      active === i
                        ? "border-accent bg-accent text-accent-fg"
                        : "border-border bg-background text-muted",
                    ].join(" ")}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-sm font-semibold tracking-tight text-foreground">
                    {p.step}
                  </h3>
                  <p className="mt-1.5 max-w-[10rem] text-xs leading-relaxed text-muted">
                    {p.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
