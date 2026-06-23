import Link from "next/link";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import PlayerCard from "@/components/PlayerCard";
import { getClub, getCurrentSeason, getPlayers, getSponsors } from "@/lib/data";
import { GiSoccerBall } from "react-icons/gi";

export default function Home() {
  const club = getClub();
  const season = getCurrentSeason();
  const featured = getPlayers().filter((p) => p.position === "FWD").slice(0, 3);
  const sponsors = getSponsors();

  return (
    <main>
      <Hero tagline={club.tagline} />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading label="La situazione" title="Come stiamo messi" />
        <Reveal>
          <div className="border border-white/10 bg-surface px-6 py-16 text-center">
            <GiSoccerBall className="mx-auto mb-5 text-accent" size={56} />
            <h3 className="font-display italic uppercase text-2xl sm:text-3xl leading-tight">
              «Squadra che non gioca, non perde»
            </h3>
            <p className="mx-auto mt-5 max-w-md text-muted">
              Le partite della stagione {season.label} verranno sorteggiate in settembre.
              Nel frattempo puoi rivederti la scorsa stagione: spoiler, non siamo arrivati ultimi.
            </p>
            <Link
              href="/matches?season=2025-2026"
              className="mt-6 inline-block bg-accent px-6 py-3 text-sm font-extrabold uppercase tracking-widest hover:opacity-90"
            >
              Guarda la 2025/26
            </Link>
          </div>
        </Reveal>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-16">
          <SectionHeading label="La rosa" title="Hot Players"/>
          <div className="grid gap-5 grid-cols-2 sm:grid-cols-3">
            {featured.map((p, i) => (<Reveal key={p.slug} delay={i * 0.08}><PlayerCard player={p} /></Reveal>))}
          </div>
        </section>
      )}

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
    </main>
  );
}
