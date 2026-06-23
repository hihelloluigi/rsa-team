import { notFound } from "next/navigation";
import Link from "next/link";
import StatBadge from "@/components/StatBadge";
import Reveal from "@/components/Reveal";
import PositionIcon from "@/components/PositionIcon";
import { getPlayers, getPlayerBySlug, positionLabels } from "@/lib/data";

export function generateStaticParams() {
  return getPlayers().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);
  return { title: player ? `${player.name} — RSA TEAM` : "Giocatore — RSA TEAM" };
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default async function PlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);
  if (!player) notFound();

  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <Link href="/squad" className="text-xs uppercase tracking-widest text-muted hover:text-accent">← Torna alla rosa</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="aspect-[3/4] relative flex items-center justify-center bg-gradient-to-br from-accent/30 to-black border border-white/10">
            {player.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={player.photo} alt={player.name} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <span className="font-display text-9xl text-white/80">{initials(player.name)}</span>
            )}
            <span className="absolute bottom-4 left-4 font-display text-7xl text-accent">{player.number}</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-accent flex items-center gap-1.5">
              <PositionIcon position={player.position} size={18} className="text-accent" />
              {positionLabels[player.position]} · #{player.number}
            </p>
            <h1 className="font-display italic uppercase text-5xl sm:text-6xl leading-none mt-2 break-words">{player.nickname ?? player.name}</h1>
            {player.nickname && (
              <p className="mt-2 text-sm uppercase tracking-widest text-muted">{player.name}</p>
            )}
            <dl className="mt-6 grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-muted uppercase tracking-widest text-xs">Nazionalità</dt><dd>{player.nationality}</dd>
              <dt className="text-muted uppercase tracking-widest text-xs">Età</dt><dd>{player.age}</dd>
              <dt className="text-muted uppercase tracking-widest text-xs">Dal</dt><dd>{player.joined}</dd>
            </dl>
            <p className="mt-6 text-muted leading-relaxed">{player.bio}</p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatBadge label="Presenze" value={player.stats.appearances} />
              <StatBadge label="Gol" value={player.stats.goals} />
              <StatBadge label="Assist" value={player.stats.assists} />
              {player.position === "GK"
                ? <StatBadge label="Porte inviolate" value={player.stats.cleanSheets} />
                : <StatBadge label="Migliore in campo" value={player.stats.motm} />}
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
