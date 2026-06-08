"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CircleCheck, Search, X } from "lucide-react";
import type { Project, ProjectCategory } from "@/lib/resume";
import { ProjectCard } from "./project-card";

import { EASE as ease } from "@/lib/motion";

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState<ProjectCategory | "All">("All");
  const [query, setQuery] = React.useState("");

  const categories = React.useMemo(() => {
    const set = new Set<ProjectCategory>();
    projects.forEach((p) => p.category.forEach((c) => set.add(c)));
    return ["All", ...Array.from(set)] as const;
  }, [projects]);

  const featured = projects.find((p) => p.featured) ?? projects[0];

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesCat = active === "All" || p.category.includes(active);
      const matchesQuery =
        !q ||
        [p.name, p.tagline, p.challenge, p.solution, ...p.stack, ...p.results]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchesCat && matchesQuery;
    });
  }, [projects, active, query]);

  return (
    <>
      {/* Featured project */}
      {featured && active === "All" && !query && (
        <section className="container-page mt-4">
          <div className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Featured case study
          </div>
          <FeaturedProject project={featured} reduce={!!reduce} />
        </section>
      )}

      {/* Controls */}
      <section className="container-page mt-16">
        <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
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

          <div className="relative w-full md:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, tech, results…"
              aria-label="Search projects"
              className="h-10 w-full rounded-full border border-border bg-surface pl-9 pr-9 text-sm text-foreground placeholder:text-subtle focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <motion.div layout className="mt-10 grid gap-6 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface-muted/40 p-10 text-center">
            <p className="text-sm text-muted">
              No projects match{" "}
              <span className="font-medium text-foreground">
                {query ? `“${query}”` : active}
              </span>
              .
            </p>
            <button
              onClick={() => {
                setQuery("");
                setActive("All");
              }}
              className="mt-3 text-sm font-medium text-accent hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}

function FeaturedProject({ project, reduce }: { project: Project; reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group grid overflow-hidden rounded-3xl border border-border bg-surface transition-all duration-300 hover:border-border-strong hover:shadow-elevated lg:grid-cols-2"
      >
        {/* Left - narrative */}
        <div className="flex flex-col justify-between gap-8 p-8 md:p-10">
          <div>
            <div className="flex items-center gap-3 text-xs">
              <span className="font-mono text-subtle">{project.year}</span>
              <span className="h-1 w-1 rounded-full bg-border-strong" />
              <span className="text-muted">{project.role}</span>
            </div>
            <h2 className="mt-4 flex items-center gap-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {project.name}
              <ArrowUpRight className="h-6 w-6 text-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
              {project.tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((t) => (
              <span
                key={t}
                className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-subtle"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right - outcomes */}
        <div className="flex flex-col justify-center gap-3 border-t border-border bg-surface-muted/40 p-8 md:p-10 lg:border-l lg:border-t-0">
          <span className="text-xs font-medium uppercase tracking-wide text-accent">
            Headline outcomes
          </span>
          {project.results.map((r) => (
            <div key={r} className="flex items-start gap-2.5">
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span className="text-sm leading-relaxed text-foreground">{r}</span>
            </div>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
