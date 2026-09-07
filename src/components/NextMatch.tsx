import Link from "next/link";
import type { Match } from "@/lib/types";
import { matchSides } from "@/lib/data";
import { matchDateLong } from "@/lib/format";

// The season's next fixture, given hero treatment on the home page. Mirrors the
// scoreline layout of the match detail page so the two read as the same object.
export default function NextMatch({ match, href }: { match: Match; href: string }) {
  const { home, away } = matchSides(match);
  return (
    <Link href={href} className="block px-5 py-10 text-center transition hover:bg-white/[0.03]">
      <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-accent">
        Prossima partita{match.round !== undefined && ` · ${match.round}ª giornata`}
      </p>
      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
        <span
          className={`font-display italic uppercase text-xl sm:text-3xl text-right ${match.home ? "text-accent" : ""}`}
        >
          {home}
        </span>
        <span className="font-display text-2xl sm:text-4xl leading-none text-muted">vs</span>
        <span
          className={`font-display italic uppercase text-xl sm:text-3xl text-left ${!match.home ? "text-accent" : ""}`}
        >
          {away}
        </span>
      </div>
      <p className="mt-6 text-sm text-muted">
        <span className="capitalize">{matchDateLong(match.date)}</span>
        {match.kickoff && <span> · ore {match.kickoff}</span>}
      </p>
      {match.stadium && (
        <p className="mt-1 text-xs uppercase tracking-widest text-muted">{match.stadium}</p>
      )}
    </Link>
  );
}
