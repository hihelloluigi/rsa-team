import Link from "next/link";
import type { Match } from "@/lib/types";
import Scoreline from "@/components/Scoreline";
import { matchDateLong } from "@/lib/format";
import Eyebrow from "@/components/Eyebrow";
import { getI18n } from "@/i18n/server";

// The season's next fixture, given hero treatment on the home page. Mirrors the
// scoreline layout of the match detail page so the two read as the same object.
export default async function NextMatch({ match, href }: { match: Match; href: string }) {
  const { t, lang } = await getI18n();
  return (
    <Link href={href} className="block px-5 py-10 text-center transition hover:bg-white/[0.03]">
      <Eyebrow>{t.home.nextMatch}{match.round !== undefined && ` · ${t.common.round(match.round)}`}</Eyebrow>
      <div className="mt-6">
        <Scoreline match={match} />
      </div>
      <p className="mt-6 text-sm text-muted">
        <span className="capitalize">{matchDateLong(match.date, lang)}</span>
        {match.kickoff && <span> · {t.common.kickoffAt(match.kickoff)}</span>}
      </p>
      {match.stadium && (
        <p className="mt-1 text-xs uppercase tracking-widest text-muted">{match.stadium}</p>
      )}
    </Link>
  );
}
