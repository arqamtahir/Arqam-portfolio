import { OG_SIZE, OG_CONTENT_TYPE, renderOg } from "@/lib/og";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export const alt = "Blog post - Arqam Tahir";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return renderOg({
    eyebrow: post?.category ?? "Blog",
    title: post?.title ?? "Notes from the build",
    subtitle: post?.excerpt,
    tags: post?.tags?.slice(0, 4),
  });
}
