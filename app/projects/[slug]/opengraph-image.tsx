import { OG_SIZE, OG_CONTENT_TYPE, renderOg } from "@/lib/og";
import { projects } from "@/lib/resume";

export const alt = "Project case study - Arqam Tahir";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  return renderOg({
    eyebrow:
      (Array.isArray(project?.category)
        ? project?.category[0]
        : project?.category) ?? "Case study",
    title: project?.name ?? "Case study",
    subtitle: project?.tagline,
    tags: project?.stack.slice(0, 4),
  });
}
