import Link from "next/link";
import type { Match, MatchResult } from "@/lib/types";
import { matchResult, matchSides } from "@/lib/matches";
import { matchDateShort } from "@/lib/format";
import { getI18n } from "@/i18n/server";

const badge: Record<MatchResult, string> = {
  W: "bg-accent text-white", D: "bg-white/20 text-white", L: "bg-white/5 text-muted",
};

// `next` marks the season's next fixture in a calendar that also lists results,
// so the eye lands on what is coming without the list being reordered for it.
export default async function MatchRow({ match, href, next = false }: { match: Match; href?: string; next?: boolean }) {
  const { t, lang } = await getI18n();
  const result = matchResult(match);
  const { home, away, homeScore, awayScore } = matchSides(match);
  const dateStr = matchDateShort(match.date, lang);

  // Played matches show their result and postponed ones say so; the rest show
  // their kickoff time. `match.date` only carries the day (the time part is a
  // placeholder), so the hour has to come from `kickoff`.
  const resultBadge = result ? (
    <span className={`inline-block w-7 text-center text-xs font-extrabold py-1 ${badge[result]}`}>
      {/* The letter alone is meaningless read aloud, so the word goes with it. */}
      <span aria-hidden="true">{t.results.short[result]}</span>
      <span className="sr-only">{t.results.long[result]}</span>
    </span>
  ) : match.status === "postponed" ? (
    <span className="text-[11px] uppercase tracking-widest text-accent">{t.common.postponed}</span>
  ) : match.kickoff ? (
    <span className="text-[11px] text-muted uppercase">{match.kickoff}</span>
  ) : null;

  const nextLabel = next && (
    <span className="font-extrabold text-accent">{t.matches.next}</span>
  );

  // The highlight bleeds into the gutter (-mx/px) so its columns stay aligned
  // with the rows around it; the border's 2px come out of the left padding.
  const inner = (
    <div className={`border-b border-white/10 py-4 ${next ? "-mx-3 border-l-2 border-l-accent bg-accent/[0.07] pl-[10px] pr-3" : ""}`}>
      {/* Mobile: stacked layout — date/result on top, one team per line */}
      <div className="sm:hidden">
        <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-widest text-muted">
          <span>{nextLabel}{next && " · "}{dateStr}</span>
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
        <div className="w-24 shrink-0 text-xs text-muted uppercase tracking-widest">
          {next && <div className="mb-1 text-[10px]">{nextLabel}</div>}
          {dateStr}
        </div>
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
