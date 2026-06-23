import {
  PlayersSchema, SeasonsSchema, ClubSchema, SponsorsSchema,
  type Player, type Match, type StandingRow, type Season, type Club, type MatchResult, type Position, type Sponsor,
} from "./types";

import playersJson from "@/data/players.json";
import seasonsJson from "@/data/seasons.json";
import clubJson from "@/data/club.json";
import sponsorsJson from "@/data/sponsors.json";

// Italian abbreviations shown on player badges (data keeps the GK/DEF/MID/FWD codes).
export const positionLabels: Record<Position, string> = {
  GK: "POR",
  DEF: "DIF",
  MID: "CEN",
  FWD: "ATT",
};

// Validate once at module load — throws at build time on bad data.
const players: Player[] = PlayersSchema.parse(playersJson);
const seasons: Season[] = SeasonsSchema.parse(seasonsJson);
const club: Club = ClubSchema.parse(clubJson);
const sponsors: Sponsor[] = SponsorsSchema.parse(sponsorsJson);

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

export function getMatch(seasonId: string, matchId: string): { season: Season; match: Match } | undefined {
  const season = getSeasonById(seasonId);
  const match = season?.matches.find((m) => m.id === matchId);
  if (!season || !match) return undefined;
  return { season, match };
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

export function getSponsors(): Sponsor[] {
  return sponsors;
}
