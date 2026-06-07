import { OG_SIZE, OG_CONTENT_TYPE, renderOg } from "@/lib/og";

export const alt = "Get in Touch — Let's work together";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    eyebrow: "Get in Touch",
    title: "Let's work together",
    subtitle: "Available for remote work, consulting, and full-time roles",
    tags: ["Remote", "Available", "Next.js", "Full Stack"],
  });
}
