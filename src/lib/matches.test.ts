import { describe, it, expect } from "vitest";
import { matchResult, matchSides, seasonCalendar, splitMatches, sortStandings, withRests } from "./matches";
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

describe("splitMatches with a postponed fixture", () => {
  // A postponed match is not a result, so it must not fall out of both lists.
  const fixtures = [
    match({ id: "a", status: "played", date: "2026-01-01T12:00:00+00:00" }),
    match({ id: "b", status: "postponed", score: undefined, date: "2026-02-01T12:00:00+00:00" }),
    match({ id: "c", status: "upcoming", score: undefined, date: "2026-03-01T12:00:00+00:00" }),
  ];
  it("keeps it among the upcoming fixtures", () => {
    expect(splitMatches(fixtures).upcoming.map((m) => m.id)).toEqual(["b", "c"]);
  });
  it("keeps it out of the results", () => {
    expect(splitMatches(fixtures).played.map((m) => m.id)).toEqual(["a"]);
  });
  it("has no result of its own", () => {
    expect(matchResult(fixtures[1])).toBeNull();
  });
});

describe("withRests", () => {
  const m = (round: number) => match({ id: `m${round}`, round });
  const kinds = (f: ReturnType<typeof withRests>) =>
    f.map((x) => (x.kind === "match" ? x.match.round : `rest${x.round}`));

  it("places a bye before the first fixture of a later giornata", () => {
    expect(kinds(withRests([m(3), m(5)], [{ round: 4 }]))).toEqual([3, "rest4", 5]);
  });
  it("handles several byes, in round order, however they are listed", () => {
    expect(kinds(withRests([m(3), m(5), m(16)], [{ round: 15 }, { round: 4 }])))
      .toEqual([3, "rest4", 5, "rest15", 16]);
  });
  it("appends a trailing bye that no later fixture follows", () => {
    expect(kinds(withRests([m(1)], [{ round: 2 }]))).toEqual([1, "rest2"]);
  });
  it("keeps byes rather than dropping them when matches carry no round", () => {
    expect(kinds(withRests([match({ id: "x" })], [{ round: 4 }]))).toEqual([undefined, "rest4"]);
  });
  it("is a plain passthrough when a season has no byes", () => {
    expect(kinds(withRests([m(1), m(2)], []))).toEqual([1, 2]);
  });
});

describe("seasonCalendar", () => {
  const m = (round: number, competition: string, date: string) =>
    match({ id: `m${round}`, round, competition, date: `${date}T12:00:00+00:00` });
  const shape = (groups: ReturnType<typeof seasonCalendar>) =>
    groups.map((g) => [
      g.competition,
      g.fixtures.map((f) => (f.kind === "match" ? f.match.id : `rest${f.round}`)),
    ]);

  it("lists played and upcoming together, in giornata order, grouped by competition", () => {
    const groups = seasonCalendar(
      [m(13, "Ritorno", "2027-02-12"), m(1, "Andata", "2026-09-25"), m(12, "Ritorno", "2027-02-05")],
      [],
    );
    expect(shape(groups)).toEqual([
      ["Andata", ["m1"]],
      ["Ritorno", ["m12", "m13"]],
    ]);
  });
  it("keeps a recovered match in its giornata, not on the day it was replayed", () => {
    const groups = seasonCalendar([m(2, "Andata", "2026-12-20"), m(3, "Andata", "2026-10-05")], []);
    expect(shape(groups)).toEqual([["Andata", ["m2", "m3"]]]);
  });
  it("weaves byes into their half of the season", () => {
    const groups = seasonCalendar(
      [m(3, "Andata", "2026-10-05"), m(5, "Andata", "2026-10-19"), m(16, "Ritorno", "2027-03-01")],
      [{ round: 15 }, { round: 4 }],
    );
    expect(shape(groups)).toEqual([
      ["Andata", ["m3", "rest4", "m5"]],
      ["Ritorno", ["rest15", "m16"]],
    ]);
  });
  it("settles a bye between the halves by the round it falls in", () => {
    // 22 giornate: a bye in 11 closes the andata, a bye in 12 opens the ritorno.
    const around = (bye: number) =>
      shape(seasonCalendar([m(10, "Andata", "2026-11-27"), m(13, "Ritorno", "2027-02-12"), m(22, "Ritorno", "2027-04-16")], [{ round: bye }]));
    expect(around(11)[0]).toEqual(["Andata", ["m10", "rest11"]]);
    expect(around(12)[1]).toEqual(["Ritorno", ["rest12", "m13", "m22"]]);
  });
  it("falls back to date order when the season was entered without rounds", () => {
    const groups = seasonCalendar(
      [
        match({ id: "late", date: "2026-03-01T12:00:00+00:00" }),
        match({ id: "early", date: "2025-10-01T12:00:00+00:00" }),
      ],
      [],
    );
    expect(shape(groups)).toEqual([["League", ["early", "late"]]]);
  });
});
