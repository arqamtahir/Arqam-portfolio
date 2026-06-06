"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  Home,
  Layers,
  Mail,
  Moon,
  PenLine,
  Sun,
  User,
  Wand2,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { navItems, profile } from "@/lib/resume";

const iconFor: Record<string, React.ReactNode> = {
  "/": <Home className="h-4 w-4" />,
  "/about": <User className="h-4 w-4" />,
  "/projects": <Layers className="h-4 w-4" />,
  "/blog": <PenLine className="h-4 w-4" />,
  "/playground": <Wand2 className="h-4 w-4" />,
  "/contact": <Mail className="h-4 w-4" />,
};

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const run = React.useCallback((fn: () => void) => {
    setOpen(false);
    fn();
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command menu"
        className="hidden items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-2 text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground sm:inline-flex"
      >
        <span>Search</span>
        <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-subtle">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[15vh]"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <Command
            loop
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-elevated shadow-elevated"
          >
            <Command.Input
              autoFocus
              placeholder="Type a command or search…"
              className="w-full border-b border-border bg-transparent px-5 py-4 text-base text-foreground outline-none placeholder:text-subtle"
            />
            <Command.List className="max-h-[320px] overflow-y-auto p-2">
              <Command.Empty className="px-4 py-6 text-center text-sm text-muted">
                No results found.
              </Command.Empty>

              <Command.Group
                heading="Navigation"
                className="px-2 py-1.5 text-xs font-medium text-subtle [&_[cmdk-group-items]]:mt-1"
              >
                {navItems.map((item) => (
                  <Command.Item
                    key={item.href}
                    value={`go ${item.label}`}
                    onSelect={() => run(() => router.push(item.href))}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-surface-muted"
                  >
                    {iconFor[item.href]}
                    <span>{item.label}</span>
                    <ArrowRight className="ml-auto h-3.5 w-3.5 text-subtle" />
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group
                heading="Actions"
                className="px-2 py-1.5 text-xs font-medium text-subtle [&_[cmdk-group-items]]:mt-1"
              >
                <Command.Item
                  value="toggle theme dark light"
                  onSelect={() =>
                    run(() =>
                      setTheme(resolvedTheme === "dark" ? "light" : "dark")
                    )
                  }
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-surface-muted"
                >
                  {resolvedTheme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  <span>Toggle theme</span>
                </Command.Item>
              </Command.Group>

              <Command.Group
                heading="Connect"
                className="px-2 py-1.5 text-xs font-medium text-subtle [&_[cmdk-group-items]]:mt-1"
              >
                <Command.Item
                  value="email contact"
                  onSelect={() => run(() => (window.location.href = profile.links.email))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-surface-muted"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email Arqam</span>
                </Command.Item>
                <Command.Item
                  value="github"
                  onSelect={() => run(() => window.open(profile.links.github, "_blank"))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-surface-muted"
                >
                  <GithubIcon className="h-4 w-4" />
                  <span>GitHub</span>
                </Command.Item>
                <Command.Item
                  value="linkedin"
                  onSelect={() => run(() => window.open(profile.links.linkedin, "_blank"))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-surface-muted"
                >
                  <LinkedinIcon className="h-4 w-4" />
                  <span>LinkedIn</span>
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      )}
    </>
  );
}
