import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import MatchRow from "@/components/MatchRow";
import StandingsTable from "@/components/StandingsTable";
import PlayerCard from "@/components/PlayerCard";
import { getClub, getNextMatch, getLastResult, getStandings, getPlayers } from "@/lib/data";
import { GiWhistle, GiSoccerBall } from "react-icons/gi";

export default function Home() {
  const club = getClub();
  const next = getNextMatch();
  const last = getLastResult();
  const standings = getStandings().slice(0, 4);
  const featured = getPlayers().filter((p) => p.position === "FWD").slice(0, 3);

  return (
    <main>
      <Hero tagline={club.tagline} />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading label="Season at a glance" title="Where we stand" icon={<GiWhistle size={32} />} />
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-2">
              {last && (<><p className="text-xs uppercase tracking-widest text-muted mb-1">Last result</p><MatchRow match={last} /></>)}
              {next && (<><p className="text-xs uppercase tracking-widest text-muted mt-6 mb-1">Next match</p><MatchRow match={next} /></>)}
            </div>
          </Reveal>
          <Reveal delay={0.1}><StandingsTable rows={standings} /></Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading label="The Squad" title="Star players" icon={<GiSoccerBall size={32} />} />
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3">
          {featured.map((p, i) => (<Reveal key={p.slug} delay={i * 0.08}><PlayerCard player={p} /></Reveal>))}
        </div>
      </section>
    </main>
  );
}
