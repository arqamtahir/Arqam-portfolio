import { faqs, profile } from "./resume";
import { siteUrl } from "./metadata";

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteUrl,
    email: profile.links.email,
    jobTitle: profile.titles[0],
    description: profile.summary,
    image: {
      "@type": "ImageObject",
      url: `${siteUrl}/images/arqam-tahir.png`,
      width: 2176,
      height: 3840,
      caption:
        "Arqam Tahir - Senior Software Engineer, Next.js and React specialist",
    },
    sameAs: [profile.links.github, profile.links.linkedin],
    knowsAbout: [
      "React",
      "Next.js",
      "Vue.js",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Express",
      "MongoDB",
      "PostgreSQL",
      "REST APIs",
      "GraphQL",
      "Tailwind CSS",
      "Web Performance Optimization",
      "Technical SEO",
      "Full Stack Development",
    ],
    knowsLanguage: ["English", "Urdu"],
    nationality: "Pakistani",
    availableForHire: true,
    workLocation: {
      "@type": "VirtualLocation",
      name: "Remote",
    },
    areaServed: ["Worldwide", "United States", "Europe", "Middle East"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressCountry: "PK",
    },
  };
}

export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact - ${profile.name}`,
    url: `${siteUrl}/contact`,
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      email: profile.links.email,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "professional inquiry",
        email: profile.links.email,
        availableLanguage: ["English", "Urdu"],
      },
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
