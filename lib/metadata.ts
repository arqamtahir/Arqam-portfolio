import type { Metadata } from "next";
import { profile } from "./resume";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://arqamtahir.com";

const defaultDescription =
  "Arqam Tahir - Senior Software Engineer building high-performance, SEO-optimized web apps with React, Next.js, TypeScript, Node.js, and a focus on speed.";

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} - ${profile.titles[0]}`,
    template: `%s - ${profile.name}`,
  },
  description: defaultDescription,
  keywords: [
    "Arqam Tahir",
    "Senior Software Engineer",
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript",
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
    title: `${profile.name} - ${profile.titles[0]}`,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} - ${profile.titles[0]}`,
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
  ogType = "website",
  article,
  keywords,
}: {
  title: string;
  description?: string;
  path?: string;
  ogType?: "website" | "article";
  article?: {
    publishedTime?: string;
    authors?: string[];
    tags?: string[];
  };
  keywords?: string[];
}): Metadata {
  const desc = description ?? defaultDescription;
  return {
    title,
    description: desc,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: ogType,
      locale: "en_US",
      siteName: profile.name,
      title: `${title} - ${profile.name}`,
      description: desc,
      url: `${siteUrl}${path}`,
      ...(ogType === "article" && article
        ? {
            publishedTime: article.publishedTime,
            authors: article.authors,
            tags: article.tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ${profile.name}`,
      description: desc,
    },
  };
}
