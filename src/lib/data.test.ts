import { describe, it, expect } from "vitest";
import { matchResult, matchSides, splitMatches, sortStandings } from "./data";
import type { Match, StandingRow } from "./types";

// Builders keep each test focused on the field under test.
const match = (over: Partial<Match> = {}): Match => ({
  id: "m", opponent: "X", home: true, date: "2026-01-01T20:00:00+00:00",
  competition: "League", status: "played", score: { rsa: 0, opponent: 0 }, ...over,
});

const row = (over: Partial<StandingRow> = {}): StandingRow => ({
  team: "T", played: 0, won: 0, drawn: 0, lost: 0,
  goalsFor: 0, goalsAgainst: 0, points: 0, ...over,
});

describe("matchResult", () => {
  it("returns W when RSA scores more", () => {
    expect(matchResult(match({ score: { rsa: 3, opponent: 1 } }))).toBe("W");
  });
  it("returns L when RSA scores fewer", () => {
    expect(matchResult(match({ home: false, score: { rsa: 0, opponent: 2 } }))).toBe("L");
  });
  it("returns D on an equal score", () => {
    expect(matchResult(match({ score: { rsa: 1, opponent: 1 } }))).toBe("D");
  });
  it("returns null for upcoming matches", () => {
    expect(matchResult(match({ status: "upcoming", score: undefined }))).toBeNull();
  });
  it("result is from RSA's perspective regardless of venue (away win)", () => {
    expect(matchResult(match({ home: false, score: { rsa: 4, opponent: 2 } }))).toBe("W");
  });
});

describe("matchSides", () => {
  it("puts RSA on the home side for home matches", () => {
    const s = matchSides(match({ home: true, opponent: "Karpaty", score: { rsa: 2, opponent: 1 } }));
    expect(s).toEqual({ home: "RSA TEAM", away: "Karpaty", homeScore: 2, awayScore: 1 });
  });
  it("puts RSA on the away side for away matches, keeping goals with their side", () => {
    const s = matchSides(match({ home: false, opponent: "Karpaty", score: { rsa: 2, opponent: 1 } }));
    expect(s).toEqual({ home: "Karpaty", away: "RSA TEAM", homeScore: 1, awayScore: 2 });
  });
  it("leaves scores undefined when the match has no score", () => {
    const s = matchSides(match({ status: "upcoming", score: undefined }));
    expect(s.homeScore).toBeUndefined();
    expect(s.awayScore).toBeUndefined();
  });
});

describe("splitMatches", () => {
  const m = (id: string, status: Match["status"], date: string) => match({ id, status, date });

  it("separates played from upcoming by status", () => {
    const { played, upcoming } = splitMatches([
      m("a", "played", "2026-01-01T20:00:00+00:00"),
      m("b", "upcoming", "2026-03-01T20:00:00+00:00"),
    ]);
    expect(played.map((x) => x.id)).toEqual(["a"]);
    expect(upcoming.map((x) => x.id)).toEqual(["b"]);
  });

  it("orders played most-recent-first and upcoming soonest-first", () => {
    const { played, upcoming } = splitMatches([
      m("p-old", "played", "2026-01-01T20:00:00+00:00"),
      m("p-new", "played", "2026-02-01T20:00:00+00:00"),
      m("u-late", "upcoming", "2026-05-01T20:00:00+00:00"),
      m("u-soon", "upcoming", "2026-04-01T20:00:00+00:00"),
    ]);
    expect(played.map((x) => x.id)).toEqual(["p-new", "p-old"]);
    expect(upcoming.map((x) => x.id)).toEqual(["u-soon", "u-late"]);
  });
});

describe("sortStandings", () => {
  it("ranks by points descending", () => {
    const sorted = sortStandings([row({ team: "A", points: 3 }), row({ team: "B", points: 9 })]);
    expect(sorted.map((r) => r.team)).toEqual(["B", "A"]);
  });

  it("breaks point ties by goal difference", () => {
    const sorted = sortStandings([
      row({ team: "A", points: 6, goalsFor: 5, goalsAgainst: 5 }), // GD 0
      row({ team: "B", points: 6, goalsFor: 10, goalsAgainst: 3 }), // GD +7
    ]);
    expect(sorted.map((r) => r.team)).toEqual(["B", "A"]);
  });

  it("does not mutate the input array", () => {
    const input = [row({ team: "A", points: 1 }), row({ team: "B", points: 2 })];
    sortStandings(input);
    expect(input.map((r) => r.team)).toEqual(["A", "B"]);
  });
});
