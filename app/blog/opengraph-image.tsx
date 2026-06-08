import { OG_SIZE, OG_CONTENT_TYPE, renderOg } from "@/lib/og";

export const alt = "Blog - engineering notes from Arqam Tahir";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    eyebrow: "Writing",
    title: "Notes from the build.",
    subtitle: "Performance engineering, frontend architecture, and technical SEO.",
    tags: ["Next.js", "Performance", "Architecture", "SEO"],
  });
}
