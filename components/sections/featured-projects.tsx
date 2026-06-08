"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CircleCheck } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion";
import { projects } from "@/lib/resume";
import { cn } from "@/lib/utils";

import { EASE as ease } from "@/lib/motion";

export function FeaturedProjects() {
  const featured = projects.filter((p) => p.featured);
  const reduce = useReducedMotion();

  return (
    <Section id="work" className="border-t border-border py-24 md:py-36">
      <div className="container-page">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal className="max-w-3xl">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Selected work
            </span>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl">
              Case studies, not screenshots.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Three production platforms - the challenge, the engineering decisions,
              and the results that followed.
            </p>
          </Reveal>
          <Link
            href="/projects"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground"
          >
            All projects
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-16 flex flex-col gap-6 md:gap-8">
          {featured.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease }}
            >
              <Link
                href={`/projects/${p.slug}`}
                className="group block overflow-hidden rounded-3xl border border-border bg-surface transition-all duration-300 hover:border-border-strong hover:shadow-elevated"
              >
                <div
                  className={cn(
                    "grid gap-0 lg:grid-cols-2",
                    i % 2 === 1 && "lg:[direction:rtl]"
                  )}
                >
                  {/* Visual */}
                  <div className="relative min-h-[15rem] overflow-hidden border-b border-border bg-surface-muted/60 p-7 lg:border-b-0 lg:[direction:ltr]">
                    <ProjectVisual
                      name={p.name}
                      results={p.results}
                      reduce={!!reduce}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-between gap-6 p-7 [direction:ltr] md:p-9">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-subtle">{p.year}</span>
                        <span className="h-1 w-1 rounded-full bg-border-strong" />
                        <span className="text-xs text-muted">{p.role}</span>
                      </div>
                      <h3 className="mt-3 flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
                        {p.name}
                        <ArrowUpRight className="h-5 w-5 text-subtle transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                      </h3>
                      <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
                        {p.tagline}
                      </p>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <CaseBlock label="Challenge" body={p.challenge} />
                        <CaseBlock label="Solution" body={p.solution} />
                      </div>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-2">
                        {p.results.slice(0, 2).map((r) => (
                          <span
                            key={r}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-foreground"
                          >
                            <CircleCheck className="h-3.5 w-3.5 text-accent" />
                            {r}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.stack.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-subtle"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function CaseBlock({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-accent">
        {label}
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-muted line-clamp-4">{body}</p>
    </div>
  );
}

/** Abstract, branded "dashboard" preview standing in for a screenshot. */
function ProjectVisual({
  name,
  results,
  reduce,
}: {
  name: string;
  results: string[];
  reduce: boolean;
}) {
  const headline = results[0] ?? "";
  return (
    <div className="relative flex h-full flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-dots opacity-30 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_75%)]"
      />
      {/* browser chrome */}
      <div className="relative flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        <span className="ml-3 truncate rounded-md border border-border bg-background/60 px-2 py-0.5 font-mono text-[10px] text-subtle">
          {name.toLowerCase().replace(/\s/g, "")}.com
        </span>
      </div>

      <div className="relative mt-6 flex flex-1 flex-col justify-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="rounded-xl border border-border bg-background/70 p-5 backdrop-blur-sm"
        >
          <div className="text-xs text-subtle">Headline result</div>
          <div className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            {headline}
          </div>
          <div className="mt-4 space-y-2">
            {results.slice(1, 3).map((r) => (
              <div key={r} className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                  <motion.div
                    className="h-full rounded-full bg-accent/70"
                    initial={reduce ? { width: "90%" } : { width: 0 }}
                    whileInView={{ width: "90%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease, delay: 0.3 }}
                  />
                </div>
                <span className="w-32 shrink-0 truncate text-[11px] text-muted">{r}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
