import { ImageResponse } from "next/og";

export const alt = "LUMINARA — local-first AI ecosystem";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(108,255,255,0.20), transparent 70%), linear-gradient(180deg, #07080a 0%, #0e1418 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          color: "#e6e6e6",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#6cf",
              boxShadow: "0 0 20px #6cf",
            }}
          />
          <div style={{ fontSize: 28, letterSpacing: 4, color: "#6cf" }}>LUMINARA</div>
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05, marginBottom: 24, maxWidth: 1000 }}>
          The system around the model.
        </div>
        <div style={{ fontSize: 28, color: "#a1a1aa", maxWidth: 900 }}>
          Agent OS · Sigil Engine · Multimedia. Local-first. Open source.
        </div>
      </div>
    ),
    size
  );
}
