import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Shared Open Graph / Twitter card renderer.
 * Uses the system font stack baked into next/og - no font assets required.
 */
export function renderOg({
  eyebrow,
  title,
  subtitle,
  tags,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  tags?: string[];
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #0b0d10 0%, #11151b 55%, #0b0d10 100%)",
          color: "#f5f7fa",
          fontFamily: "sans-serif",
        }}
      >
        {/* ambient accent */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "rgba(99,102,241,0.22)",
            filter: "blur(120px)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              background: "#818cf8",
            }}
          />
          <span
            style={{
              fontSize: 26,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#a9b2c0",
            }}
          >
            {eyebrow}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 980,
            }}
          >
            {title}
          </span>
          {subtitle ? (
            <span style={{ fontSize: 32, color: "#a9b2c0", maxWidth: 920 }}>
              {subtitle}
            </span>
          ) : null}
          {tags && tags.length > 0 ? (
            <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
              {tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 24,
                    color: "#cdd4de",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: 9999,
                    padding: "8px 20px",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#cdd4de",
          }}
        >
          <span style={{ fontWeight: 600, color: "#f5f7fa" }}>Arqam Tahir</span>
          <span>Senior Software Engineer · Full Stack</span>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
