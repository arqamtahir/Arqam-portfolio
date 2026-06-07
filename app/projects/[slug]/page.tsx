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

function caseStudyJsonLd(slug: string) {
  const project = projects.find((p) => p.slug === slug)!;
  const study = caseStudies[slug];
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
    </div>
  );
}
