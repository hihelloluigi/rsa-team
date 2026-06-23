import SectionHeading from "@/components/SectionHeading";
import MatchRow from "@/components/MatchRow";
import StandingsTable from "@/components/StandingsTable";
import Reveal from "@/components/Reveal";
import { getMatches, getStandings } from "@/lib/data";
import { GiWhistle, GiSoccerBall, GiTrophyCup } from "react-icons/gi";

export const metadata = { title: "Matches — RSA TEAM" };

export default function MatchesPage() {
  const { played, upcoming } = getMatches();
  const standings = getStandings();

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 space-y-16">
      <section>
        <SectionHeading label="Fixtures" title="Upcoming" icon={<GiWhistle size={32} />} />
        {upcoming.length ? (
          <div>{upcoming.map((m) => <MatchRow key={m.id} match={m} />)}</div>
        ) : (
          <p className="text-muted">No upcoming matches — season complete.</p>
        )}
      </section>

      <section>
        <SectionHeading label="Results" title="Played" icon={<GiSoccerBall size={32} />} />
        <div>{played.map((m) => <MatchRow key={m.id} match={m} />)}</div>
      </section>

      <section>
        <SectionHeading label="League" title="Standings" icon={<GiTrophyCup size={32} />} />
        <Reveal><StandingsTable rows={standings} /></Reveal>
      </section>
    </main>
  );
}
