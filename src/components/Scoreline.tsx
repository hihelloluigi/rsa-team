import type { Match } from "@/lib/types";
import { matchSides } from "@/lib/data";

// Only the middle column differs between the two call sites.
const CENTER = {
  md: "text-2xl sm:text-4xl",
  lg: "text-5xl sm:text-7xl",
} as const;

// Home team, result, away team, with RSA's side picked out in accent. The same
// object appears on the home page and on a match's own page, so it is defined
// once here rather than re-derived at each.
export default function Scoreline({
  match,
  size = "md",
}: {
  match: Match;
  size?: keyof typeof CENTER;
}) {
  const { home, away, homeScore, awayScore } = matchSides(match);
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
      <span
        className={`font-display italic uppercase text-xl sm:text-3xl text-right ${match.home ? "text-accent" : ""}`}
      >
        {home}
      </span>
      <span
        className={`font-display leading-none ${CENTER[size]} ${match.score ? "" : "text-muted"}`}
      >
        {match.score ? `${homeScore} : ${awayScore}` : "vs"}
      </span>
      <span
        className={`font-display italic uppercase text-xl sm:text-3xl text-left ${!match.home ? "text-accent" : ""}`}
      >
        {away}
      </span>
    </div>
  );
}
