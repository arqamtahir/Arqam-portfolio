import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { ExperimentCard } from "@/components/playground/experiment-card";
import { ExperimentLibrary } from "@/components/playground/experiment-library";
import { DesignSystemLab } from "@/components/playground/design-system";
import { experiments, featuredExperiments } from "@/lib/playground";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Playground",
  description:
    "A lab of frontend engineering and UI systems - interaction design, motion studies, and Next.js experiments that inform production work.",
  keywords: [
    "frontend engineering",
    "UI systems",
    "interaction design",
    "Next.js",
  ],
  path: "/playground",
});

const principles = [
  {
    n: "01",
    title: "Experiments earn their way into production",
    body: "Nothing here is decoration. Each module rehearses a problem I hit in real work - focus management, perceived performance, layout continuity - so the solution is ready before the deadline is.",
  },
  {
    n: "02",
    title: "Motion is a system, not a sprinkle",
    body: "One easing curve, one set of durations, reduced-motion respected everywhere. Consistency is what separates motion that feels engineered from motion that feels random.",
  },
  {
    n: "03",
    title: "It has to survive a thumb",
    body: "Every interaction degrades gracefully on touch and coarse pointers. Hover-only cleverness that breaks on a phone isn't craft - it's a bug with good lighting.",
  },
];

export default function PlaygroundPage() {
  return (
    <div className="pb-24 pt-28 md:pt-32">
      {/* Hero */}
      <section className="container-page relative">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            The lab
          </div>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Where interface systems get{" "}
            <span className="text-accent">built before they ship.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            A space for interaction systems, UI experiments, and frontend
            engineering exploration. Each one is a small, working answer to a
            problem that shows up in real products - and a window into how I
            think about motion, state, and craft.
          </p>
        </div>
      </section>

      {/* Featured experiments */}
      <section className="container-page mt-20 md:mt-28">
        <Reveal>
          <SectionHeading
            eyebrow="Featured"
            title="The ones worth slowing down for"
            sub="The strongest of the set - each one live, interactive, and explained."
          />
        </Reveal>
        <div className="mt-10 grid gap-6">
          {featuredExperiments.map((meta, i) => (
            <Reveal key={meta.id} delay={i * 0.06} className="min-w-0">
              <ExperimentCard meta={meta} variant="featured" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Full library */}
      <section className="container-page mt-24 md:mt-32">
        <Reveal>
          <SectionHeading
            eyebrow="Library"
            title="The full set"
            sub="Filter by discipline. Every module is interactive on desktop and mobile."
          />
        </Reveal>
        <div className="mt-10">
          <ExperimentLibrary experiments={experiments} />
        </div>
      </section>

      {/* Design system lab */}
      <section className="container-page mt-24 md:mt-32">
        <Reveal>
          <SectionHeading
            eyebrow="Design system"
            title="The primitives underneath"
            sub="The same tokens, scales, and curves the rest of this site is built from - shown live."
          />
        </Reveal>
        <div className="mt-10">
          <DesignSystemLab />
        </div>
      </section>

      {/* Philosophy */}
      <section className="container-page mt-24 md:mt-32">
        <Reveal>
          <SectionHeading
            eyebrow="Philosophy"
            title="Why a playground at all"
            sub="Experiments aren't a hobby tab. They're how the hard parts get solved early."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-3xl border border-border bg-surface p-7">
                <span className="font-mono text-sm text-subtle">{p.n}</span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page mt-24 md:mt-32">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-border bg-surface p-8 md:p-12">
            <div className="max-w-2xl">
              <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                The same care goes into the production work.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                If this is the level of craft you want on a real product, the
                case studies show it shipped - and the contact form is one click
                away.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="/projects" variant="primary">
                  See the work
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/contact" variant="outline">
                  Start a conversation
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {eyebrow}
      </div>
      <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-muted">{sub}</p>
    </div>
  );
}
