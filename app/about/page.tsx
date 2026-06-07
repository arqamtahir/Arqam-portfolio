import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { CopyEmail } from "@/components/ui/copy-email";
import { JsonLd, personJsonLd } from "@/lib/jsonld";
import { profile } from "@/lib/resume";
import {
  principles,
  strengths,
  workingStyle,
  journey,
  curiosities,
} from "@/lib/about";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Arqam Tahir — a full stack engineer building Next.js and React products where performance is the experience. Working style, philosophy, and remote work.",
  keywords: [
    "full stack engineer",
    "Next.js",
    "React",
    "frontend architecture",
    "remote",
  ],
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden pb-28 pt-28 md:pt-36">
      {/* ── Hero ───────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 h-[34rem] w-[52rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />
      <section className="container-page relative">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-subtle">
            {profile.titles[0]} · {profile.experienceYears} years
          </p>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            I build web products where{" "}
            <span className="text-accent">performance is the experience</span>{" "}
            — not an afterthought.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
            I&apos;m Arqam — a senior engineer specializing in high-performance,
            SEO-first web applications across travel-tech, hospitality, and SaaS.
            I care about the boring parts that users feel: speed, reliability,
            reach, and interfaces that get out of the way.
          </p>
          <Reveal delay={0.18}>
            <dl className="mt-10 grid max-w-xl grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
              <Fact label="Currently" value="Senior SWE @ Nice2Stay" />
              <Fact label="Based in" value={profile.location} />
              <Fact label="Focus" value="Performance · SEO · Product" />
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ── Narrative ──────────────────────────────────────── */}
      <Section eyebrow="The short version">
        <div className="grid gap-10 lg:grid-cols-[0.4fr_0.6fr] lg:gap-16">
          <Reveal>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-3xl">
              How the work took shape.
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="flex flex-col gap-5 text-lg leading-relaxed text-muted">
            <p>
              I started in a consultancy, shipping frontends across a stream of
              client projects. That breadth taught me to learn a domain fast and to
              respect a deadline — but it left me wanting to own outcomes, not just
              tickets.
            </p>
            <p>
              So I moved toward product engineering: first building a vacation-rental
              platform end-to-end, then modernizing a legacy travel product, then
              leading a full frontend revamp as a senior engineer. The throughline was
              always the same — make it fast, make it findable, make it feel
              considered.
            </p>
            <p className="text-foreground">
              Frontend became my center of gravity because it&apos;s where engineering
              meets the person actually using the thing. Performance, UX, SEO, and
              systems-thinking stopped being separate concerns and became one craft.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ── Pull quote ─────────────────────────────────────── */}
      <section className="container-page relative my-20 md:my-28">
        <Reveal>
          <blockquote className="mx-auto max-w-4xl text-balance text-center text-3xl font-medium leading-snug tracking-tight text-foreground md:text-4xl">
            “The best engineering is invisible. Users don&apos;t notice the
            architecture — they notice that the product just{" "}
            <span className="text-accent">feels right</span>.”
          </blockquote>
        </Reveal>
      </section>

      {/* ── Engineering philosophy ─────────────────────────── */}
      <Section eyebrow="Engineering philosophy" title="Six principles the work runs on.">
        <div className="mt-14 grid gap-x-14 gap-y-12 md:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 0.06} className="flex gap-5">
              <span className="select-none font-mono text-sm text-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-xl font-semibold leading-snug tracking-tight text-foreground">
                  {p.title}
                </h3>
                <p className="mt-3 text-[0.975rem] leading-relaxed text-muted">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── What I solve best ──────────────────────────────── */}
      <Section eyebrow="What I solve best" title="The problems I'm built for.">
        <div className="mt-12 flex flex-col">
          {strengths.map((s, i) => (
            <Reveal key={s.outcome + i} delay={0.02 * i}>
              <Link
                href={`/projects/${s.slug}`}
                className="group flex flex-col gap-3 border-t border-border py-7 transition-colors hover:border-border-strong md:flex-row md:items-baseline md:gap-10"
              >
                <h3 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground md:w-72 md:shrink-0">
                  {s.outcome}
                  <ArrowUpRight className="h-4 w-4 text-subtle transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </h3>
                <p className="max-w-xl text-[0.975rem] leading-relaxed text-muted">
                  {s.body}
                </p>
                <span className="font-mono text-xs text-subtle md:ml-auto md:self-center">
                  {s.proof}
                </span>
              </Link>
            </Reveal>
          ))}
          <div className="border-t border-border" />
        </div>
      </Section>

      {/* ── Working style ──────────────────────────────────── */}
      <Section eyebrow="Working style" title="What it's like to build with me.">
        <div className="mt-12 grid gap-x-14 gap-y-10 md:grid-cols-2">
          {workingStyle.map((w, i) => (
            <Reveal key={w.title} delay={(i % 2) * 0.06}>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {w.title}
              </h3>
              <p className="mt-3 text-[0.975rem] leading-relaxed text-muted">
                {w.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Career journey ─────────────────────────────────── */}
      <Section eyebrow="The journey">
        <div className="grid gap-10 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <h2 className="text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-3xl">
                Growth measured in scope, not titles.
              </h2>
              <p className="mt-5 max-w-xs text-[0.975rem] leading-relaxed text-muted">
                Each role added a layer — from clean delivery, to full ownership, to
                modernizing systems, to senior architecture and reach.
              </p>
            </Reveal>
          </div>

          <ol className="flex flex-col">
            {journey.map((j, i) => (
              <Reveal key={j.company} as="li" delay={0.02 * i}>
                <div className="border-t border-border py-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-accent">
                      {j.arc}
                    </span>
                    <span className="font-mono text-xs text-subtle">{j.period}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
                    {j.company}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted">{j.role}</p>
                  <p className="mt-4 max-w-xl text-[0.975rem] leading-relaxed text-muted">
                    {j.body}
                  </p>
                </div>
              </Reveal>
            ))}
            <li aria-hidden className="border-t border-border" />
          </ol>
        </div>
      </Section>

      {/* ── Beyond the resume ──────────────────────────────── */}
      <Section eyebrow="Beyond the resume" title="What keeps me curious.">
        <div className="mt-12 grid gap-x-14 gap-y-10 sm:grid-cols-3">
          {curiosities.map((c, i) => (
            <Reveal key={c.title} delay={0.05 * i}>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {c.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
                {c.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="container-page relative mt-28">
        <Reveal className="relative overflow-hidden rounded-3xl border border-border bg-surface px-7 py-14 md:px-14 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
          />
          <div className="relative max-w-2xl">
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
              Thoughtful products need strong engineering and clear communication.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              If you&apos;re building something where performance, reach, and craft
              matter — for product work, consulting, or a deeper engineering
              conversation — I&apos;d like to hear about it.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-[0.95rem] font-medium text-accent-fg shadow-soft transition-all hover:brightness-110"
              >
                Start a conversation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border px-7 text-[0.95rem] font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground"
              >
                See the work
              </Link>
              <CopyEmail />
            </div>
          </div>
        </Reveal>
      </section>

      <JsonLd data={personJsonLd()} />
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-subtle">
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container-page relative mt-24 md:mt-32">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-subtle">
          {eyebrow}
        </p>
      </Reveal>
      {title && (
        <Reveal delay={0.06}>
          <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
            {title}
          </h2>
        </Reveal>
      )}
      {children}
    </section>
  );
}
