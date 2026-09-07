import { describe, it, expect } from "vitest";
import { PlayersSchema, SeasonsSchema, ClubSchema, SponsorsSchema, VenuesSchema } from "./types";
import playersJson from "@/data/players.json";
import seasonsJson from "@/data/seasons.json";
import clubJson from "@/data/club.json";
import sponsorsJson from "@/data/sponsors.json";
import venuesJson from "@/data/venues.json";

// Content is hand-edited (see README). These guard the invariants the Zod
// schemas can't express, so a bad edit fails fast in CI rather than in prod.
describe("content data", () => {
  it("all JSON files satisfy their schemas", () => {
    expect(() => PlayersSchema.parse(playersJson)).not.toThrow();
    expect(() => SeasonsSchema.parse(seasonsJson)).not.toThrow();
    expect(() => ClubSchema.parse(clubJson)).not.toThrow();
    expect(() => SponsorsSchema.parse(sponsorsJson)).not.toThrow();
    expect(() => VenuesSchema.parse(venuesJson)).not.toThrow();
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

  // Venues are keyed by the exact `stadium` string a match uses, so a typo on
  // either side silently drops the directions rather than erroring. A venue
  // matching no fixture is the detectable half of that.
  it("every venue is actually used by a fixture", () => {
    const seasons = SeasonsSchema.parse(seasonsJson);
    const played = new Set(seasons.flatMap((s) => s.matches.map((m) => m.stadium)));
    for (const stadium of Object.keys(VenuesSchema.parse(venuesJson))) {
      expect(played.has(stadium), `no fixture is at "${stadium}" — check the spelling`).toBe(true);
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

  // We only hold RSA's fixtures, so no other team's row can be *computed* — but
  // the whole table still has to satisfy arithmetic that holds in any league,
  // which catches a typo in any row without knowing anyone else's results.
  describe("standings arithmetic", () => {
    const tables = SeasonsSchema.parse(seasonsJson).filter((s) => s.standings.length > 0);
    const sum = (rows: { [k: string]: unknown }[], key: string) =>
      rows.reduce((n, r) => n + (r[key] as number), 0);

    it("gives every team played = won + drawn + lost", () => {
      for (const season of tables) {
        for (const r of season.standings) {
          expect(r.played, `${r.team} in ${season.id}`).toBe(r.won + r.drawn + r.lost);
        }
      }
    });

    it("gives every team points = 3 x won + drawn", () => {
      for (const season of tables) {
        for (const r of season.standings) {
          expect(r.points, `${r.team} in ${season.id}`).toBe(r.won * 3 + r.drawn);
        }
      }
    });

    // Every goal is scored by one team and conceded by another, so across a
    // whole girone the two columns must come to the same total.
    it("balances goals scored against goals conceded", () => {
      for (const season of tables) {
        expect(sum(season.standings, "goalsFor"), season.id).toBe(
          sum(season.standings, "goalsAgainst"),
        );
      }
    });

    // Likewise every decisive match makes one winner and one loser, and a draw
    // is shared by two teams.
    it("balances wins against losses, and pairs up draws and matches", () => {
      for (const season of tables) {
        expect(sum(season.standings, "won"), season.id).toBe(sum(season.standings, "lost"));
        expect(sum(season.standings, "drawn") % 2, season.id).toBe(0);
        expect(sum(season.standings, "played") % 2, season.id).toBe(0);
      }
    });
  });

  // RSA's own row is the one we *can* derive, and it is the one that goes stale:
  // editing a fixture's score does not recompute the table (see CLAUDE.md).
  it("matches RSA's standings row to RSA's own results", () => {
    for (const season of SeasonsSchema.parse(seasonsJson)) {
      const row = season.standings.find((r) => r.isRSA);
      if (!row) continue;
      const played = season.matches.filter((m) => m.status === "played" && m.score);
      const tally = { played: played.length, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 };
      for (const m of played) {
        const { rsa, opponent } = m.score!;
        tally.goalsFor += rsa;
        tally.goalsAgainst += opponent;
        if (rsa > opponent) tally.won += 1;
        else if (rsa < opponent) tally.lost += 1;
        else tally.drawn += 1;
      }
      expect(
        { ...tally, points: tally.won * 3 + tally.drawn },
        `season ${season.id}: the table disagrees with the fixtures — update both`,
      ).toEqual({
        played: row.played, won: row.won, drawn: row.drawn, lost: row.lost,
        goalsFor: row.goalsFor, goalsAgainst: row.goalsAgainst, points: row.points,
      });
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
