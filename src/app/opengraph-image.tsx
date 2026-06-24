import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "RSA TEAM — Siamo Matti";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social-share card: just the club crest, centred on the site's
// black identity. The crest is read from /public and inlined because the OG
// renderer can't dereference a site URL.
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
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <img src={logoSrc} width={520} height={520} alt="" />
      </div>
    ),
    size,
  );
}
