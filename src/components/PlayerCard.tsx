import Link from "next/link";
import Image from "next/image";
import type { Player } from "@/lib/types";
import PositionIcon from "@/components/PositionIcon";
import { positionLabels } from "@/lib/data";
import { initials } from "@/lib/format";

export default function PlayerCard({ player }: { player: Player }) {
  return (
    <Link
      href={`/squad/${player.slug}`}
      className="group relative block overflow-hidden bg-surface border border-white/10 hover:border-accent transition"
    >
      <div className="aspect-[3/4] relative flex items-center justify-center bg-gradient-to-br from-accent/30 to-black">
        {player.photo ? (
          <Image
            src={player.photo}
            alt={player.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        ) : (
          <span className="font-display text-6xl text-white/80">{initials(player.name)}</span>
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/80 to-transparent" />
        <span className="absolute top-3 left-3 font-display text-3xl text-white drop-shadow-lg">{player.number}</span>
        <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest bg-accent px-2 py-1">
          <PositionIcon position={player.position} size={10} />
          {positionLabels[player.position]}
        </span>
      </div>
      <div className="p-4">
        <div className="font-extrabold uppercase tracking-wide group-hover:text-accent transition truncate">
          {player.nickname ?? player.name}
        </div>
        <div className="text-xs text-muted mt-0.5 truncate">
          {player.nickname ? player.name : " "}
        </div>
      </div>
    </Link>
  );
}
