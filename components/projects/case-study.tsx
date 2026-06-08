"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  Lightbulb,
} from "lucide-react";
import type { CaseStudy as CaseStudyData, Project } from "@/lib/resume";
import { ArchitectureDiagram } from "./architecture-diagram";

import { EASE as ease } from "@/lib/motion";

const SCREENSHOT_SLUGS = new Set([
  "nice2stay",
  "staywithlumina",
  "hotel-weekend",
]);

const SECTIONS = [
  { id: "summary", label: "Executive summary" },
  { id: "problem", label: "The problem" },
  { id: "solution", label: "The solution" },
  { id: "architecture", label: "Technical architecture" },
  { id: "challenges", label: "Engineering challenges" },
  { id: "performance", label: "Performance & SEO" },
  { id: "stack", label: "Technology stack" },
  { id: "learnings", label: "Key learnings" },
] as const;

export function CaseStudy({
  project,
  study,
  next,
}: {
  project: Project;
  study: CaseStudyData;
  next: Project;
}) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const [activeId, setActiveId] = React.useState<string>("summary");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Reading progress */}
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent"
        style={{ scaleX: progress }}
      />

      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 grid-dots opacity-[0.3] [mask-image:radial-gradient(ellipse_at_top,#000_10%,transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-[32rem] w-[48rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
        />
        <div className="container-page relative pb-16 pt-28 md:pb-20 md:pt-36">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All projects
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs">
            <span className="font-mono text-subtle">{project.year}</span>
            <span className="h-1 w-1 rounded-full bg-border-strong" />
            <span className="text-muted">{project.role}</span>
            <span className="h-1 w-1 rounded-full bg-border-strong" />
            <span className="text-muted">{project.category.join(" · ")}</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-7xl">
            {project.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
            {project.tagline}
          </p>

          <div className="mt-10 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-8 sm:grid-cols-4">
            {study.performance.map((p) => (
              <div key={p.label}>
                <div className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {p.value}
                </div>
                <div className="mt-1 text-xs text-muted">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Screenshot */}
      {SCREENSHOT_SLUGS.has(project.slug) && (
        <div className="container-page pt-12 md:pt-16">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <Image
              src={`/images/projects/${project.slug}.png`}
              alt={`${project.name} - built by Arqam Tahir using ${project.stack
                .slice(0, 3)
                .join(", ")}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover object-top"
            />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="container-page grid gap-12 py-16 md:py-20 lg:grid-cols-[220px_1fr] lg:gap-16">
        {/* Sticky sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <div className="text-xs font-medium uppercase tracking-wide text-subtle">
              On this page
            </div>
            <nav className="mt-4 flex flex-col gap-1 border-l border-border">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={[
                    "-ml-px border-l-2 py-1.5 pl-4 text-sm transition-colors",
                    activeId === s.id
                      ? "border-accent font-medium text-foreground"
                      : "border-transparent text-muted hover:text-foreground",
                  ].join(" ")}
                >
                  {s.label}
                </a>
              ))}
            </nav>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-all hover:brightness-110"
            >
              Discuss a project <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>

        {/* Article */}
        <article className="max-w-3xl">
          {/* Executive summary */}
          <Block id="summary" eyebrow="01" title="Executive summary">
            <p className="text-lg leading-relaxed text-foreground/90">
              {study.summary}
            </p>
          </Block>

          {/* Problem */}
          <Block id="problem" eyebrow="02" title="The problem">
            <ul className="flex flex-col gap-4">
              {study.problem.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-border-strong" />
                  <span className="leading-relaxed text-muted">{p}</span>
                </li>
              ))}
            </ul>
          </Block>

          {/* Solution */}
          <Block id="solution" eyebrow="03" title="The solution">
            <ul className="flex flex-col gap-4">
              {study.solution.map((s) => (
                <li key={s} className="flex gap-3">
                  <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="leading-relaxed text-muted">{s}</span>
                </li>
              ))}
            </ul>
          </Block>

          {/* Architecture */}
          <Block id="architecture" eyebrow="04" title="Technical architecture">
            <p className="mb-6 leading-relaxed text-muted">
              How the system fits together - each layer reflects technology used on
              the real build.
            </p>
            <ArchitectureDiagram layers={study.architecture} />
          </Block>

          {/* Challenges */}
          <Block id="challenges" eyebrow="05" title="Engineering challenges">
            <div className="flex flex-col gap-4">
              {study.challenges.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, ease, delay: i * 0.06 }}
                  className="rounded-2xl border border-border bg-surface p-6"
                >
                  <h4 className="text-base font-semibold tracking-tight text-foreground">
                    {c.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{c.body}</p>
                </motion.div>
              ))}
            </div>
          </Block>

          {/* Performance */}
          <Block id="performance" eyebrow="06" title="Performance & SEO outcomes">
            <div className="grid gap-4 sm:grid-cols-2">
              {study.performance.map((p, i) => (
                <motion.div
                  key={p.label}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, ease, delay: i * 0.06 }}
                  className="rounded-2xl border border-border bg-surface p-6"
                >
                  <div className="text-3xl font-semibold tracking-tight text-foreground">
                    {p.value}
                  </div>
                  <div className="mt-1 text-sm font-medium text-foreground">
                    {p.label}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.detail}</p>
                </motion.div>
              ))}
            </div>
          </Block>

          {/* Stack */}
          <Block id="stack" eyebrow="07" title="Technology stack">
            <div className="flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-sm text-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </Block>

          {/* Learnings */}
          <Block id="learnings" eyebrow="08" title="Key learnings">
            <div className="flex flex-col gap-4">
              {study.learnings.map((l) => (
                <div key={l} className="flex gap-3">
                  <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="leading-relaxed text-muted">{l}</span>
                </div>
              ))}
            </div>
          </Block>
        </article>
      </div>

      {/* Next project navigation */}
      <nav className="border-t border-border bg-surface-muted/30">
        <Link
          href={`/projects/${next.slug}`}
          className="group container-page flex flex-col gap-2 py-12 md:py-16"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-subtle">
            Next case study
          </span>
          <div className="flex items-center justify-between gap-4">
            <span className="text-3xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent md:text-5xl">
              {next.name}
            </span>
            <ArrowRight className="h-7 w-7 shrink-0 text-subtle transition-transform group-hover:translate-x-1 group-hover:text-accent md:h-9 md:w-9" />
          </div>
          <span className="max-w-xl text-sm text-muted">{next.tagline}</span>
        </Link>
      </nav>
    </>
  );
}

function Block({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-border py-12 first:border-t-0 first:pt-0">
      <div className="mb-6 flex items-center gap-3">
        <span className="font-mono text-xs text-accent">{eyebrow}</span>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
