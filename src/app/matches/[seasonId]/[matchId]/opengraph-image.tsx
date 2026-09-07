import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getMatch, getSeasons } from "@/lib/data";
import { matchSides } from "@/lib/matches";
import { matchDateLong } from "@/lib/format";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Partita dell'RSA TEAM";

export function generateStaticParams() {
  return getSeasons().flatMap((s) => s.matches.map((m) => ({ seasonId: s.id, matchId: m.id })));
}

const ACCENT = "#ff2077";
const MUTED = "#a1a1a1";

// The share card for one fixture. Rendered at build time, one per match, so a
// link pasted into a chat shows the scoreline rather than the same crest every
// time. Satori supports a subset of CSS — flexbox only, and any element with
// more than one child needs an explicit display:flex.
export default async function Image({
  params,
}: {
  params: Promise<{ seasonId: string; matchId: string }>;
}) {
  const { seasonId, matchId } = await params;
  const found = getMatch(seasonId, matchId);

  const logo = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  // A match that does not exist still has to render something rather than
  // throwing the whole build.
  if (!found) {
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
          <img src={logoSrc} width={420} height={420} alt="" />
        </div>
      ),
      size,
    );
  }

  const { season, match } = found;
  const { home, away, homeScore, awayScore } = matchSides(match);

  // The site capitalises the weekday with CSS; the image renderer has no such
  // step, so it is done here.
  const long = matchDateLong(match.date);
  const dateLine = `${long.charAt(0).toUpperCase()}${long.slice(1)}${
    match.kickoff ? ` · ore ${match.kickoff}` : ""
  }`;
  // Only the regular weight is available to the renderer, so the emphasis has
  // to come from case and scale rather than from bold.
  const teamStyle = (isUs: boolean) => ({
    flex: 1,
    display: "flex",
    fontSize: 56,
    lineHeight: 1.1,
    letterSpacing: -1,
    textTransform: "uppercase" as const,
    color: isUs ? ACCENT : "#ffffff",
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#ffffff",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src={logoSrc} width={84} height={84} alt="" />
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: ACCENT,
            }}
          >
            {match.competition} · {season.label}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ ...teamStyle(match.home), justifyContent: "flex-end", textAlign: "right" }}>
            {home}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: match.score ? 116 : 64,
              letterSpacing: -2,
              color: match.score ? "#ffffff" : MUTED,
            }}
          >
            {match.score ? `${homeScore} : ${awayScore}` : "vs"}
          </div>
          <div style={{ ...teamStyle(!match.home), justifyContent: "flex-start" }}>{away}</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 26,
            color: MUTED,
          }}
        >
          <div style={{ display: "flex" }}>
            {match.status === "postponed" ? "Rinviata" : dateLine}
          </div>
          <div style={{ display: "flex", letterSpacing: 6, textTransform: "uppercase" }}>
            Siamo Matti
          </div>
        </div>
      </div>
    ),
    size,
  );
}
