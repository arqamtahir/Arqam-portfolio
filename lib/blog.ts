/**
 * Blog content system - file-based, zero CMS.
 *
 * Source of truth is Markdown in /content/blog/*.md with frontmatter:
 *   title, date (YYYY-MM-DD), excerpt, category, tags[], slug, draft?
 *
 * Server-only: this module touches the filesystem and must never be imported
 * into a Client Component. Body Markdown is rendered to an HTML string with
 * `marked` and injected server-side, so published posts ship zero client JS.
 */
import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  tags: string[];
  readingTime: number;
  draft: boolean;
};

export type TocItem = { id: string; text: string; level: 2 | 3 };

export type Post = PostMeta & { html: string; toc: TocItem[] };

/** Stable, URL-safe heading id. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** A fresh Marked instance that stamps slug ids onto h2/h3 for TOC anchoring. */
function createRenderer() {
  const m = new Marked({ gfm: true });
  m.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const raw = tokens.map((t) => ("text" in t ? t.text : "")).join("");
        const id = slugify(raw);
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
    },
  });
  return m;
}

function readingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  for (const line of markdown.split("\n")) {
    const match = /^(##|###)\s+(.*)$/.exec(line.trim());
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/[*_`]/g, "").trim();
    items.push({ id: slugify(text), text, level });
  }
  return items;
}

function fileToMeta(file: string): { meta: PostMeta; content: string } {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const slug = (data.slug as string) ?? file.replace(/\.md$/, "");
  return {
    content,
    meta: {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "1970-01-01",
      excerpt: data.excerpt ?? "",
      category: data.category ?? "Engineering",
      tags: Array.isArray(data.tags) ? data.tags : [],
      readingTime: readingTime(content),
      draft: data.draft === true,
    },
  };
}

function listFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
}

/** All published posts, newest first. Drafts excluded. */
export function getAllPosts(): PostMeta[] {
  return listFiles()
    .map((f) => fileToMeta(f).meta)
    .filter((m) => !m.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getCategories(): string[] {
  return Array.from(new Set(getAllPosts().map((p) => p.category)));
}

export function getPostBySlug(slug: string): Post | null {
  const file = listFiles().find((f) => fileToMeta(f).meta.slug === slug);
  if (!file) return null;
  const { meta, content } = fileToMeta(file);
  const html = createRenderer().parse(content) as string;
  return { ...meta, html, toc: extractToc(content) };
}

/** Up to `limit` other published posts, preferring the same category. */
export function getRelatedPosts(slug: string, limit = 2): PostMeta[] {
  const all = getAllPosts().filter((p) => p.slug !== slug);
  const current = all.find((p) => p.slug === slug);
  const sameCat = all.filter((p) => p.category === current?.category);
  const rest = all.filter((p) => p.category !== current?.category);
  return [...sameCat, ...rest].slice(0, limit);
}

/** Human-readable date, e.g. "June 6, 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
