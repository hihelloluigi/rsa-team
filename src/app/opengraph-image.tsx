import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "RSA TEAM — Siamo Matti";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social-share card: the club crest beside the wordmark, on the site's
// black/magenta identity. The crest is read from /public and inlined because
// the OG renderer can't dereference a site URL.
export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: "72px",
          background: "#0a0a0a",
          color: "#ffffff",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <img src={logoSrc} width={400} height={400} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "#ff2077",
            }}
          >
            Dal 2025
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 140,
              fontStyle: "italic",
              fontWeight: 900,
              lineHeight: 0.85,
              textTransform: "uppercase",
            }}
          >
            <span>RSA</span>
            <span style={{ color: "#ff2077" }}>TEAM</span>
          </div>
          <div style={{ marginTop: 20, fontSize: 34, color: "#a1a1a1" }}>
            Più cuore che tattica, da sempre.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
