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

  // A giornata is either played or sat out, never both — and never twice.
  it("giornate are unique across a season's matches and byes", () => {
    const seasons = SeasonsSchema.parse(seasonsJson);
    for (const season of seasons) {
      const rounds = season.matches.flatMap((m) => (m.round === undefined ? [] : [m.round]));
      const rests = season.rests.map((r) => r.round);
      const all = [...rounds, ...rests];
      expect(new Set(all).size, `giornata listed twice in season ${season.id}`).toBe(all.length);
    }
  });

  // Each opponent is met home and away, so a missing or duplicated fixture in a
  // hand-entered calendar shows up here rather than as a wrong-looking table.
  it("a season with byes is a complete double round-robin", () => {
    const seasons = SeasonsSchema.parse(seasonsJson).filter((s) => s.rests.length > 0);
    for (const season of seasons) {
      for (const opponent of new Set(season.matches.map((m) => m.opponent))) {
        const sides = season.matches.filter((m) => m.opponent === opponent).map((m) => m.home);
        expect([...sides].sort(), `${opponent} in season ${season.id}`).toEqual([false, true]);
      }
    }
  });

  // The classifica is maintained by hand alongside the fixtures (see CLAUDE.md),
  // so it drifts silently unless the two are checked against each other.
  it("every opponent a season plays also appears in its standings", () => {
    const seasons = SeasonsSchema.parse(seasonsJson).filter((s) => s.standings.length > 0);
    for (const season of seasons) {
      const table = new Set(season.standings.map((r) => r.team));
      for (const opponent of new Set(season.matches.map((m) => m.opponent))) {
        expect(table.has(opponent), `${opponent} missing from ${season.id} standings`).toBe(true);
      }
    }
  });
});
