import { projects } from "@/lib/resume";
import { siteUrl } from "@/lib/metadata";

const SCREENSHOT_SLUGS = new Set([
  "nice2stay",
  "staywithlumina",
  "hotel-weekend",
]);

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const entries: string[] = [];

  entries.push(`  <url>
    <loc>${siteUrl}/</loc>
    <image:image>
      <image:loc>${siteUrl}/images/projects/arqam-tahir-portfolio.png</image:loc>
      <image:title>${escapeXml(
        "Arqam Tahir — Senior Software Engineer portfolio"
      )}</image:title>
      <image:caption>${escapeXml(
        "Portfolio of Arqam Tahir, a Next.js and React specialist building high-performance web applications."
      )}</image:caption>
    </image:image>
  </url>`);

  for (const project of projects) {
    if (!SCREENSHOT_SLUGS.has(project.slug)) continue;
    entries.push(`  <url>
    <loc>${siteUrl}/projects/${project.slug}</loc>
    <image:image>
      <image:loc>${siteUrl}/images/projects/${project.slug}.png</image:loc>
      <image:title>${escapeXml(
        `${project.name} — built by Arqam Tahir`
      )}</image:title>
      <image:caption>${escapeXml(
        `${project.name}: ${project.tagline}`
      )}</image:caption>
    </image:image>
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
