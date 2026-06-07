"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Download, Gauge, Globe, Server, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyEmail } from "@/components/ui/copy-email";
import { Counter } from "@/components/motion";
import { profile, techEcosystem } from "@/lib/resume";
import { cn } from "@/lib/utils";

import { EASE as ease } from "@/lib/motion";

export function Hero() {
  const reduce = useReducedMotion();

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease, delay },
  });

  return (
    <section className="relative overflow-hidden">
      {/* ambient depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-dots opacity-[0.35] [mask-image:radial-gradient(ellipse_at_top,#000_20%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="container-page relative grid items-center gap-12 pb-16 pt-16 md:pb-24 md:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* Left — value proposition */}
        <div className="max-w-xl">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-muted backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Available for freelance, consulting &amp; full-time roles
            </span>
          </div>

          <h1
            className="mt-6 text-balance text-5xl font-semibold leading-[1.04] tracking-tight text-foreground md:text-6xl lg:text-[4.1rem]"
          >
            Building high-performance web apps that{" "}
            <span className="relative whitespace-nowrap text-accent">
              scale
              <svg
                aria-hidden
                viewBox="0 0 200 12"
                className="absolute -bottom-1 left-0 h-2.5 w-full text-accent/40"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8c40-6 158-6 196 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            {profile.subtagline}
          </p>

          <motion.div {...fade(0.24)} className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/projects" size="lg">
              View Projects <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/contact" size="lg" variant="secondary">
              Contact Me
            </Button>
          </motion.div>

          <motion.div
            {...fade(0.3)}
            className="mt-4 flex flex-wrap items-center gap-3"
          >
            <a
              href={profile.resumeUrl}
              download
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground"
            >
              <Download className="h-4 w-4" /> Download résumé
            </a>
            <CopyEmail />
          </motion.div>

          <motion.div
            {...fade(0.38)}
            className="mt-9 flex flex-col gap-3 text-sm text-subtle"
          >
            <span className="inline-flex w-fit items-center gap-2 text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Currently: {profile.currentRole}
            </span>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span>{profile.experienceYears} years experience</span>
              <span className="hidden h-1 w-1 rounded-full bg-border-strong sm:block" />
              <span>MERN / MEAN specialist</span>
              <span className="hidden h-1 w-1 rounded-full bg-border-strong sm:block" />
              <span>{profile.relocation.replace("Open to relocation — ", "")}</span>
            </div>
          </motion.div>
        </div>

        {/* Right — engineering instrument panel */}
        <HeroPanel reduce={!!reduce} />
      </div>
    </section>
  );
}

function HeroPanel({ reduce }: { reduce: boolean }) {
  const card = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.7, ease, delay },
  });

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative mx-auto w-full max-w-md lg:max-w-none"
    >
      <motion.div
        className="grid grid-cols-2 gap-3 sm:gap-4"
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
      >
        {/* Lighthouse gauge — large */}
        <motion.div
          {...card(0.28)}
          className="group relative col-span-1 row-span-2 flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface/70 p-5 backdrop-blur-sm transition-colors hover:border-border-strong"
        >
          <div className="relative flex items-center gap-2 text-xs font-medium text-muted">
            <Gauge className="h-4 w-4 text-accent" /> Lighthouse SEO
          </div>
          <div className="relative my-2 flex items-center justify-center">
            <Gauge100 reduce={reduce} />
          </div>
          <p className="relative text-xs leading-relaxed text-subtle">
            Perfect score on a production hospitality platform.
          </p>
        </motion.div>

        {/* LCP */}
        <Stat
          {...card(0.36)}
          label="Largest Contentful Paint"
          value={<><span className="text-2xl text-subtle">&lt;</span><Counter to={3} />s</>}
          hint="SSR · caching · image strategy"
          icon={<Sparkles className="h-4 w-4 text-accent" />}
        />

        {/* Uptime */}
        <Stat
          {...card(0.44)}
          label="Booking-flow uptime"
          value={<><Counter to={99} />%+</>}
          hint="Error boundaries · retry logic"
          icon={<Server className="h-4 w-4 text-accent" />}
        />

        {/* i18n */}
        <motion.div
          {...card(0.52)}
          className="col-span-2 flex items-center justify-between rounded-2xl border border-border bg-surface/70 p-5 backdrop-blur-sm transition-colors hover:border-border-strong"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted">
              <Globe className="h-4 w-4 text-accent" /> Global reach
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              <Counter to={5} />+ <span className="text-base font-normal text-muted">language markets</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-1.5">
            {["EN", "AR", "RTL", "i18n"].map((t) => (
              <span
                key={t}
                className="rounded-md border border-border bg-background/60 px-2 py-1 font-mono text-[11px] text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Live stack ticker */}
        <motion.div
          {...card(0.6)}
          className="col-span-2 overflow-hidden rounded-2xl border border-border bg-surface/70 p-4 backdrop-blur-sm"
        >
          <div className="mb-3 flex items-center justify-between text-xs font-medium text-muted">
            <span>Core stack</span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-subtle">
              <motion.span
                className="h-2 w-2 rounded-full bg-emerald-500"
                animate={reduce ? undefined : { opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
              />{" "}
              deployed
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...techEcosystem.Frontend.slice(0, 4), ...techEcosystem.Backend.slice(0, 3)].map(
              (t) => (
                <span
                  key={t}
                  className="rounded-lg border border-border bg-background/50 px-2.5 py-1 text-xs text-foreground"
                >
                  {t}
                </span>
              )
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Stat({
  label,
  value,
  hint,
  icon,
  className,
  ...motionProps
}: {
  label: string;
  value: React.ReactNode;
  hint: string;
  icon: React.ReactNode;
  className?: string;
} & React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      {...motionProps}
      className={cn(
        "flex flex-col justify-between rounded-2xl border border-border bg-surface/70 p-5 backdrop-blur-sm transition-colors hover:border-border-strong",
        className
      )}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-muted">
        {icon} {label}
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
      <p className="mt-1.5 text-xs text-subtle">{hint}</p>
    </motion.div>
  );
}

function Gauge100({ reduce }: { reduce: boolean }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-border)" strokeWidth="9" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={reduce ? { strokeDashoffset: 0 } : { strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tracking-tight text-foreground">
          <Counter to={100} />
        </span>
        <span className="text-[11px] text-subtle">/ 100</span>
      </div>
    </div>
  );
}
