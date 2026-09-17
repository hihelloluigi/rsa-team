import SectionHeading from "@/components/SectionHeading";
import PlayerCard from "@/components/PlayerCard";
import Reveal from "@/components/Reveal";
import { getCurrentSeason, getPlayers } from "@/lib/data";
import type { Position } from "@/lib/types";
import { pageAlternates } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

export async function generateMetadata() {
  const { t, lang } = await getI18n();
  return {
    title: t.squad.metaTitle,
    description: t.squad.metaDescription,
    alternates: pageAlternates(lang, "/squad"),
  };
}

const GROUPS: Position[] = ["GK", "DEF", "MID", "FWD"];

export default async function SquadPage() {
  const { t } = await getI18n();
  const players = getPlayers();
  const season = getCurrentSeason();
  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <SectionHeading as="h1" label={season.label} title={t.squad.title} />
      {GROUPS.map((key) => {
        const list = players.filter((p) => p.position === key);
        if (list.length === 0) return null;
        return (
          <section key={key} className="mb-14">
            <h3 className="text-sm font-extrabold uppercase tracking-subhead text-muted mb-5">{t.positions.plural[key]}</h3>
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {list.map((p, i) => (<Reveal key={p.slug} delay={i * 0.05}><PlayerCard player={p} /></Reveal>))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
