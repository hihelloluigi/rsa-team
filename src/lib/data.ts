import {
  PlayersSchema, MatchesSchema, StandingsSchema, ClubSchema,
  type Player, type Match, type StandingRow, type Club, type MatchResult,
} from "./types";

import playersJson from "@/data/players.json";
import matchesJson from "@/data/matches.json";
import standingsJson from "@/data/standings.json";
import clubJson from "@/data/club.json";

// Validate once at module load — throws at build time on bad data.
const players: Player[] = PlayersSchema.parse(playersJson);
const matches: Match[] = MatchesSchema.parse(matchesJson);
const standings: StandingRow[] = StandingsSchema.parse(standingsJson);
const club: Club = ClubSchema.parse(clubJson);

export function matchResult(m: Match): MatchResult | null {
  if (m.status !== "played" || !m.score) return null;
  if (m.score.rsa > m.score.opponent) return "W";
  if (m.score.rsa < m.score.opponent) return "L";
  return "D";
}

export function getPlayers(): Player[] {
  return [...players].sort((a, b) => a.number - b.number);
}

export function getPlayerBySlug(slug: string): Player | undefined {
  return players.find((p) => p.slug === slug);
}

export function getMatches(): { played: Match[]; upcoming: Match[] } {
  const ms = (s: string) => new Date(s).getTime();
  const played = matches
    .filter((m) => m.status === "played")
    .sort((a, b) => ms(b.date) - ms(a.date));
  const upcoming = matches
    .filter((m) => m.status === "upcoming")
    .sort((a, b) => ms(a.date) - ms(b.date));
  return { played, upcoming };
}

export function getNextMatch(): Match | undefined {
  return getMatches().upcoming[0];
}

export function getLastResult(): Match | undefined {
  return getMatches().played[0];
}

export function getStandings(): StandingRow[] {
  const gd = (r: StandingRow) => r.goalsFor - r.goalsAgainst;
  return [...standings].sort((a, b) => b.points - a.points || gd(b) - gd(a));
}

export function getClub(): Club {
  return club;
}
