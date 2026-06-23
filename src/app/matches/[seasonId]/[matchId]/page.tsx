import Link from "next/link";
import { notFound } from "next/navigation";
import { GiSoccerField, GiSoccerBall } from "react-icons/gi";
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

function ScorerList({ names, align }: { names: string[]; align: "left" | "right" }) {
  if (names.length === 0) {
    return <li className="text-xs text-muted">Nessun gol</li>;
  }
  return (
    <>
      {names.map((n, i) => (
        <li
          key={i}
          className={`flex items-center gap-2 ${align === "right" ? "flex-row-reverse text-right" : ""}`}
        >
          <GiSoccerBall size={11} className="shrink-0 text-accent/70" aria-hidden="true" />
          <span>{n}</span>
        </li>
      ))}
    </>
  );
}

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

  const rsaScorers = match.scorers?.rsa ?? [];
  const oppScorers = match.scorers?.opponent ?? [];
  const homeScorers = match.home ? rsaScorers : oppScorers;
  const awayScorers = match.home ? oppScorers : rsaScorers;

  const hasScorers = rsaScorers.length > 0 || oppScorers.length > 0;
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
        <p className="mt-2 text-sm text-muted">
          <span className="capitalize">{dateStr}</span>
          {match.kickoff && <span> · ore {match.kickoff}</span>}
        </p>
        {match.note && (
          <p className="mx-auto mt-4 max-w-md border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-accent">
            {match.note}
          </p>
        )}
      </div>

      {hasDetails ? (
        <>
          {/* Marcatori — head to head, mirroring the scoreline sides */}
          {hasScorers && (
            <section className="mt-12">
              <h2 className="mb-5 flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-[0.3em] text-accent">
                <GiSoccerBall size={15} aria-hidden="true" /> Marcatori
              </h2>
              <div className="grid grid-cols-2 border border-white/10">
                <div className="border-r border-white/10 p-5">
                  <p className={`mb-3 text-xs font-extrabold uppercase tracking-widest ${match.home ? "text-accent" : "text-muted"}`}>
                    {home}
                  </p>
                  <ul className="space-y-2 text-sm">
                    <ScorerList names={homeScorers} align="left" />
                  </ul>
                </div>
                <div className="p-5">
                  <p className={`mb-3 text-right text-xs font-extrabold uppercase tracking-widest ${!match.home ? "text-accent" : "text-muted"}`}>
                    {away}
                  </p>
                  <ul className="space-y-2 text-sm">
                    <ScorerList names={awayScorers} align="right" />
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* Il Campo — venue with a pitch graphic */}
          {match.stadium && (
            <section className="mt-12">
              <h2 className="mb-5 flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-[0.3em] text-accent">
                <GiSoccerField size={15} aria-hidden="true" /> Il Campo
              </h2>
              <div className="overflow-hidden border border-white/10 bg-surface">
                <div className="bg-gradient-to-br from-accent/10 to-black px-6 py-6">
                  <svg
                    viewBox="0 0 300 180"
                    className="mx-auto w-full max-w-[18rem] text-white/25"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <rect x="4" y="4" width="292" height="172" rx="2" />
                    <line x1="150" y1="4" x2="150" y2="176" />
                    <circle cx="150" cy="90" r="26" />
                    <circle cx="150" cy="90" r="2.5" className="fill-accent stroke-none" />
                    <rect x="4" y="50" width="42" height="80" />
                    <rect x="254" y="50" width="42" height="80" />
                    <rect x="4" y="72" width="16" height="36" />
                    <rect x="280" y="72" width="16" height="36" />
                  </svg>
                </div>
                <div className="border-t border-white/10 px-5 py-4 text-center">
                  <p className="font-bold">{match.stadium}</p>
                  {match.kickoff && (
                    <p className="mt-0.5 text-sm text-muted">Calcio d&apos;inizio · ore {match.kickoff}</p>
                  )}
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        <p className="mt-12 text-center text-sm italic text-muted">Campo e marcatori in arrivo.</p>
      )}
    </main>
  );
}
