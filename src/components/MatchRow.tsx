import Link from "next/link";
import type { Match } from "@/lib/types";
import { matchResult } from "@/lib/data";

const badge: Record<string, string> = {
  W: "bg-accent text-white", D: "bg-white/20 text-white", L: "bg-white/5 text-muted",
};

const resultLabel: Record<string, string> = {
  W: "V", D: "N", L: "P",
};

export default function MatchRow({ match, href }: { match: Match; href?: string }) {
  const result = matchResult(match);
  const home = match.home ? "RSA TEAM" : match.opponent;
  const away = match.home ? match.opponent : "RSA TEAM";
  // Pair each side with its own goals (home goals : away goals), not RSA-first.
  const homeScore = match.home ? match.score?.rsa : match.score?.opponent;
  const awayScore = match.home ? match.score?.opponent : match.score?.rsa;
  const d = new Date(match.date);
  const dateStr = d.toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" });
  const timeStr = d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

  const resultBadge = result ? (
    <span className={`inline-block w-7 text-center text-xs font-extrabold py-1 ${badge[result]}`}>
      {resultLabel[result]}
    </span>
  ) : (
    <span className="text-[11px] text-muted uppercase">{timeStr}</span>
  );

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
        <div className="w-10 shrink-0 text-right">{resultBadge}</div>
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
