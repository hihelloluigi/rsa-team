import Link from "next/link";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import PlayerCard from "@/components/PlayerCard";
import { getClub, getCurrentSeason, getPlayers } from "@/lib/data";
import { GiWhistle, GiSoccerBall } from "react-icons/gi";

export default function Home() {
  const club = getClub();
  const season = getCurrentSeason();
  const featured = getPlayers().filter((p) => p.position === "FWD").slice(0, 3);

  return (
    <main>
      <Hero tagline={club.tagline} />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading label="La situazione" title="Come stiamo messi" icon={<GiWhistle size={32} />} />
        <Reveal>
          <div className="border border-white/10 bg-surface px-6 py-16 text-center">
            <GiSoccerBall className="mx-auto mb-5 text-accent" size={56} />
            <h3 className="font-display italic uppercase text-2xl sm:text-3xl leading-tight">
              Il calendario sta ancora dormendo
            </h3>
            <p className="mx-auto mt-4 max-w-md text-muted">
              Le partite della stagione {season.label} vengono sorteggiate il mese prossimo.
              Nel frattempo puoi rivederti la scorsa stagione: spoiler, andò bene.
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

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading label="La rosa" title="I fenomeni" icon={<GiSoccerBall size={32} />} />
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3">
          {featured.map((p, i) => (<Reveal key={p.slug} delay={i * 0.08}><PlayerCard player={p} /></Reveal>))}
        </div>
      </section>
    </main>
  );
}
