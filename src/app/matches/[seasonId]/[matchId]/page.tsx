import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeasons, getMatch, matchResult } from "@/lib/data";
import WinCelebration from "@/components/WinCelebration";

type Params = Promise<{ seasonId: string; matchId: string }>;

export function generateStaticParams() {
  return getSeasons().flatMap((s) => s.matches.map((m) => ({ seasonId: s.id, matchId: m.id })));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { seasonId, matchId } = await params;
  const found = getMatch(seasonId, matchId);
  if (!found) return { title: "Partita — RSA TEAM" };
  const { match } = found;
  const home = match.home ? "RSA TEAM" : match.opponent;
  const away = match.home ? match.opponent : "RSA TEAM";
  return { title: `${home} - ${away} — RSA TEAM` };
}

const resultText: Record<string, string> = { W: "Vittoria", D: "Pareggio", L: "Sconfitta" };
const resultClass: Record<string, string> = { W: "text-accent", D: "text-white", L: "text-muted" };

export default async function MatchDetailPage({ params }: { params: Params }) {
  const { seasonId, matchId } = await params;
  const found = getMatch(seasonId, matchId);
  if (!found) notFound();

  const { season, match } = found;
  const result = matchResult(match);
  const won = result === "W";
  const home = match.home ? "RSA TEAM" : match.opponent;
  const away = match.home ? match.opponent : "RSA TEAM";
  const homeScore = match.home ? match.score?.rsa : match.score?.opponent;
  const awayScore = match.home ? match.score?.opponent : match.score?.rsa;
  const dateStr = new Date(match.date).toLocaleDateString("it-IT", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });

  const hasScorers = !!(match.scorers && (match.scorers.rsa?.length || match.scorers.opponent?.length));
  const hasDetails = !!match.stadium || hasScorers;

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      {won && <WinCelebration />}

      <Link
        href={`/matches?season=${season.id}`}
        className="text-xs uppercase tracking-widest text-muted hover:text-accent"
      >
        ← Torna alle partite
      </Link>

      {/* Scoreline */}
      <div className="mt-10 text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-accent">
          {match.competition} · {season.label}
        </p>
        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
          <span className={`font-display italic uppercase text-xl sm:text-3xl text-right ${match.home ? "text-accent" : ""}`}>
            {home}
          </span>
          <span className="font-display text-5xl sm:text-7xl leading-none">
            {match.score ? `${homeScore} : ${awayScore}` : "vs"}
          </span>
          <span className={`font-display italic uppercase text-xl sm:text-3xl text-left ${!match.home ? "text-accent" : ""}`}>
            {away}
          </span>
        </div>
        {result && (
          <p className={`mt-6 font-display italic uppercase text-2xl sm:text-3xl ${resultClass[result]}`}>
            {resultText[result]}
          </p>
        )}
        <p className="mt-2 text-sm text-muted capitalize">{dateStr}</p>
      </div>

      {/* Details */}
      {hasDetails ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {match.stadium && (
            <div className="bg-surface border border-white/10 p-5">
              <p className="text-xs uppercase tracking-widest text-muted">Campo</p>
              <p className="mt-1 font-bold">{match.stadium}</p>
            </div>
          )}
          {hasScorers && (
            <div className="bg-surface border border-white/10 p-5">
              <p className="text-xs uppercase tracking-widest text-muted mb-3">Marcatori</p>
              {match.scorers?.rsa?.length ? (
                <div className="mb-3">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-accent">RSA TEAM</p>
                  <ul className="mt-1 space-y-0.5 text-sm">
                    {match.scorers.rsa.map((n, i) => <li key={i}>⚽ {n}</li>)}
                  </ul>
                </div>
              ) : null}
              {match.scorers?.opponent?.length ? (
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-muted">{match.opponent}</p>
                  <ul className="mt-1 space-y-0.5 text-sm text-muted">
                    {match.scorers.opponent.map((n, i) => <li key={i}>⚽ {n}</li>)}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : (
        <p className="mt-12 text-center text-sm italic text-muted">
          Campo e marcatori in arrivo.
        </p>
      )}
    </main>
  );
}
