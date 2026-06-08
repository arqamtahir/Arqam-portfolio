"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { profile } from "@/lib/resume";
import { cn } from "@/lib/utils";

/**
 * Shows the email address as a mailto link with a small copy icon beside it.
 * Pass `iconOnly` to render just the copy button (when the address is already
 * shown elsewhere).
 */
export function EmailCopy({
  className,
  iconOnly = false,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = profile.links.email;
    }
  };

  const button = (
    // 44x44 hit area for touch (a11y), with a smaller visible icon chip inside.
    <button
      type="button"
      onClick={copy}
      aria-label="Copy email address to clipboard"
      className="group inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted transition-colors group-hover:border-border-strong group-hover:text-foreground">
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </span>
    </button>
  );

  // Screen-reader announcement when the address is copied.
  const liveRegion = (
    <span aria-live="polite" aria-atomic="true" className="sr-only">
      {copied ? "Email address copied to clipboard" : ""}
    </span>
  );

  if (iconOnly) {
    return (
      <span className={cn("inline-flex items-center", className)}>
        {button}
        {liveRegion}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm", className)}>
      <a
        href={profile.links.email}
        className="break-all font-medium text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded"
      >
        {profile.email}
      </a>
      {button}
      {liveRegion}
    </span>
  );
}
