import { describe, it, expect } from "vitest";
import { matchResult } from "./data";
import type { Match } from "./types";

const played = (over: Partial<Match>): Match => ({
  id: "m", opponent: "X", home: true, date: "2026-01-01T20:00:00+00:00",
  competition: "League", status: "played", score: { rsa: 0, opponent: 0 }, ...over,
});

describe("matchResult", () => {
  it("returns W when RSA scores more (home)", () => {
    expect(matchResult(played({ home: true, score: { rsa: 3, opponent: 1 } }))).toBe("W");
  });
  it("returns L when RSA scores fewer (away)", () => {
    expect(matchResult(played({ home: false, score: { rsa: 0, opponent: 2 } }))).toBe("L");
  });
  it("returns D on equal score", () => {
    expect(matchResult(played({ score: { rsa: 1, opponent: 1 } }))).toBe("D");
  });
  it("returns null for upcoming matches", () => {
    expect(matchResult({ ...played({}), status: "upcoming", score: undefined })).toBeNull();
  });
});
