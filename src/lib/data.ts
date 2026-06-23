import {
  PlayersSchema, SeasonsSchema, ClubSchema,
  type Player, type Match, type StandingRow, type Season, type Club, type MatchResult,
} from "./types";

import playersJson from "@/data/players.json";
import seasonsJson from "@/data/seasons.json";
import clubJson from "@/data/club.json";

// Validate once at module load — throws at build time on bad data.
const players: Player[] = PlayersSchema.parse(playersJson);
const seasons: Season[] = SeasonsSchema.parse(seasonsJson);
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

export function getSeasons(): Season[] {
  return seasons;
}

export function getCurrentSeason(): Season {
  return seasons.find((s) => s.current) ?? seasons[0];
}

export function getSeasonById(id: string): Season | undefined {
  return seasons.find((s) => s.id === id);
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

export function getClub(): Club {
  return club;
}
