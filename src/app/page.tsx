import ButtonLink from "@/components/ButtonLink";
import Hero from "@/components/Hero";
import InstagramFeed from "@/components/InstagramFeed";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import PlayerCard from "@/components/PlayerCard";
import EmptyState from "@/components/EmptyState";
import MatchRow from "@/components/MatchRow";
import NextMatch from "@/components/NextMatch";
import ShirtViewer from "@/components/ShirtViewer";
import { getClub, getCurrentSeason, getPlayers, getSponsors } from "@/lib/data";
import { splitMatches } from "@/lib/matches";
import Eyebrow from "@/components/Eyebrow";

export default function Home() {
  const club = getClub();
  const season = getCurrentSeason();
  const featured = getPlayers().filter((p) => p.position === "FWD").slice(0, 3);
  const sponsors = getSponsors();
  // splitMatches gives played newest-first and upcoming soonest-first, so the
  // head of each list is exactly what this section wants.
  const { played, upcoming } = splitMatches(season.matches);
  const [next, ...later] = upcoming;
  const lastResult = played[0];

  return (
    <main>
      <Hero tagline={club.tagline} />

      {club.instagram && <InstagramFeed profileUrl={club.instagram} />}

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading label="La situazione" title="Come stiamo messi" anchor="situazione" />
        <Reveal>
          {season.matches.length === 0 ? (
            /* A season whose fixtures haven't been drawn yet. */
            <EmptyState
              as="h3"
              title="«Squadra che non gioca, non perde»"
              footer={
                <ButtonLink href="/matches">Guarda le stagioni passate</ButtonLink>
              }
            >
              Il calendario della stagione {season.label} non è ancora uscito.
              Nel frattempo puoi rivederti la scorsa stagione: spoiler, non siamo arrivati ultimi.
            </EmptyState>
          ) : (
            <div className="border border-white/10 bg-surface">
              {lastResult && (
                <div className="px-5 pt-5">
                  <Eyebrow tone="muted">Ultimo risultato</Eyebrow>
                  <MatchRow
                    match={lastResult}
                    href={`/matches/${season.id}/${lastResult.id}`}
                  />
                </div>
              )}

              {next ? (
                <NextMatch match={next} href={`/matches/${season.id}/${next.id}`} />
              ) : (
                <p className="px-5 py-10 text-center font-display italic uppercase text-2xl sm:text-3xl">
                  Stagione finita. Ci vediamo al prossimo sorteggio.
                </p>
              )}

              {later.length > 0 && (
                <div className="border-t border-white/10 px-5 pt-5">
                  <Eyebrow tone="muted">Poi tocca a</Eyebrow>
                  {later.slice(0, 2).map((m) => (
                    <MatchRow key={m.id} match={m} href={`/matches/${season.id}/${m.id}`} />
                  ))}
                </div>
              )}

              {/* The fixture rows above already end in a border; only draw one
                  here when nothing precedes this. */}
              <div
                className={`px-5 py-5 text-center ${later.length > 0 ? "" : "border-t border-white/10"}`}
              >
                <ButtonLink href="/matches">Tutte le partite</ButtonLink>
              </div>
            </div>
          )}
        </Reveal>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <SectionHeading label="La maglia" title="Vestiti da squadra vera" anchor="maglia" />
          <Reveal>
            <div className="border border-white/10 bg-surface">
              <ShirtViewer />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <SectionHeading label="Chi ci sostiene" title="Sponsor" />
          {sponsors.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {sponsors.map((s, i) => {
                const inner = s.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.logo} alt={s.name} className="max-h-16 w-auto object-contain" />
                ) : (
                  <span className="text-center font-display italic uppercase text-lg text-muted">{s.name}</span>
                );
                const cls = "flex h-28 items-center justify-center border border-white/10 bg-surface p-6 transition hover:border-accent";
                return s.url ? (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                ) : (
                  <div key={i} className={cls}>{inner}</div>
                );
              })}
            </div>
          ) : (
            <Reveal>
              <div className="border border-dashed border-white/20 bg-surface px-6 py-14 text-center">
                <p className="font-display italic uppercase text-2xl sm:text-3xl">Questo spazio può essere tuo</p>
                <p className="mx-auto mt-3 max-w-md text-muted">
                  Vuoi sostenere l&apos;RSA TEAM? Diventa nostro sponsor: il tuo logo qui, sotto gli occhi di tutti (anche di chi non corre).
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <SectionHeading label="La rosa" title="Hot Players" />
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3">
              {featured.map((p, i) => (<Reveal key={p.slug} delay={i * 0.08}><PlayerCard player={p} /></Reveal>))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
