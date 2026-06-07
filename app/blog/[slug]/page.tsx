import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { TableOfContents } from "@/components/blog/table-of-contents";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  formatDate,
} from "@/lib/blog";
import { pageMetadata, siteUrl } from "@/lib/metadata";
import { JsonLd } from "@/lib/jsonld";
import { profile } from "@/lib/resume";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || post.draft) return {};
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    ogType: "article",
    article: {
      publishedTime: post.date,
      authors: [profile.name],
      tags: post.tags,
    },
  });
}

function articleJsonLd(slug: string) {
  const post = getPostBySlug(slug)!;
  const url = `${siteUrl}/blog/${post.slug}`;
  const wordCount = post.html
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url,
    image: {
      "@type": "ImageObject",
      url: `${url}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    wordCount,
    author: { "@type": "Person", name: profile.name, url: siteUrl },
    publisher: { "@type": "Person", name: profile.name, url: siteUrl },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

function breadcrumbJsonLd(slug: string) {
  const post = getPostBySlug(slug)!;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteUrl}/blog/${post.slug}`,
      },
    ],
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || post.draft) notFound();

  const related = getRelatedPosts(slug);

  return (
    <div className="pb-24 pt-28 md:pt-32">
      <article className="container-page">
        {/* Header */}
        <Reveal>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All writing
          </Link>
        </Reveal>

        <div className="mt-8 max-w-3xl">
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span className="font-medium uppercase tracking-wide text-accent">
                {post.category}
              </span>
              <span className="h-1 w-1 rounded-full bg-border-strong" />
              <span className="font-mono text-subtle">{formatDate(post.date)}</span>
              <span className="h-1 w-1 rounded-full bg-border-strong" />
              <span className="font-mono text-subtle">
                {post.readingTime} min read
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-5xl">
              {post.title}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {post.excerpt}
            </p>
          </Reveal>
        </div>

        {/* Body + TOC */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_15rem] lg:gap-16">
          <Reveal className="min-w-0">
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </Reveal>

          <aside className="order-first lg:order-last">
            <div className="lg:sticky lg:top-28">
              <TableOfContents items={post.toc} />
            </div>
          </aside>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-page mt-24 md:mt-28">
          <div className="border-t border-border pt-12">
            <h2 className="text-xs font-medium uppercase tracking-wide text-subtle">
              Keep reading
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-strong"
                >
                  <span className="text-xs font-medium uppercase tracking-wide text-accent">
                    {r.category}
                  </span>
                  <h3 className="mt-2 flex items-start gap-2 text-lg font-semibold tracking-tight text-foreground">
                    <span className="text-balance">{r.title}</span>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {r.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd data={articleJsonLd(slug)} />
      <JsonLd data={breadcrumbJsonLd(slug)} />
    </div>
  );
}
