import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import MatchRow from "@/components/MatchRow";
import StandingsTable from "@/components/StandingsTable";
import Reveal from "@/components/Reveal";
import { getSeasons, getCurrentSeason, getSeasonById, splitMatches, sortStandings } from "@/lib/data";
import { GiWhistle, GiSoccerBall, GiTrophyCup } from "react-icons/gi";

export const metadata = { title: "Partite — RSA TEAM" };

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ season?: string }>;
}) {
  const { season } = await searchParams;
  const seasons = getSeasons();
  const selected = (season && getSeasonById(season)) || getCurrentSeason();
  const { played, upcoming } = splitMatches(selected.matches);
  const standings = sortStandings(selected.standings);
  const hasMatches = selected.matches.length > 0;

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 space-y-12">
      {/* Season selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-extrabold uppercase tracking-widest text-muted">
          Stagione
        </span>
        {seasons.map((s) => {
          const active = s.id === selected.id;
          return (
            <Link
              key={s.id}
              href={`/matches?season=${s.id}`}
              aria-current={active ? "page" : undefined}
              className={`px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest transition ${
                active ? "bg-accent text-white" : "bg-surface text-muted hover:text-fg"
              }`}
            >
              {s.label}
            </Link>
          );
        })}
      </div>

      {!hasMatches ? (
        /* Funny placeholder for a season whose fixtures aren't drawn yet */
        <Reveal>
          <div className="border border-white/10 bg-surface px-6 py-20 text-center">
            <GiSoccerBall className="mx-auto mb-5 text-accent" size={56} />
            <h2 className="font-display italic uppercase text-3xl sm:text-4xl leading-tight">
              Il calendario sta ancora dormendo
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted">
              Le partite della stagione {selected.label} verranno sorteggiate in settembre.
              Puoi tornare più avanti, noi intanto ci alleniamo. Forse.
            </p>
            <p className="mt-4 text-xs font-extrabold uppercase tracking-widest text-accent">
              Siamo matti, non veggenti.
            </p>
          </div>
        </Reveal>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section>
              <SectionHeading label="Calendario" title="Prossime" icon={<GiWhistle size={32} />} />
              <div>
                {upcoming.map((m) => (
                  <MatchRow key={m.id} match={m} />
                ))}
              </div>
            </section>
          )}

          <section>
            <SectionHeading label="Risultati" title="Giocate" icon={<GiSoccerBall size={32} />} />
            <div>
              {played.map((m) => (
                <MatchRow key={m.id} match={m} />
              ))}
            </div>
          </section>

          {standings.length > 0 && (
            <section>
              <SectionHeading label="Classifica" title="La Classifica" icon={<GiTrophyCup size={32} />} />
              <Reveal>
                <StandingsTable rows={standings} />
              </Reveal>
            </section>
          )}
        </>
      )}
    </main>
  );
}
