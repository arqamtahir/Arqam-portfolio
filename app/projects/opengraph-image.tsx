import { OG_SIZE, OG_CONTENT_TYPE, renderOg } from "@/lib/og";

export const alt = "Projects - production platforms, documented as case studies";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    eyebrow: "Case studies",
    title: "Production platforms, documented as case studies.",
    subtitle: "Problem, approach, architecture, and measured impact for each build.",
  });
}
