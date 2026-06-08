import { OG_SIZE, OG_CONTENT_TYPE, renderOg } from "@/lib/og";

export const alt = "Arqam Tahir - Senior Software Engineer & Full Stack Developer";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    eyebrow: "Available for work",
    title: "Building high-performance web apps that scale.",
    subtitle: "React · Next.js · Vue · Node.js - performance, SEO & i18n at production scale.",
  });
}
