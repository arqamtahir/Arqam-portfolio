"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

import { EASE as ease } from "@/lib/motion";

/** The primitives the rest of the site is actually built from, shown live. */
export function DesignSystemLab() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Spacing scale" hint="4px base · geometric rhythm">
        <SpacingScale />
      </Panel>
      <Panel title="Type scale" hint="fluid · tracking-tight headings">
        <TypeScale />
      </Panel>
      <Panel title="Motion & easing" hint="one curve, everywhere">
        <EasingLab />
      </Panel>
      <Panel title="Component variants" hint="buttons · chips · surfaces">
        <VariantLab />
      </Panel>
    </div>
  );
}

function Panel({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-border bg-surface p-6 md:p-7">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <span className="font-mono text-[11px] text-subtle">{hint}</span>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

const SPACES = [4, 8, 12, 16, 24, 32, 48, 64];

function SpacingScale() {
  return (
    <div className="flex flex-col gap-2.5">
      {SPACES.map((s) => (
        <div key={s} className="flex items-center gap-3">
          <span className="w-10 shrink-0 font-mono text-[11px] text-subtle">
            {s}
          </span>
          <div
            className="h-3 rounded-sm bg-accent/70"
            style={{ width: `${s * 2}px` }}
          />
        </div>
      ))}
    </div>
  );
}

const TYPE = [
  { label: "Display", cls: "text-4xl font-semibold tracking-tight" },
  { label: "H2", cls: "text-2xl font-semibold tracking-tight" },
  { label: "H3", cls: "text-lg font-semibold" },
  { label: "Body", cls: "text-base text-muted" },
  { label: "Caption", cls: "text-xs uppercase tracking-wide text-subtle" },
];

function TypeScale() {
  return (
    <div className="flex flex-col gap-3">
      {TYPE.map((t) => (
        <div key={t.label} className="flex items-baseline gap-4">
          <span className="w-16 shrink-0 font-mono text-[11px] text-subtle">
            {t.label}
          </span>
          <span className={`${t.cls} min-w-0 truncate text-foreground`}>
            Performance
          </span>
        </div>
      ))}
    </div>
  );
}

function EasingLab() {
  const reduce = useReducedMotion();
  const [run, setRun] = React.useState(0);
  return (
    <div>
      <div className="space-y-3">
        {[
          { label: "fast", dur: 0.25 },
          { label: "base", dur: 0.5 },
          { label: "slow", dur: 0.8 },
        ].map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="w-10 shrink-0 font-mono text-[11px] text-subtle">
              {row.label}
            </span>
            <div className="relative h-2 flex-1 rounded-full bg-surface-muted">
              <motion.span
                key={`${row.label}-${run}`}
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-accent"
                initial={{ left: "0%" }}
                animate={{ left: "calc(100% - 12px)" }}
                transition={reduce ? { duration: 0 } : { duration: row.dur, ease }}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setRun((r) => r + 1)}
        className="mt-5 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground"
      >
        Replay
      </button>
      <p className="mt-3 font-mono text-[11px] text-subtle">
        cubic-bezier(0.21, 0.47, 0.32, 0.98)
      </p>
    </div>
  );
}

function VariantLab() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2.5">
        <Button size="sm" variant="primary">
          Primary
        </Button>
        <Button size="sm" variant="secondary">
          Secondary
        </Button>
        <Button size="sm" variant="outline">
          Outline
        </Button>
        <Button size="sm" variant="ghost">
          Ghost
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {["chip", "tag", "mono", "label"].map((t) => (
          <span
            key={t}
            className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-subtle"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="h-12 rounded-xl bg-background ring-1 ring-border" />
        <div className="h-12 rounded-xl bg-surface ring-1 ring-border" />
        <div className="h-12 rounded-xl bg-surface-muted ring-1 ring-border" />
      </div>
    </div>
  );
}
