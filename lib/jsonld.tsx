import { profile, skills } from "./resume";
import { siteUrl } from "./metadata";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteUrl,
    email: profile.email,
    jobTitle: profile.titles[0],
    description: profile.summary,
    sameAs: [profile.links.github, profile.links.linkedin],
    knowsAbout: [
      ...skills.Frontend.slice(0, 6),
      ...skills.Backend.slice(0, 4),
      "SEO Engineering",
      "Performance Optimization",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressCountry: "PK",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile.name,
    url: siteUrl,
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
