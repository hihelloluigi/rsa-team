import Image from "next/image";
import type { ReactNode } from "react";
import type { Player } from "@/lib/types";
import { initials } from "@/lib/format";

// The 3:4 brand-gradient frame both player views use, holding the photo or an
// initials fallback. What sits *over* it genuinely differs between the squad
// card and the player page — scrim direction, number placement, position badge
// — so those stay at the call site as children rather than becoming props.
// The initials are sized in container-query units so they scale with the frame
// instead of needing a size prop.
export default function PlayerPortrait({
  player,
  sizes,
  priority = false,
  className = "",
  children,
}: {
  player: Player;
  // next/image `sizes`: the two call sites lay out at very different widths.
  sizes: string;
  priority?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`@container aspect-[3/4] relative flex items-center justify-center bg-gradient-to-br from-accent/30 to-black ${className}`.trimEnd()}
    >
      {player.photo ? (
        <Image
          src={player.photo}
          alt={player.name}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <span className="font-display text-[28cqw] leading-none text-white/80">
          {initials(player.name)}
        </span>
      )}
      {children}
    </div>
  );
}
