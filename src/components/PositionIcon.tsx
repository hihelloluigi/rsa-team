import type { Position } from "@/lib/types";
import { GiGoalKeeper, GiShield, GiRunningShoe, GiSoccerKick } from "react-icons/gi";
import type { IconType } from "react-icons";

const positionMap: Record<Position, IconType> = {
  GK: GiGoalKeeper,
  DEF: GiShield,
  MID: GiRunningShoe,
  FWD: GiSoccerKick,
};

export default function PositionIcon({
  position,
  className,
  size = 16,
}: {
  position: Position;
  className?: string;
  size?: number;
}) {
  const Icon = positionMap[position];
  return <Icon size={size} className={className} aria-hidden="true" />;
}
