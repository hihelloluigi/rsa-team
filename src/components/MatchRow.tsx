import Link from "next/link";
import type { Match, MatchResult } from "@/lib/types";
import { matchResult, matchSides } from "@/lib/matches";
import { matchDateShort, resultLabels, resultNames } from "@/lib/format";

const badge: Record<MatchResult, string> = {
  W: "bg-accent text-white", D: "bg-white/20 text-white", L: "bg-white/5 text-muted",
};

export default function MatchRow({ match, href }: { match: Match; href?: string }) {
  const result = matchResult(match);
  const { home, away, homeScore, awayScore } = matchSides(match);
  const dateStr = matchDateShort(match.date);

  // Played matches show their result and postponed ones say so; the rest show
  // their kickoff time. `match.date` only carries the day (the time part is a
  // placeholder), so the hour has to come from `kickoff`.
  const resultBadge = result ? (
    <span className={`inline-block w-7 text-center text-xs font-extrabold py-1 ${badge[result]}`}>
      {/* The letter alone is meaningless read aloud, so the word goes with it. */}
      <span aria-hidden="true">{resultLabels[result]}</span>
      <span className="sr-only">{resultNames[result]}</span>
    </span>
  ) : match.status === "postponed" ? (
    <span className="text-[11px] uppercase tracking-widest text-accent">Rinviata</span>
  ) : match.kickoff ? (
    <span className="text-[11px] text-muted uppercase">{match.kickoff}</span>
  ) : null;

  const inner = (
    <div className="border-b border-white/10 py-4">
      {/* Mobile: stacked layout — date/result on top, one team per line */}
      <div className="sm:hidden">
        <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-widest text-muted">
          <span>{dateStr}</span>
          {resultBadge}
        </div>
        <div className="space-y-1 font-bold">
          <div className="flex items-center justify-between gap-3">
            <span className={match.home ? "text-accent" : ""}>{home}</span>
            {match.score && <span className="font-display text-lg leading-none">{homeScore}</span>}
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className={!match.home ? "text-accent" : ""}>{away}</span>
            {match.score && <span className="font-display text-lg leading-none">{awayScore}</span>}
          </div>
        </div>
      </div>

      {/* Desktop: single row — score is a fixed center column so it always aligns */}
      <div className="hidden sm:flex items-center gap-4">
        <div className="w-24 shrink-0 text-xs text-muted uppercase tracking-widest">{dateStr}</div>
        <div className="flex-1 flex items-center gap-4 font-bold">
          <span className={`flex-1 text-right ${match.home ? "text-accent" : ""}`}>{home}</span>
          {match.score ? (
            <span className="font-display text-xl w-20 shrink-0 text-center">{homeScore} : {awayScore}</span>
          ) : (
            <span className="w-20 shrink-0 text-center text-muted">vs</span>
          )}
          <span className={`flex-1 text-left ${!match.home ? "text-accent" : ""}`}>{away}</span>
        </div>
        <div className="w-16 shrink-0 text-right">{resultBadge}</div>
      </div>
    </div>
  );

  if (!href) return inner;
  return (
    <Link href={href} className="block transition hover:bg-white/[0.03]">
      {inner}
    </Link>
  );
}
