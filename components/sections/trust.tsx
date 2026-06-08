import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { projects, testimonials } from "@/lib/resume";

export function Trust() {
  const visibleTestimonials = testimonials.filter((t) => !t.placeholder);

  return (
    <section className="border-b border-border py-16 md:py-20">
      <div className="container-page">
        <Reveal>
          <p className="text-center text-sm font-medium text-muted">
            Platforms and products I&apos;ve helped build
          </p>
        </Reveal>

        {/* Real platforms - no fabricated client logos, just the work itself. */}
        <StaggerGroup className="mt-8 grid gap-4 sm:grid-cols-3">
          {projects.map((p) => (
            <StaggerItem key={p.slug}>
              <Link
                href={`/projects/${p.slug}`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-surface px-6 py-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold tracking-tight text-foreground">
                    {p.name}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-subtle transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.stack.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-subtle"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Testimonials: render real ones; otherwise a tasteful, honest invitation. */}
        {visibleTestimonials.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {visibleTestimonials.map((t) => (
              <figure
                key={t.author}
                className="rounded-2xl border border-border bg-surface p-7"
              >
                <Quote className="h-6 w-6 text-accent/60" />
                <blockquote className="mt-4 text-base leading-relaxed text-foreground">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-medium text-foreground">{t.author}</span>
                  <span className="text-muted"> - {t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <Reveal delay={0.1}>
            {/* TODO: Replace with real, approved testimonials in lib/resume.ts (set placeholder:false). */}
            <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface-muted/40 px-6 py-10 text-center">
              <Quote className="h-6 w-6 text-subtle" />
              <p className="max-w-md text-sm leading-relaxed text-muted">
                References from past collaborators are available on request - and
                client testimonials will land here soon.
              </p>
              <Link
                href="/contact"
                className="text-sm font-medium text-accent hover:underline"
              >
                Request references →
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
