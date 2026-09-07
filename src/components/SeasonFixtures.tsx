import SectionHeading from "@/components/SectionHeading";
import MatchRow from "@/components/MatchRow";
import RestRow from "@/components/RestRow";
import StandingsTable from "@/components/StandingsTable";
import Reveal from "@/components/Reveal";
import SeasonSelect from "@/components/SeasonSelect";
import EmptyState from "@/components/EmptyState";
import CalendarSubscribe from "@/components/CalendarSubscribe";
import type { Season } from "@/lib/types";
import { splitMatches, sortStandings, withRests } from "@/lib/matches";
import { GiWhistle, GiTrophyCup } from "react-icons/gi";

// The current season lives at /matches and every other at /matches/<id>, so the
// season people actually visit keeps the short URL and needs no redirect.
export function seasonHref(season: Season): string {
  return season.current ? "/matches" : `/matches/${season.id}`;
}

// One season's calendar, results, table and calendar feed. Rendered by both
// /matches and /matches/[seasonId], which differ only in which season they pick.
export default function SeasonFixtures({
  season,
  seasons,
}: {
  season: Season;
  seasons: Season[];
}) {
  const { played, upcoming } = splitMatches(season.matches);
  // Byes are woven into the calendar only. Once a giornata is behind us the
  // results list is about scores, and a turno di riposo has none.
  const calendar = withRests(upcoming, season.rests);
  const standings = sortStandings(season.standings);

  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="sr-only">Partite, risultati e classifica — RSA TEAM</h1>
      {/* Season selector */}
      <div className="mb-8 space-y-3">
        <SeasonSelect
          seasons={seasons.map((s) => ({ label: s.label, href: seasonHref(s) }))}
          selected={seasonHref(season)}
        />
        {season.league && (
          <p className="text-sm text-muted">
            <span className="font-extrabold uppercase tracking-widest text-xs text-accent">Campionato</span>
            {" — "}
            {season.leagueUrl ? (
              <a
                href={season.leagueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/20 underline-offset-4 transition hover:text-accent hover:decoration-accent"
              >
                {season.league} ↗
              </a>
            ) : (
              season.league
            )}
          </p>
        )}
      </div>

      {season.matches.length === 0 ? (
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
            Le partite della stagione {season.label} verranno sorteggiate in settembre.
            Puoi tornare più avanti, noi intanto ci alleniamo. Forse.
          </EmptyState>
        </Reveal>
      ) : (
        <div className="space-y-14">
          {calendar.length > 0 && (
            <section>
              <SectionHeading label="Calendario" title="Prossime" icon={<GiWhistle size={32} />} />
              <div>
                {calendar.map((f) =>
                  f.kind === "rest" ? (
                    <RestRow key={`rest-${f.round}`} round={f.round} />
                  ) : (
                    <MatchRow
                      key={f.match.id}
                      match={f.match}
                      href={`/matches/${season.id}/${f.match.id}`}
                    />
                  ),
                )}
              </div>
            </section>
          )}

          {/* A season that has only been drawn has no results yet — showing the
              heading over an empty list would read as a bug. */}
          {played.length > 0 && (
            <section>
              <p className="mb-8 border-l-2 border-accent pl-4 text-base sm:text-lg italic text-muted">
                Poteva andare meglio, ma poteva andare anche peggio.
              </p>
              <SectionHeading label="Risultati" title="Giocate" />
              <div>
                {played.map((m) => (
                  <MatchRow key={m.id} match={m} href={`/matches/${season.id}/${m.id}`} />
                ))}
              </div>
            </section>
          )}

          {standings.length > 0 && (
            <section>
              <SectionHeading label="Classifica" title="La Classifica" icon={<GiTrophyCup size={32} className="text-white" />} />
              <Reveal>
                <StandingsTable rows={standings} />
              </Reveal>
            </section>
          )}

          <Reveal>
            <CalendarSubscribe season={{ id: season.id, label: season.label }} />
          </Reveal>
        </div>
      )}
    </main>
  );
}
