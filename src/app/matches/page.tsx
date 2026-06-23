import SectionHeading from "@/components/SectionHeading";
import MatchRow from "@/components/MatchRow";
import StandingsTable from "@/components/StandingsTable";
import Reveal from "@/components/Reveal";
import { getMatches, getStandings } from "@/lib/data";
import { GiWhistle, GiSoccerBall, GiTrophyCup } from "react-icons/gi";

export const metadata = { title: "Partite — RSA TEAM" };

export default function MatchesPage() {
  const { played, upcoming } = getMatches();
  const standings = getStandings();

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 space-y-16">
      <section>
        <SectionHeading label="Calendario" title="Prossime" icon={<GiWhistle size={32} />} />
        {upcoming.length ? (
          <div>{upcoming.map((m) => <MatchRow key={m.id} match={m} />)}</div>
        ) : (
          <p className="text-muted">Niente partite in vista. Ci godiamo le ferie.</p>
        )}
      </section>

      <section>
        <SectionHeading label="Risultati" title="Giocate" icon={<GiSoccerBall size={32} />} />
        <div>{played.map((m) => <MatchRow key={m.id} match={m} />)}</div>
      </section>

      <section>
        <SectionHeading label="Classifica" title="La Classifica" icon={<GiTrophyCup size={32} />} />
        <Reveal><StandingsTable rows={standings} /></Reveal>
      </section>
    </main>
  );
}
