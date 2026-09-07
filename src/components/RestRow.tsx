import { GiNightSleep } from "react-icons/gi";

const LINE = "Turno di riposo — l'unica giornata in cui non rischiamo di perdere.";

// A giornata the team sits out, shown inline in the calendar so the gap between
// two fixtures reads as a scheduled bye rather than a missing match. Styled
// deliberately quieter than MatchRow — it is context, not an event — but shares
// its stacked/row responsive split so the two line up in the list.
export default function RestRow({ round }: { round: number }) {
  return (
    <div className="border-b border-white/10 py-4 text-muted">
      {/* Mobile: stacked — giornata on top, then the line */}
      <div className="sm:hidden">
        <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-widest">
          <span>{round}ª giornata</span>
          <GiNightSleep size={16} className="text-accent/50" aria-hidden="true" />
        </div>
        <p className="text-sm italic">{LINE}</p>
      </div>

      {/* Desktop: single row, sharing MatchRow's fixed date column */}
      <div className="hidden sm:flex items-center gap-4">
        <div className="w-24 shrink-0 text-xs uppercase tracking-widest">{round}ª giornata</div>
        <GiNightSleep size={18} className="shrink-0 text-accent/50" aria-hidden="true" />
        <p className="text-sm italic">{LINE}</p>
      </div>
    </div>
  );
}
