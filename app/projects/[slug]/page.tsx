import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/projects/case-study";
import { caseStudies, projects } from "@/lib/resume";
import { pageMetadata, siteUrl } from "@/lib/metadata";
import { JsonLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return pageMetadata({
    title: project.name,
    description: project.tagline,
    path: `/projects/${project.slug}`,
  });
}

const projectImages: Record<string, string> = {
  nice2stay: `${siteUrl}/images/projects/nice2stay.png`,
  staywithlumina: `${siteUrl}/images/projects/staywithlumina.png`,
  "hotel-weekend": `${siteUrl}/images/projects/hotel-weekend.png`,
};

function caseStudyJsonLd(slug: string) {
  const project = projects.find((p) => p.slug === slug)!;
  const study = caseStudies[slug];
  const imageUrl = projectImages[project.slug];
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    headline: project.tagline,
    abstract: study?.summary,
    url: `${siteUrl}/projects/${slug}`,
    keywords: project.stack.join(", "),
    about: project.category.join(", "),
    author: { "@type": "Person", name: "Arqam Tahir", url: siteUrl },
    ...(imageUrl
      ? {
          image: {
            "@type": "ImageObject",
            url: imageUrl,
            width: 1200,
            height: 800,
            caption: `${project.name} — developed by Arqam Tahir, Senior Software Engineer`,
          },
        }
      : {}),
  };
}

function breadcrumbJsonLd(slug: string) {
  const project = projects.find((p) => p.slug === slug)!;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${siteUrl}/projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.name,
        item: `${siteUrl}/projects/${slug}`,
      },
    ],
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  const study = caseStudies[slug];

  if (!project || !study) notFound();

  const next = projects[(index + 1) % projects.length];

  return (
    <div>
      <CaseStudy project={project} study={study} next={next} />
      <JsonLd data={caseStudyJsonLd(slug)} />
      <JsonLd data={breadcrumbJsonLd(slug)} />
    </div>
  );
}
