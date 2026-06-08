"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { contactSchema, intentOptions, type ContactInput } from "@/lib/contact-schema";
import { profile } from "@/lib/resume";
import { cn } from "@/lib/utils";

import { EASE as ease } from "@/lib/motion";

export function ContactForm() {
  const reduce = useReducedMotion();
  const [status, setStatus] = React.useState<"idle" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { intent: intentOptions[0] },
  });

  const onSubmit = async (values: ContactInput) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (isSubmitSuccessful) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex h-full flex-col items-center justify-center rounded-3xl border border-border bg-surface p-10 text-center"
      >
        <CheckCircle2 className="h-12 w-12 text-accent" />
        <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
          Message received.
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Thanks for reaching out - I&apos;ll get back to you within a couple of
          business days. For anything urgent, email me directly at {profile.email}.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl border border-border bg-surface p-6 md:p-8"
      noValidate
    >
      {/* Honeypot - visually hidden, off-screen, not announced. */}
      <div aria-hidden className="absolute left-[-9999px]" tabIndex={-1}>
        <label>
          Company URL
          <input type="text" tabIndex={-1} autoComplete="off" {...register("company_url")} />
        </label>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" error={errors.name?.message} htmlFor="name">
            <input
              id="name"
              autoComplete="name"
              placeholder="Your name"
              className={inputCls(!!errors.name)}
              {...register("name")}
            />
          </Field>
          <Field label="Email" error={errors.email?.message} htmlFor="email">
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className={inputCls(!!errors.email)}
              {...register("email")}
            />
          </Field>
        </div>

        <Field label="Company" optional error={errors.company?.message} htmlFor="company">
          <input
            id="company"
            autoComplete="organization"
            placeholder="Where you work (optional)"
            className={inputCls(!!errors.company)}
            {...register("company")}
          />
        </Field>

        <Field label="What's this about?" error={errors.intent?.message} htmlFor="intent">
          <select id="intent" className={inputCls(!!errors.intent)} {...register("intent")}>
            {intentOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Message" error={errors.message?.message} htmlFor="message">
          <textarea
            id="message"
            rows={5}
            placeholder="A few lines about your project, role, or idea…"
            className={cn(inputCls(!!errors.message), "resize-y")}
            {...register("message")}
          />
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-[0.95rem] font-medium text-accent-fg shadow-soft transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send message <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        {status === "error" && (
          <p className="text-sm text-red-500" role="alert">
            Something went wrong. Please try again, or email me directly at{" "}
            <a href={profile.links.email} className="font-medium underline">
              {profile.email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="flex items-center gap-2 text-sm font-medium text-foreground">
        {label}
        {optional && <span className="text-xs font-normal text-subtle">optional</span>}
      </label>
      {children}
      {error && (
        <span className="text-xs text-red-500" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    "h-11 w-full rounded-xl border bg-background px-3.5 text-sm text-foreground placeholder:text-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-ring/40",
    "[&[rows]]:h-auto [&[rows]]:py-3",
    hasError ? "border-red-500/60" : "border-border focus:border-border-strong"
  );
}
