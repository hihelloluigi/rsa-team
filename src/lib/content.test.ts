import { describe, it, expect } from "vitest";
import { PlayersSchema, SeasonsSchema, ClubSchema, SponsorsSchema } from "./types";
import playersJson from "@/data/players.json";
import seasonsJson from "@/data/seasons.json";
import clubJson from "@/data/club.json";
import sponsorsJson from "@/data/sponsors.json";

// Content is hand-edited (see README). These guard the invariants the Zod
// schemas can't express, so a bad edit fails fast in CI rather than in prod.
describe("content data", () => {
  it("all JSON files satisfy their schemas", () => {
    expect(() => PlayersSchema.parse(playersJson)).not.toThrow();
    expect(() => SeasonsSchema.parse(seasonsJson)).not.toThrow();
    expect(() => ClubSchema.parse(clubJson)).not.toThrow();
    expect(() => SponsorsSchema.parse(sponsorsJson)).not.toThrow();
  });

  it("player slugs and shirt numbers are unique", () => {
    const players = PlayersSchema.parse(playersJson);
    const slugs = players.map((p) => p.slug);
    const numbers = players.map((p) => p.number);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it("season ids are unique and at most one season is current", () => {
    const seasons = SeasonsSchema.parse(seasonsJson);
    const ids = seasons.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(seasons.filter((s) => s.current).length).toBeLessThanOrEqual(1);
  });

  it("match ids are unique within each season", () => {
    const seasons = SeasonsSchema.parse(seasonsJson);
    for (const season of seasons) {
      const ids = season.matches.map((m) => m.id);
      expect(new Set(ids).size, `duplicate match id in season ${season.id}`).toBe(ids.length);
    }
  });
});
