import SectionHeading from "@/components/SectionHeading";
import PlayerCard from "@/components/PlayerCard";
import Reveal from "@/components/Reveal";
import { getPlayers } from "@/lib/data";
import type { Position } from "@/lib/types";
import { GiSoccerField } from "react-icons/gi";

export const metadata = { title: "Squadra — RSA TEAM" };

const groups: { key: Position; label: string }[] = [
  { key: "GK", label: "Portieri" },
  { key: "DEF", label: "Difensori" },
  { key: "MID", label: "Centrocampisti" },
  { key: "FWD", label: "Attaccanti" },
];

export default function SquadPage() {
  const players = getPlayers();
  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <SectionHeading label="2025/26" title="La Rosa" icon={<GiSoccerField size={32} />} />
      {groups.map((g) => {
        const list = players.filter((p) => p.position === g.key);
        if (list.length === 0) return null;
        return (
          <section key={g.key} className="mb-14">
            <h3 className="text-sm font-extrabold uppercase tracking-[0.2em] text-muted mb-5">{g.label}</h3>
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {list.map((p, i) => (<Reveal key={p.slug} delay={i * 0.05}><PlayerCard player={p} /></Reveal>))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
