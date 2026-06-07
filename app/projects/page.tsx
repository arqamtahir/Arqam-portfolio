import type { Metadata } from "next";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";
import { Reveal } from "@/components/motion";
import { projects } from "@/lib/resume";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "Production case studies from Arqam Tahir — the challenge, the Next.js and full stack engineering, and the measurable performance outcomes behind each build.",
  keywords: [
    "case studies",
    "Next.js",
    "full stack",
    "performance",
  ],
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <div className="pb-28 pt-28 md:pt-36">
      {/* Editorial hero */}
      <section className="container-page">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Case-study library
        </span>
        <h1 className="mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[1.04] tracking-tight text-foreground md:text-7xl">
          Production platforms,
          <br className="hidden sm:block" /> documented as case studies.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Three travel and hospitality platforms I engineered end-to-end — each
          told as a story of the problem, the approach, and the measurable impact.
          Every fact here comes from real, shipped work.
        </p>
        <Reveal delay={0.18}>
          <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
            <Stat value="3" label="Production platforms" />
            <Stat value="100" label="Lighthouse SEO" />
            <Stat value="<3s" label="LCP achieved" />
            <Stat value="99%+" label="Booking uptime" />
          </dl>
        </Reveal>
      </section>

      <ProjectsExplorer projects={projects} />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {value}
      </dt>
      <dd className="mt-1 text-xs text-muted">{label}</dd>
    </div>
  );
}
