import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { StaggerGroup, StaggerItem } from "@/components/motion";
import { audiences, services } from "@/lib/resume";
import { cn } from "@/lib/utils";

export function Services() {
  return (
    <Section id="services" className="border-t border-border">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Services"
            title="Outcomes I deliver"
            description="Not a list of technologies - the concrete results I help teams and founders ship."
          />
          <Link
            href="/contact"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
          >
            Start a project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Audience segmentation */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-subtle">
            Who I work with
          </span>
          {audiences.map((a) => (
            <span
              key={a}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted"
            >
              {a}
            </span>
          ))}
        </div>

        <StaggerGroup className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <StaggerItem
              key={s.outcome}
              className={cn(s.featured && "md:col-span-2 lg:col-span-1 lg:row-span-1")}
            >
              <article className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elevated">
                {s.featured && (
                  <span className="mb-4 w-fit rounded-full border border-accent/30 bg-accent-soft/40 px-3 py-1 text-xs font-medium text-accent">
                    Most requested
                  </span>
                )}
                <h3 className="text-xl font-semibold leading-snug tracking-tight text-foreground">
                  {s.outcome}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.value}</p>

                <ul className="mt-5 flex flex-col gap-2.5">
                  {s.included.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                  <div className="flex flex-wrap gap-1.5">
                    {s.audiences.map((a) => (
                      <span
                        key={a}
                        className="rounded-md bg-surface-muted px-2 py-0.5 text-[11px] text-subtle"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-all group-hover:gap-1.5"
                  >
                    {s.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}
