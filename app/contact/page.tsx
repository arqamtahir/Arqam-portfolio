import type { Metadata } from "next";
import { Download, Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { CopyEmail } from "@/components/ui/copy-email";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/motion";
import { profile } from "@/lib/resume";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch to hire Arqam Tahir, a senior developer available for Next.js freelance, consulting, and full-time roles. Remote-ready across global time zones.",
  keywords: [
    "hire",
    "senior developer",
    "Next.js",
    "remote",
    "available",
  ],
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden pb-24 pt-28 md:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[48rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="container-page relative">
        {/* Header */}
        <div className="max-w-2xl">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Available now
          </span>
          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl">
            Let&apos;s talk about your project.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Whether you&apos;re a founder with a product to ship, a team that needs a
            senior engineer, or a recruiter with the right role - tell me what you&apos;re
            building and I&apos;ll reply within a couple of business days.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {/* Left - contact rail */}
          <Reveal className="flex flex-col gap-8">
            <div>
              <h2 className="text-xs font-medium uppercase tracking-wide text-subtle">
                Reach me directly
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                <a
                  href={profile.links.email}
                  className="group flex items-center gap-3 text-sm text-foreground"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface transition-colors group-hover:border-border-strong">
                    <Mail className="h-4 w-4 text-accent" />
                  </span>
                  <span className="break-all group-hover:text-accent">{profile.email}</span>
                </a>
                <div className="flex flex-wrap gap-3 pl-[3.25rem]">
                  <CopyEmail />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-medium uppercase tracking-wide text-subtle">
                Elsewhere
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <SocialLink
                  href={profile.links.linkedin}
                  label="LinkedIn"
                  icon={<LinkedinIcon className="h-4 w-4" />}
                />
                <SocialLink
                  href={profile.links.github}
                  label="GitHub"
                  icon={<GithubIcon className="h-4 w-4" />}
                />
                <a
                  href={profile.resumeUrl}
                  download
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground"
                >
                  <Download className="h-4 w-4" /> Résumé
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                {profile.availability}
              </div>
              <dl className="mt-5 flex flex-col gap-3 text-sm">
                <Detail icon={<MapPin className="h-4 w-4 text-subtle" />} label="Based in" value={profile.location} />
                <Detail icon={<MapPin className="h-4 w-4 text-subtle" />} label="Open to" value={profile.relocation.replace("Open to relocation - ", "")} />
                <Detail icon={<Clock className="h-4 w-4 text-subtle" />} label="Time zones" value="EST · CET · GST · PKT" />
              </dl>
            </div>
          </Reveal>

          {/* Right - form */}
          <Reveal delay={0.08}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer me"
      className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground"
    >
      {icon} {label}
    </a>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <dt className="w-24 shrink-0 text-subtle">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}
