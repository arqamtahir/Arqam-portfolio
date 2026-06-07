import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { navItems, profile } from "@/lib/resume";

const connect = [
  { label: "Email", href: profile.links.email, Icon: Mail, external: false },
  { label: "GitHub", href: profile.links.github, Icon: GithubIcon, external: true },
  { label: "LinkedIn", href: profile.links.linkedin, Icon: LinkedinIcon, external: true },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          {/* Brand statement */}
          <div className="md:col-span-6 lg:col-span-7">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-subtle transition-colors hover:text-foreground"
            >
              <img
                src="/logo-mark.svg"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7"
              />
              {profile.name}
            </Link>
            <p className="mt-6 max-w-md text-balance text-xl font-medium leading-snug tracking-tight text-foreground md:text-2xl">
              Building fast, accessible web products that scale — from system
              architecture to the final pixel.
            </p>
            <p className="mt-4 text-sm text-subtle">
              Available for consulting, freelance, and full-time work.
            </p>
          </div>

          {/* Navigate */}
          <nav
            aria-label="Footer"
            className="md:col-span-3 lg:col-span-2"
          >
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-subtle">
              Navigate
            </h2>
            <ul className="mt-5 space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center text-sm text-muted transition-colors hover:text-foreground"
                  >
                    <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div className="md:col-span-3">
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-subtle">
              Connect
            </h2>
            <ul className="mt-5 space-y-3">
              {connect.map(({ label, href, Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer me" }
                      : {})}
                    className="group inline-flex items-center gap-3 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-subtle transition-colors group-hover:border-border-strong group-hover:text-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-border pt-8">
          <p className="text-xs text-subtle">
            © {year} {profile.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
