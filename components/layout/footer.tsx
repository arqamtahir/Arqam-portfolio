import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { navItems, profile } from "@/lib/resume";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-page py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-fg">
                AT
              </span>
              {profile.name}
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {profile.titles.join(" · ")}. {profile.remote}.
            </p>
            <p className="mt-2 text-sm text-subtle">{profile.relocation}</p>
          </div>

          <div className="flex gap-16">
            <nav className="flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-wide text-subtle">
                Navigate
              </span>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-wide text-subtle">
                Connect
              </span>
              <a href={profile.links.email} className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground">
                <Mail className="h-4 w-4" /> Email
              </a>
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground">
                <GithubIcon className="h-4 w-4" /> GitHub
              </a>
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground">
                <LinkedinIcon className="h-4 w-4" /> LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
          <span>Built with Next.js, TypeScript &amp; Framer Motion.</span>
        </div>
      </div>
    </footer>
  );
}
