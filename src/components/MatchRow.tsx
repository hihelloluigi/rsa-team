import type { Match } from "@/lib/types";
import { matchResult } from "@/lib/data";

const badge: Record<string, string> = {
  W: "bg-accent text-white", D: "bg-white/20 text-white", L: "bg-white/5 text-muted",
};

export default function MatchRow({ match }: { match: Match }) {
  const result = matchResult(match);
  const home = match.home ? "RSA TEAM" : match.opponent;
  const away = match.home ? match.opponent : "RSA TEAM";
  const date = new Date(match.date).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
  return (
    <div className="flex items-center gap-4 py-4 border-b border-white/10">
      <div className="w-24 text-xs text-muted uppercase tracking-widest">{date}</div>
      <div className="flex-1 flex items-center justify-center gap-4 font-bold">
        <span className={match.home ? "text-accent" : ""}>{home}</span>
        {match.score ? (
          <span className="font-display text-xl px-3">{match.score.rsa} : {match.score.opponent}</span>
        ) : (
          <span className="text-muted px-3">vs</span>
        )}
        <span className={!match.home ? "text-accent" : ""}>{away}</span>
      </div>
      <div className="w-16 text-right">
        {result ? (
          <span className={`inline-block w-7 text-center text-xs font-extrabold py-1 ${badge[result]}`}>{result}</span>
        ) : (
          <span className="text-[11px] text-muted uppercase">
            {new Date(match.date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>
    </div>
  );
}
