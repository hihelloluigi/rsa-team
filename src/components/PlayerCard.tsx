import Link from "next/link";
import type { Player } from "@/lib/types";
import PositionIcon from "@/components/PositionIcon";
import PlayerPortrait from "@/components/PlayerPortrait";
import { positionLabels } from "@/lib/format";

export default function PlayerCard({ player }: { player: Player }) {
  return (
    <Link
      href={`/squad/${player.slug}`}
      className="group relative block overflow-hidden bg-surface border border-white/10 hover:border-accent transition"
    >
      <PlayerPortrait
        player={player}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/80 to-transparent" />
        <span className="absolute top-3 left-3 font-display text-3xl text-white drop-shadow-lg">{player.number}</span>
        <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest bg-accent px-2 py-1">
          <PositionIcon position={player.position} size={10} />
          {positionLabels[player.position]}
        </span>
      </PlayerPortrait>
      <div className="p-4">
        <div className="font-extrabold uppercase tracking-wide group-hover:text-accent transition truncate">
          {player.nickname ?? player.name}
        </div>
        {/* Reserved even without a nickname so cards in a row stay the same
            height. min-h matches the text-xs line box; the previous non-breaking
            space did the same job but said so nowhere. */}
        <div className="text-xs text-muted mt-0.5 min-h-4 truncate">
          {player.nickname ? player.name : null}
        </div>
      </div>
    </Link>
  );
}
