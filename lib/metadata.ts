import type { Metadata } from "next";
import { profile } from "./resume";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://arqamtahir.com";

const defaultDescription =
  "Arqam Tahir — Senior Software Engineer & Full Stack Developer building high-performance, SEO-optimized web applications with React, Next.js, Vue, and Node.js.";

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.titles[0]}`,
    template: `%s — ${profile.name}`,
  },
  description: defaultDescription,
  keywords: [
    "Arqam Tahir",
    "Senior Software Engineer",
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "Vue Developer",
    "MERN Stack",
    "SEO Engineering",
    "Performance Optimization",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: profile.name,
    title: `${profile.name} — ${profile.titles[0]}`,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.titles[0]}`,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export function pageMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const desc = description ?? defaultDescription;
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} — ${profile.name}`,
      description: desc,
      url: `${siteUrl}${path}`,
    },
    twitter: { title: `${title} — ${profile.name}`, description: desc },
  };
}
