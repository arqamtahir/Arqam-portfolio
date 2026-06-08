import { OG_SIZE, OG_CONTENT_TYPE, renderOg } from "@/lib/og";

export const alt = "Playground - a lab of engineered UI systems";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    eyebrow: "Playground",
    title: "Where interface systems get built before they ship.",
    subtitle: "Interaction patterns, motion studies, and frontend experiments.",
    tags: ["Motion", "UI Interaction", "Data Viz", "Layout"],
  });
}
