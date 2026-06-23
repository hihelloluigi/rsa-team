import type { StandingRow } from "@/lib/types";

const cols = ["P", "W", "D", "L", "GF", "GA", "Pts"];

export default function StandingsTable({ rows }: { rows: StandingRow[] }) {
  return (
    <div className="overflow-x-auto border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted text-xs uppercase tracking-widest border-b border-white/10">
            <th className="text-left p-3 w-8">#</th>
            <th className="text-left p-3">Team</th>
            {cols.map((c) => <th key={c} className="p-3 w-12 text-center">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.team} className={`border-b border-white/5 ${r.isRSA ? "bg-accent/15" : ""}`}>
              <td className="p-3 text-muted">{i + 1}</td>
              <td className={`p-3 font-bold ${r.isRSA ? "text-accent" : ""}`}>{r.team}</td>
              <td className="p-3 text-center">{r.played}</td>
              <td className="p-3 text-center">{r.won}</td>
              <td className="p-3 text-center">{r.drawn}</td>
              <td className="p-3 text-center">{r.lost}</td>
              <td className="p-3 text-center">{r.goalsFor}</td>
              <td className="p-3 text-center">{r.goalsAgainst}</td>
              <td className="p-3 text-center font-extrabold">{r.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
