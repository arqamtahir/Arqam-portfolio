"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  Command,
  CornerDownLeft,
  FileText,
  Gauge,
  Home,
  Mail,
  RotateCcw,
  Search,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { EASE as ease } from "@/lib/motion";

/** Detect coarse (touch) pointers so hover-driven effects degrade gracefully. */
function useCoarsePointer() {
  const [coarse, setCoarse] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return coarse;
}

/* ──────────────────────────────────────────────────────────
   1. Spotlight Grid - pointer-tracked glow + parallax tilt
   ────────────────────────────────────────────────────────── */
function SpotlightCard({ label, hint }: { label: string; hint: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const coarse = useCoarsePointer();
  const [pos, setPos] = React.useState({ x: 50, y: 50, active: false });

  const onMove = (e: React.MouseEvent) => {
    if (coarse) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
      active: true,
    });
  };

  const tiltX = (pos.y - 50) / -16;
  const tiltY = (pos.x - 50) / 16;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setPos((p) => ({ ...p, active: false }))}
      style={
        {
          "--x": `${pos.x}%`,
          "--y": `${pos.y}%`,
          transform:
            pos.active && !coarse
              ? `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
              : "perspective(800px)",
        } as React.CSSProperties
      }
      className="relative h-28 overflow-hidden rounded-xl border border-border bg-background/60 p-4 transition-transform duration-200 ease-out"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity: pos.active ? 1 : 0,
          background:
            "radial-gradient(220px circle at var(--x) var(--y), color-mix(in oklch, var(--color-accent) 28%, transparent), transparent 70%)",
        }}
      />
      <div className="relative">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="mt-1 text-xs text-subtle">{hint}</div>
      </div>
    </div>
  );
}

export function SpotlightGrid() {
  const cards = [
    ["Latency", "p95 · 142ms"],
    ["Throughput", "12.4k req/min"],
    ["Cache", "94% hit rate"],
    ["Errors", "0.02% · 5xx"],
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map(([l, h]) => (
        <SpotlightCard key={l} label={l} hint={h} />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   2. Command Palette - keyboard-first, fuzzy, layoutId highlight
   ────────────────────────────────────────────────────────── */
const paletteItems = [
  { icon: Home, label: "Go to Home", kbd: "H" },
  { icon: User, label: "Open About", kbd: "A" },
  { icon: FileText, label: "Browse Projects", kbd: "P" },
  { icon: Gauge, label: "View Metrics", kbd: "M" },
  { icon: Mail, label: "Contact Arqam", kbd: "C" },
];

export function CommandPalette() {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const reduce = useReducedMotion();

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return paletteItems;
    return paletteItems.filter((i) =>
      i.label.toLowerCase().includes(q)
    );
  }, [query]);

  React.useEffect(() => {
    setActive(0);
  }, [query]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background/80">
      <div className="flex items-center gap-2 border-b border-border px-3.5 py-3">
        <Search className="h-4 w-4 text-subtle" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
          placeholder="Type a command or search…"
          aria-label="Command palette input"
          className="w-full min-w-0 bg-transparent text-sm text-foreground placeholder:text-subtle focus:outline-none"
        />
        <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-subtle sm:inline">
          ⌘K
        </kbd>
      </div>
      <ul className="max-h-56 overflow-auto p-1.5">
        {results.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-subtle">
            No commands match “{query}”.
          </li>
        )}
        {results.map((item, i) => (
          <li key={item.label}>
            <button
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm focus:outline-none"
            >
              {active === i && (
                <motion.span
                  layoutId="cmd-active"
                  className="absolute inset-0 rounded-lg bg-surface-muted"
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 500, damping: 38 }
                  }
                />
              )}
              <item.icon
                className={cn(
                  "relative h-4 w-4",
                  active === i ? "text-accent" : "text-subtle"
                )}
              />
              <span
                className={cn(
                  "relative min-w-0 flex-1 truncate",
                  active === i ? "text-foreground" : "text-muted"
                )}
              >
                {item.label}
              </span>
              {active === i ? (
                <CornerDownLeft className="relative h-3.5 w-3.5 text-subtle" />
              ) : (
                <kbd className="relative hidden font-mono text-[10px] text-subtle sm:inline">
                  {item.kbd}
                </kbd>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   3. Metric Explorer - interactive latency model
   ────────────────────────────────────────────────────────── */
function Slider({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span className="font-mono tabular-nums text-foreground">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-muted accent-accent"
      />
    </label>
  );
}

export function MetricExplorer() {
  const [load, setLoad] = React.useState(60);
  const [cache, setCache] = React.useState(85);
  const [replicas, setReplicas] = React.useState(3);
  const reduce = useReducedMotion();

  // A small, legible model (illustrative - not a benchmark).
  const base = 40;
  const pressure = (load / 100) * (180 / replicas);
  const cacheRelief = (cache / 100) * 70;
  const p50 = Math.max(8, Math.round(base + pressure * 0.4 - cacheRelief * 0.5));
  const p95 = Math.max(p50 + 6, Math.round(base + pressure - cacheRelief * 0.4));
  const p99 = Math.max(p95 + 10, Math.round(base + pressure * 1.6 - cacheRelief * 0.3));

  const bars = [
    { label: "p50", value: p50 },
    { label: "p95", value: p95 },
    { label: "p99", value: p99 },
  ];
  const maxBar = Math.max(p99, 120);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Slider label="Traffic load" value={load} min={5} max={100} suffix="%" onChange={setLoad} />
        <Slider label="Cache hit rate" value={cache} min={0} max={99} suffix="%" onChange={setCache} />
        <Slider label="Replicas" value={replicas} min={1} max={8} suffix="×" onChange={setReplicas} />
      </div>
      <div className="flex flex-col justify-end gap-3 rounded-xl border border-border bg-background/60 p-4">
        {bars.map((b) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="w-8 font-mono text-xs text-subtle">{b.label}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-muted">
              <motion.div
                className="h-full rounded-full bg-accent"
                animate={{ width: `${Math.min(100, (b.value / maxBar) * 100)}%` }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 30 }}
              />
            </div>
            <span className="w-12 text-right font-mono text-xs tabular-nums text-foreground">
              {b.value}ms
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   4. Stagger Lab - replayable choreography
   ────────────────────────────────────────────────────────── */
const staggerPresets = {
  Tight: 0.03,
  Balanced: 0.07,
  Loose: 0.14,
} as const;

export function StaggerLab() {
  const reduce = useReducedMotion();
  const [preset, setPreset] = React.useState<keyof typeof staggerPresets>("Balanced");
  const [runId, setRunId] = React.useState(0);
  const tiles = Array.from({ length: 12 });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex rounded-full border border-border p-0.5">
          {(Object.keys(staggerPresets) as (keyof typeof staggerPresets)[]).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPreset(p);
                setRunId((r) => r + 1);
              }}
              className={cn(
                "relative rounded-full px-3 py-1 text-xs font-medium transition-colors",
                preset === p ? "text-accent-fg" : "text-muted hover:text-foreground"
              )}
            >
              {preset === p && (
                <motion.span
                  layoutId="stagger-pill"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative">{p}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setRunId((r) => r + 1)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" /> Replay
        </button>
      </div>

      <motion.div
        key={runId}
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduce ? 0 : staggerPresets[preset] } },
        }}
        className="grid grid-cols-6 gap-2"
      >
        {tiles.map((_, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.9 },
              show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease } },
            }}
            className="aspect-square rounded-lg border border-border bg-accent-soft/40"
          />
        ))}
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   5. Bento Morph - shared-layout re-flow
   ────────────────────────────────────────────────────────── */
const bentoModes = {
  Overview: [
    { id: "a", span: "col-span-2 row-span-2" },
    { id: "b", span: "col-span-2" },
    { id: "c", span: "" },
    { id: "d", span: "" },
  ],
  Focus: [
    { id: "a", span: "col-span-4 row-span-2" },
    { id: "b", span: "col-span-2" },
    { id: "c", span: "col-span-1" },
    { id: "d", span: "col-span-1" },
  ],
} as const;

export function BentoMorph() {
  const reduce = useReducedMotion();
  const [mode, setMode] = React.useState<keyof typeof bentoModes>("Overview");

  return (
    <div>
      <div className="mb-4 flex rounded-full border border-border p-0.5">
        {(Object.keys(bentoModes) as (keyof typeof bentoModes)[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "relative flex-1 rounded-full px-3 py-1 text-xs font-medium transition-colors",
              mode === m ? "text-accent-fg" : "text-muted hover:text-foreground"
            )}
          >
            {mode === m && (
              <motion.span
                layoutId="bento-pill"
                className="absolute inset-0 rounded-full bg-accent"
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative">{m}</span>
          </button>
        ))}
      </div>
      <div className="grid auto-rows-[44px] grid-cols-4 gap-2">
        {bentoModes[mode].map((cell) => (
          <motion.div
            key={cell.id}
            layout={!reduce}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 34 }}
            className={cn(
              "flex items-center justify-center rounded-lg border border-border bg-background/60 font-mono text-xs text-subtle",
              cell.span
            )}
          >
            {cell.id.toUpperCase()}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   6. Magnetic Controls - spring cursor magnetism
   ────────────────────────────────────────────────────────── */
function MagneticButton({
  children,
  primary,
}: {
  children: React.ReactNode;
  primary?: boolean;
}) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const coarse = useCoarsePointer();
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    if (coarse || reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * 0.4);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium transition-colors active:scale-[0.98]",
        primary
          ? "bg-accent text-accent-fg shadow-soft hover:brightness-110"
          : "border border-border text-foreground hover:border-border-strong"
      )}
    >
      {children}
    </motion.button>
  );
}

export function MagneticControls() {
  const coarse = useCoarsePointer();
  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <MagneticButton primary>
          Get started <ArrowRight className="h-4 w-4" />
        </MagneticButton>
        <MagneticButton>
          <Command className="h-4 w-4" /> Commands
        </MagneticButton>
      </div>
      <p className="text-center text-xs text-subtle">
        {coarse
          ? "Touch detected - magnetism is disabled; controls stay tappable."
          : "Move your cursor near a control to feel the spring."}
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   7. Typewriter Intelligence - human-cadence typing
   ────────────────────────────────────────────────────────── */
const TYPE_PHRASES = [
  "performance is the experience",
  "architecture that ages well",
  "SEO as product infrastructure",
  "accessibility is non-negotiable",
  "motion with intent, never decoration",
];

const COMMON_LETTERS = new Set("etaoinshrdlu ".split(""));

export function TypewriterIntelligence() {
  const reduce = useReducedMotion();
  const [text, setText] = React.useState("");
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!reduce) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % TYPE_PHRASES.length),
      2200
    );
    return () => clearInterval(id);
  }, [reduce]);

  React.useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;
    let phrase = 0;
    let pos = 0;
    let deleting = false;

    const tick = () => {
      if (cancelled) return;
      const full = TYPE_PHRASES[phrase];

      if (!deleting) {
        pos++;
        setText(full.slice(0, pos));
        if (pos >= full.length) {
          deleting = true;
          timeout = setTimeout(tick, 1500); // settle on the full phrase
          return;
        }
        const ch = full[pos - 1];
        let delay = COMMON_LETTERS.has(ch.toLowerCase()) ? 38 : 84;
        delay += Math.random() * 42;
        if (/[.,;:]/.test(ch)) delay += 260; // breathe at punctuation
        timeout = setTimeout(tick, delay);
      } else {
        pos--;
        setText(full.slice(0, pos));
        if (pos <= 0) {
          deleting = false;
          phrase = (phrase + 1) % TYPE_PHRASES.length;
          timeout = setTimeout(tick, 360);
          return;
        }
        timeout = setTimeout(tick, 24 + Math.random() * 18); // delete faster
      }
    };

    timeout = setTimeout(tick, 500);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [reduce]);

  return (
    <div className="flex min-h-[4rem] items-center justify-center rounded-xl border border-border bg-background/60 px-4 py-6">
      {reduce ? (
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center font-mono text-base text-foreground"
          >
            {TYPE_PHRASES[index]}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span className="text-center font-mono text-base text-foreground">
          <span aria-live="polite">{text}</span>
          <span
            aria-hidden
            className="ml-0.5 inline-block w-[2px] animate-pulse bg-accent align-middle"
            style={{ height: "1.1em" }}
          />
        </span>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   8. Physics Spring Playground - drag, spring-back, repel
   ────────────────────────────────────────────────────────── */
type DotApi = {
  el: React.RefObject<HTMLButtonElement | null>;
  setRepel: (x: number, y: number) => void;
  getDrag: () => { x: number; y: number };
};

function SpringDot({
  index,
  label,
  stiffness,
  damping,
  reduce,
  coarse,
  register,
  onStart,
  onMove,
  onEnd,
}: {
  index: number;
  label: string;
  stiffness: number;
  damping: number;
  reduce: boolean | null;
  coarse: boolean;
  register: (i: number, api: DotApi) => void;
  onStart: () => void;
  onMove: (i: number) => void;
  onEnd: () => void;
}) {
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const repelXSrc = useMotionValue(0);
  const repelYSrc = useMotionValue(0);
  const repelX = useSpring(repelXSrc, { stiffness: 220, damping: 24 });
  const repelY = useSpring(repelYSrc, { stiffness: 220, damping: 24 });
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    register(index, {
      el: ref,
      setRepel: (x, y) => {
        repelXSrc.set(x);
        repelYSrc.set(y);
      },
      getDrag: () => ({ x: dragX.get(), y: dragY.get() }),
    });
  }, [index, register, dragX, dragY, repelXSrc, repelYSrc]);

  const springHome = () => {
    if (reduce) {
      dragX.set(0);
      dragY.set(0);
      return;
    }
    animate(dragX, 0, { type: "spring", stiffness, damping });
    animate(dragY, 0, { type: "spring", stiffness, damping });
  };

  const flick = () => {
    if (!coarse || reduce) return;
    dragX.set((Math.random() - 0.5) * 130);
    dragY.set((Math.random() - 0.5) * 90);
    animate(dragX, 0, { type: "spring", stiffness, damping });
    animate(dragY, 0, { type: "spring", stiffness, damping });
  };

  return (
    <motion.div style={{ x: repelX, y: repelY }}>
      <motion.button
        ref={ref}
        drag={!coarse}
        dragMomentum={false}
        dragElastic={0.55}
        onDragStart={onStart}
        onDrag={() => onMove(index)}
        onDragEnd={() => {
          springHome();
          onEnd();
        }}
        onClick={flick}
        whileTap={{ scale: 0.96 }}
        style={{ x: dragX, y: dragY }}
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-accent-soft/50 text-base font-semibold text-foreground",
          coarse
            ? "cursor-pointer"
            : "cursor-grab touch-none active:cursor-grabbing"
        )}
      >
        {label}
      </motion.button>
    </motion.div>
  );
}

export function SpringPlayground() {
  const reduce = useReducedMotion();
  const coarse = useCoarsePointer();
  const [stiffness, setStiffness] = React.useState(260);
  const [damping, setDamping] = React.useState(18);
  const apis = React.useRef<Map<number, DotApi>>(new Map());
  const homes = React.useRef<Map<number, { x: number; y: number }>>(new Map());

  const register = React.useCallback((i: number, api: DotApi) => {
    apis.current.set(i, api);
  }, []);

  const measure = React.useCallback(() => {
    apis.current.forEach((api, i) => {
      const r = api.el.current?.getBoundingClientRect();
      if (r)
        homes.current.set(i, {
          x: r.left + r.width / 2,
          y: r.top + r.height / 2,
        });
    });
  }, []);

  const onMove = React.useCallback(
    (i: number) => {
      if (reduce) return;
      const hi = homes.current.get(i);
      const di = apis.current.get(i)?.getDrag();
      if (!hi || !di) return;
      const ci = { x: hi.x + di.x, y: hi.y + di.y };
      const R = 104;
      apis.current.forEach((api, j) => {
        if (j === i) return;
        const hj = homes.current.get(j);
        if (!hj) return;
        const dx = hj.x - ci.x;
        const dy = hj.y - ci.y;
        const d = Math.hypot(dx, dy);
        if (d > 0 && d < R) {
          const push = (R - d) * 0.45;
          api.setRepel((dx / d) * push, (dy / d) * push);
        } else {
          api.setRepel(0, 0);
        }
      });
    },
    [reduce]
  );

  const onEnd = React.useCallback(() => {
    apis.current.forEach((api) => api.setRepel(0, 0));
  }, []);

  const labels = ["A", "T", "↯", "◆", "●"];

  return (
    <div>
      <div className="mb-5 flex min-h-[8rem] flex-wrap items-center justify-center gap-5 rounded-xl border border-border bg-background/60 p-6">
        {labels.map((l, i) => (
          <SpringDot
            key={i}
            index={i}
            label={l}
            stiffness={stiffness}
            damping={damping}
            reduce={reduce}
            coarse={coarse}
            register={register}
            onStart={measure}
            onMove={onMove}
            onEnd={onEnd}
          />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Slider
          label="Stiffness"
          value={stiffness}
          min={40}
          max={600}
          suffix=""
          onChange={setStiffness}
        />
        <Slider
          label="Damping"
          value={damping}
          min={4}
          max={50}
          suffix=""
          onChange={setDamping}
        />
      </div>
      <p className="mt-3 text-center text-xs text-subtle">
        {coarse
          ? "Tap an element to flick it - it springs home with the configured physics."
          : "Drag an element and release. Neighbors nudge aside when crowded."}
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   9. Live Code Token Highlighter - regex tokenizer + mirror
   ────────────────────────────────────────────────────────── */
const TOKEN_SEED = `// a tokenizer rehearses real editor plumbing
type Status = "idle" | "loading" | "ready";

interface Session {
  id: string;
  status: Status;
  retries: number;
}

async function load(url: string): Promise<Session> {
  const res = await fetch(url);
  if (!res.ok) return { id: "0", status: "idle", retries: 3 };
  return res.json();
}`;

const CODE_KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "type",
  "interface",
  "return",
  "async",
  "await",
  "function",
  "export",
  "import",
  "from",
  "if",
  "else",
  "new",
  "class",
  "extends",
  "of",
  "in",
]);

type TokenType =
  | "keyword"
  | "string"
  | "comment"
  | "type"
  | "number"
  | "plain";
type Token = { type: TokenType; value: string };

function tokenize(code: string): Token[] {
  const re =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][A-Za-z0-9_$]*)/g;
  const out: Token[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    if (m.index > last)
      out.push({ type: "plain", value: code.slice(last, m.index) });
    if (m[1]) out.push({ type: "comment", value: m[1] });
    else if (m[2]) out.push({ type: "string", value: m[2] });
    else if (m[3]) out.push({ type: "number", value: m[3] });
    else if (m[4]) {
      const w = m[4];
      if (CODE_KEYWORDS.has(w)) out.push({ type: "keyword", value: w });
      else if (/^[A-Z]/.test(w)) out.push({ type: "type", value: w });
      else out.push({ type: "plain", value: w });
    }
    last = re.lastIndex;
  }
  if (last < code.length)
    out.push({ type: "plain", value: code.slice(last) });
  return out;
}

const tokenClass: Record<TokenType, string> = {
  keyword: "text-syntax-keyword",
  string: "text-syntax-string",
  comment: "italic text-syntax-comment",
  type: "text-syntax-type",
  number: "text-syntax-number",
  plain: "text-foreground",
};

const tokenLegend: { k: TokenType; dot: string; label: string }[] = [
  { k: "keyword", dot: "bg-syntax-keyword", label: "Keywords" },
  { k: "string", dot: "bg-syntax-string", label: "Strings" },
  { k: "type", dot: "bg-syntax-type", label: "Types" },
  { k: "number", dot: "bg-syntax-number", label: "Numbers" },
  { k: "comment", dot: "bg-syntax-comment", label: "Comments" },
];

export function TokenHighlighter() {
  const [code, setCode] = React.useState(TOKEN_SEED);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const taRef = React.useRef<HTMLTextAreaElement>(null);
  const tokens = React.useMemo(() => tokenize(code), [code]);

  const counts = React.useMemo(() => {
    const c: Partial<Record<TokenType, number>> = {};
    for (const t of tokens)
      if (t.type !== "plain") c[t.type] = (c[t.type] ?? 0) + 1;
    return c;
  }, [tokens]);
  const total =
    Object.values(counts).reduce((a, b) => a + (b ?? 0), 0) || 1;

  const syncScroll = () => {
    if (overlayRef.current && taRef.current) {
      overlayRef.current.scrollTop = taRef.current.scrollTop;
      overlayRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  const sharedText = "font-mono text-[13px] leading-[1.6]";

  return (
    <div>
      <div className="relative h-64 overflow-hidden rounded-xl border border-border bg-background/60">
        <div
          ref={overlayRef}
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 overflow-auto whitespace-pre-wrap break-words p-4",
            sharedText
          )}
        >
          {tokens.map((t, i) => (
            <span key={i} className={tokenClass[t.type]}>
              {t.value}
            </span>
          ))}
          {"\n"}
        </div>
        <textarea
          ref={taRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onScroll={syncScroll}
          spellCheck={false}
          aria-label="Editable code sample"
          className={cn(
            "absolute inset-0 resize-none overflow-auto whitespace-pre-wrap break-words bg-transparent p-4 text-transparent caret-foreground outline-none",
            sharedText
          )}
        />
      </div>

      <div className="mt-4">
        <div className="flex h-2.5 overflow-hidden rounded-full bg-surface-muted">
          {tokenLegend.map((b) =>
            counts[b.k] ? (
              <div
                key={b.k}
                className={b.dot}
                style={{ width: `${((counts[b.k] ?? 0) / total) * 100}%` }}
              />
            ) : null
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {tokenLegend.map((b) => (
            <span
              key={b.k}
              className="inline-flex items-center gap-1.5 text-xs text-muted"
            >
              <span className={cn("h-2 w-2 rounded-full", b.dot)} />
              {b.label}
              <span className="font-mono tabular-nums text-subtle">
                {counts[b.k] ?? 0}
              </span>
            </span>
          ))}
          <span className="ml-auto font-mono text-xs tabular-nums text-subtle">
            {total} tokens
          </span>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   10. Scroll Timeline Visualizer - scroll-driven, keyboard-safe
   ────────────────────────────────────────────────────────── */
const TIMELINE = [
  { key: "Requirements", body: "Define the problem precisely." },
  { key: "Architecture", body: "Choose boundaries that age well." },
  { key: "Implementation", body: "Build in small, safe steps." },
  { key: "Review", body: "Catch what tests can't." },
  { key: "Ship", body: "Release behind a measured rollout." },
  { key: "Monitor", body: "Watch real users, close the loop." },
];

export function ScrollTimeline() {
  const reduce = useReducedMotion();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);
  const [visible, setVisible] = React.useState<Set<number>>(
    () => new Set(reduce ? TIMELINE.map((_, i) => i) : [])
  );

  const onScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max <= 0 ? 0 : el.scrollLeft / max);
  }, []);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    onScroll();
    if (reduce) {
      setVisible(new Set(TIMELINE.map((_, i) => i)));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = new Set(prev);
          for (const e of entries) {
            if (e.isIntersecting)
              next.add(Number((e.target as HTMLElement).dataset.idx));
          }
          return next;
        });
      },
      { root: el, threshold: 0.6 }
    );
    el.querySelectorAll("[data-idx]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [reduce, onScroll]);

  const onKey = (e: React.KeyboardEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      el.scrollBy({ left: 168, behavior: reduce ? "auto" : "smooth" });
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      el.scrollBy({ left: -168, behavior: reduce ? "auto" : "smooth" });
    }
  };

  return (
    <div>
      <div className="relative mb-4 h-1.5 rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${progress * 100}%` }}
        />
        <div
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-background"
          style={{ left: `${progress * 100}%` }}
        />
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        onKeyDown={onKey}
        tabIndex={0}
        role="region"
        aria-label="Engineering lifecycle timeline - scroll or use arrow keys"
        className="flex gap-4 overflow-x-auto rounded-xl border border-border bg-background/60 p-4 [scrollbar-width:thin] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {TIMELINE.map((m, i) => (
          <motion.div
            key={m.key}
            data-idx={i}
            initial={false}
            animate={
              visible.has(i)
                ? { opacity: 1, y: 0 }
                : { opacity: 0.25, y: reduce ? 0 : 16 }
            }
            transition={reduce ? { duration: 0 } : { duration: 0.5, ease }}
            className="flex w-44 shrink-0 flex-col rounded-xl border border-border bg-surface p-4"
          >
            <span className="font-mono text-xs text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="mt-2 text-sm font-semibold text-foreground">
              {m.key}
            </span>
            <span className="mt-1 text-xs leading-relaxed text-muted">
              {m.body}
            </span>
          </motion.div>
        ))}
        <div className="w-1 shrink-0" />
      </div>
      <p className="mt-3 text-xs text-subtle">
        Scroll the row, or focus it and use the ← → arrow keys.
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Registry - id → live component
   ────────────────────────────────────────────────────────── */
export const experimentComponents: Record<string, React.ComponentType> = {
  "spotlight-grid": SpotlightGrid,
  "command-palette": CommandPalette,
  "metric-explorer": MetricExplorer,
  "stagger-lab": StaggerLab,
  "bento-morph": BentoMorph,
  "magnetic-controls": MagneticControls,
  "typewriter-intelligence": TypewriterIntelligence,
  "spring-playground": SpringPlayground,
  "token-highlighter": TokenHighlighter,
  "scroll-timeline": ScrollTimeline,
};
