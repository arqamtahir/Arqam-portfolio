import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/blog-index";
import { getAllPosts, getCategories, formatDate } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Engineering notes on Next.js performance, frontend architecture, and SEO - practical write-ups from building production web applications.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllPosts().map((p) => ({ ...p, dateLabel: formatDate(p.date) }));
  const categories = getCategories();

  return (
    <div className="pb-24 pt-28 md:pt-32">
      <section className="container-page">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Writing
          </div>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Notes from the build.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Practical write-ups on performance engineering, frontend
            architecture, and technical SEO - the decisions behind shipping
            fast, durable web applications.
          </p>
        </div>
      </section>

      <section className="container-page mt-14 md:mt-16">
        {posts.length > 0 ? (
          <BlogIndex posts={posts} categories={categories} />
        ) : (
          <p className="text-muted">No posts published yet - check back soon.</p>
        )}
      </section>
    </div>
  );
}
