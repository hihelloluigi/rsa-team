import SectionHeading from "@/components/SectionHeading";
import MatchRow from "@/components/MatchRow";
import StandingsTable from "@/components/StandingsTable";
import Reveal from "@/components/Reveal";
import SeasonSelect from "@/components/SeasonSelect";
import EmptyState from "@/components/EmptyState";
import { getSeasons, getCurrentSeason, getSeasonById, splitMatches, sortStandings } from "@/lib/data";
import { GiWhistle, GiTrophyCup } from "react-icons/gi";

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
    <main className="mx-auto max-w-6xl px-5 py-16">
      {/* Season selector */}
      <div className="mb-8 space-y-3">
        <SeasonSelect
          seasons={seasons.map((s) => ({ id: s.id, label: s.label }))}
          selected={selected.id}
        />
        {selected.league && (
          <p className="text-sm text-muted">
            <span className="font-extrabold uppercase tracking-widest text-xs text-accent">Campionato</span>
            {" — "}
            {selected.leagueUrl ? (
              <a
                href={selected.leagueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/20 underline-offset-4 transition hover:text-accent hover:decoration-accent"
              >
                {selected.league} ↗
              </a>
            ) : (
              selected.league
            )}
          </p>
        )}
      </div>

      {!hasMatches ? (
        /* Funny placeholder for a season whose fixtures aren't drawn yet */
        <Reveal>
          <EmptyState
            title="«Squadra che non gioca, non perde»"
            footer={
              <p className="text-xs font-extrabold uppercase tracking-widest text-accent">
                Siamo matti, non veggenti.
              </p>
            }
          >
            Le partite della stagione {selected.label} verranno sorteggiate in settembre.
            Puoi tornare più avanti, noi intanto ci alleniamo. Forse.
          </EmptyState>
        </Reveal>
      ) : (
        <div className="space-y-14">
          {upcoming.length > 0 && (
            <section>
              <SectionHeading label="Calendario" title="Prossime" icon={<GiWhistle size={32} />} />
              <div>
                {upcoming.map((m) => (
                  <MatchRow key={m.id} match={m} href={`/matches/${selected.id}/${m.id}`} />
                ))}
              </div>
            </section>
          )}

          <section>
            <p className="mb-8 border-l-2 border-accent pl-4 text-base sm:text-lg italic text-muted">
              Poteva andare meglio, ma poteva andare anche peggio.
            </p>
            <SectionHeading label="Risultati" title="Giocate" />
            <div>
              {played.map((m) => (
                <MatchRow key={m.id} match={m} href={`/matches/${selected.id}/${m.id}`} />
              ))}
            </div>
          </section>

          {standings.length > 0 && (
            <section>
              <SectionHeading label="Classifica" title="La Classifica" icon={<GiTrophyCup size={32} className="text-white" />} />
              <Reveal>
                <StandingsTable rows={standings} />
              </Reveal>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
