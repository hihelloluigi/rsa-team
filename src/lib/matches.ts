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
  // Anything not played is still ahead of us — a postponed fixture keeps its
  // original slot in the calendar so it reads as "this was meant to be today".
  const upcoming = matches
    .filter((m) => m.status !== "played")
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

// A season's fixtures as one list, the way the league prints them: giornata by
// giornata, played and upcoming together, byes in their place, split into the
// competition's halves. Ordered by round so a recovered match stays in its
// giornata; a season entered without rounds falls back to the date.
export function seasonCalendar(
  matches: Match[],
  rests: Rest[],
): { competition: string; fixtures: Fixture[] }[] {
  const byRound = matches.every((m) => m.round !== undefined);
  const ordered = [...matches].sort((a, b) =>
    byRound ? a.round! - b.round! : new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const fixtures = withRests(ordered, rests);
  const lastRound = Math.max(0, ...fixtures.map((f) => (f.kind === "match" ? f.match.round ?? 0 : f.round)));

  // A bye has no competition of its own. Between two matches of the same half
  // it takes theirs; on the seam between halves, the round decides — a double
  // round-robin gives each half the same number of giornate.
  const competitionOf = (i: number): string => {
    const f = fixtures[i];
    if (f.kind === "match") return f.match.competition;
    const before = fixtures.slice(0, i).findLast((x) => x.kind === "match");
    const after = fixtures.slice(i + 1).find((x) => x.kind === "match");
    if (!before || !after) return (before ?? after)?.match.competition ?? "";
    if (before.match.competition === after.match.competition) return before.match.competition;
    return f.round <= lastRound / 2 ? before.match.competition : after.match.competition;
  };

  const groups: { competition: string; fixtures: Fixture[] }[] = [];
  fixtures.forEach((f, i) => {
    const competition = competitionOf(i);
    const last = groups.at(-1);
    if (last?.competition === competition) last.fixtures.push(f);
    else groups.push({ competition, fixtures: [f] });
  });
  return groups;
}
