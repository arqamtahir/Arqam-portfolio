import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { Reveal, StaggerGroup, StaggerItem, Counter } from "@/components/motion";
import { profile, metrics, expertise } from "@/lib/resume";

export default function Home() {
  return (
    <Container>
      {/* Temporary Phase-1 verification page — full homepage lands in Phase 2 */}
      <Section className="pb-12">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Foundation ready · Phase 1
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-7xl">
            {profile.tagline}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {profile.subtagline}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/projects" size="lg">
              View Projects <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/contact" size="lg" variant="secondary">
              Contact Me
            </Button>
          </div>
        </Reveal>
      </Section>

      <Section className="border-t border-border py-14">
        <StaggerGroup className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {metrics.slice(0, 4).map((m) => (
            <StaggerItem key={m.label}>
              <div className="text-4xl font-semibold tracking-tight text-foreground">
                <Counter to={m.value} prefix={m.prefix} suffix={m.suffix} />
              </div>
              <div className="mt-2 text-sm text-muted">{m.label}</div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      <Section className="border-t border-border">
        <SectionHeader
          eyebrow="Capabilities"
          title="A foundation built for premium product engineering"
          description="Design tokens, motion system, command menu, and SEO scaffolding are in place. Full homepage sections arrive in Phase 2."
        />
        <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {expertise.map((e) => (
            <StaggerItem key={e.title}>
              <Card interactive padding="md" className="h-full">
                <CardTitle>{e.title}</CardTitle>
                <CardDescription>{e.description}</CardDescription>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>
    </Container>
  );
}
