"use client";

import * as React from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { experience } from "@/lib/resume";

import { EASE as ease } from "@/lib/motion";

export function Timeline() {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section id="experience" className="border-t border-border py-20 md:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        {/* Sticky left */}
        <div className="lg:sticky lg:top-28 lg:h-fit lg:self-start">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Career
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Five years of shipping production software.
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-muted">
            A track record across travel-tech, hospitality, and SaaS - consistently
            focused on performance, scale, and measurable business outcomes.
          </p>

          <div className="mt-8 hidden items-center gap-4 lg:flex">
            <div className="relative h-1.5 w-40 overflow-hidden rounded-full bg-border">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-accent"
                style={{ scaleX: reduce ? 1 : progress, transformOrigin: "left" }}
              />
            </div>
            <span className="text-xs text-subtle">Now → 2021</span>
          </div>
        </div>

        {/* Scrollable right */}
        <div ref={ref} className="relative">
          <div
            aria-hidden
            className="absolute left-[7px] top-2 h-full w-px bg-border md:left-[9px]"
          />
          <motion.div
            aria-hidden
            className="absolute left-[7px] top-2 w-px origin-top bg-accent md:left-[9px]"
            style={{ height: "100%", scaleY: reduce ? 1 : progress }}
          />

          <div className="flex flex-col gap-10">
            {experience.map((job, i) => (
              <motion.article
                key={job.company}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease, delay: i * 0.04 }}
                className="relative pl-9 md:pl-12"
              >
                <span className="absolute left-0 top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border border-border-strong bg-background">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                </span>

                <div className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-strong md:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {job.company}
                    </h3>
                    <span className="font-mono text-xs text-subtle">{job.period}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                    <span className="font-medium text-foreground/90">{job.role}</span>
                    <span className="h-1 w-1 rounded-full bg-border-strong" />
                    <span>{job.industry}</span>
                    <span className="h-1 w-1 rounded-full bg-border-strong" />
                    <span>{job.location}</span>
                  </div>

                  <ul className="mt-5 flex flex-col gap-3">
                    {job.impact.slice(0, 3).map((point) => (
                      <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
                        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {job.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-border bg-background/50 px-2 py-0.5 text-xs text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
