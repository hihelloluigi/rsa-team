import { ImageResponse } from "next/og";

export const alt = "RSA TEAM — Siamo Matti";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social-share card, mirroring the site's black/magenta identity.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#ffffff",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: 12,
            textTransform: "uppercase",
            color: "#ff2077",
          }}
        >
          Dal 2025
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 200,
            fontStyle: "italic",
            fontWeight: 900,
            lineHeight: 0.9,
            textTransform: "uppercase",
          }}
        >
          RSA<span style={{ color: "#ff2077" }}>&nbsp;TEAM</span>
        </div>
        <div style={{ marginTop: 24, fontSize: 40, color: "#a1a1a1" }}>
          Più cuore che tattica, da sempre.
        </div>
      </div>
    ),
    size,
  );
}
