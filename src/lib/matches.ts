// Pure helpers that compute over a season's matches and standings. Nothing
// here reads content directly — callers pass in what they got from data.ts —
// except the club's own name, which decides which side of a fixture is "us".
import type { Match, MatchResult, StandingRow, Rest } from "./types";
import { getClub } from "./data";

// One entry in a season's calendar: either a fixture or a giornata sat out.
export type Fixture =
  | { kind: "match"; match: Match }
  | { kind: "rest"; round: number };

export function matchResult(m: Match): MatchResult | null {
  if (m.status !== "played" || !m.score) return null;
  if (m.score.rsa > m.score.opponent) return "W";
  if (m.score.rsa < m.score.opponent) return "L";
  return "D";
}

// Resolve a match into home/away sides so each side carries its own goals
// (home goals : away goals), rather than always listing RSA first.
export function matchSides(m: Match): {
  home: string;
  away: string;
  homeScore?: number;
  awayScore?: number;
} {
  const us = getClub().name;
  return {
    home: m.home ? us : m.opponent,
    away: m.home ? m.opponent : us,
    homeScore: m.home ? m.score?.rsa : m.score?.opponent,
    awayScore: m.home ? m.score?.opponent : m.score?.rsa,
  };
}

export function splitMatches(matches: Match[]): { played: Match[]; upcoming: Match[] } {
  const ms = (s: string) => new Date(s).getTime();
  const played = matches
    .filter((m) => m.status === "played")
    .sort((a, b) => ms(b.date) - ms(a.date));
  const upcoming = matches
    .filter((m) => m.status === "upcoming")
    .sort((a, b) => ms(a.date) - ms(b.date));
  return { played, upcoming };
}

export function sortStandings(rows: StandingRow[]): StandingRow[] {
  const gd = (r: StandingRow) => r.goalsFor - r.goalsAgainst;
  return [...rows].sort((a, b) => b.points - a.points || gd(b) - gd(a));
}

// Weaves a season's turni di riposo into a chronologically ascending fixture
// list. A bye carries no date — only the giornata it occupies — so it is placed
// immediately before the first fixture of a later round. Rests left over (or a
// list whose matches carry no round) land at the end rather than being dropped.
export function withRests(matches: Match[], rests: Rest[]): Fixture[] {
  const pending = [...rests].sort((a, b) => a.round - b.round);
  const out: Fixture[] = [];
  for (const match of matches) {
    while (pending.length > 0 && match.round !== undefined && pending[0].round < match.round) {
      out.push({ kind: "rest", round: pending.shift()!.round });
    }
    out.push({ kind: "match", match });
  }
  for (const rest of pending) out.push({ kind: "rest", round: rest.round });
  return out;
}
