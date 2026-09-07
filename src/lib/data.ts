import {
  PlayersSchema, SeasonsSchema, ClubSchema, SponsorsSchema, VenuesSchema,
  type Player, type Match, type Season, type Club, type Sponsor, type Venue,
} from "./types";

import playersJson from "@/data/players.json";
import seasonsJson from "@/data/seasons.json";
import clubJson from "@/data/club.json";
import sponsorsJson from "@/data/sponsors.json";
import venuesJson from "@/data/venues.json";

// Content access. Every JSON file is validated once at module load, so bad
// data throws at build time rather than rendering a broken page. Helpers that
// compute over this content live in matches.ts.
const players: Player[] = PlayersSchema.parse(playersJson);
const seasons: Season[] = SeasonsSchema.parse(seasonsJson);
const club: Club = ClubSchema.parse(clubJson);
const sponsors: Sponsor[] = SponsorsSchema.parse(sponsorsJson);
const venues: Record<string, Venue> = VenuesSchema.parse(venuesJson);

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

export function getClub(): Club {
  return club;
}

export function getSponsors(): Sponsor[] {
  return sponsors;
}

// Undefined for a ground nobody has looked up yet — every caller degrades to
// showing the venue's name alone.
export function getVenue(stadium: string | undefined): Venue | undefined {
  return stadium ? venues[stadium] : undefined;
}

export function getVenues(): Record<string, Venue> {
  return venues;
}
