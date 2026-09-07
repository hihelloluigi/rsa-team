import Link from "next/link";
import type { Match } from "@/lib/types";
import Scoreline from "@/components/Scoreline";
import { matchDateLong } from "@/lib/format";

// The season's next fixture, given hero treatment on the home page. Mirrors the
// scoreline layout of the match detail page so the two read as the same object.
export default function NextMatch({ match, href }: { match: Match; href: string }) {
  return (
    <Link href={href} className="block px-5 py-10 text-center transition hover:bg-white/[0.03]">
      <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-accent">
        Prossima partita{match.round !== undefined && ` · ${match.round}ª giornata`}
      </p>
      <div className="mt-6">
        <Scoreline match={match} />
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
