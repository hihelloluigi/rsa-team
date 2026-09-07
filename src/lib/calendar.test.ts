import { describe, it, expect } from "vitest";
import { matchStart, seasonCalendar } from "./calendar";
import type { Match, Season } from "./types";

const match = (over: Partial<Match> = {}): Match => ({
  id: "m01", opponent: "Karpaty", home: true, date: "2026-09-25T12:00:00+00:00",
  competition: "Andata", status: "upcoming", kickoff: "20:00", ...over,
});

const season = (matches: Match[]): Season => ({
  id: "2026-2027", label: "2026/27", matches, rests: [], standings: [],
});

const lines = (ics: string) => ics.split("\r\n");

describe("matchStart", () => {
  // The whole point of the feed: `date` carries only the day and `kickoff` only
  // the hour, so the instant has to be reassembled in Rome's zone.
  it("resolves a summer kickoff at CEST (UTC+2)", () => {
    expect(matchStart(match())?.toISOString()).toBe("2026-09-25T18:00:00.000Z");
  });
  it("resolves a winter kickoff at CET (UTC+1)", () => {
    const m = match({ date: "2027-02-05T12:00:00+00:00", kickoff: "21:00" });
    expect(matchStart(m)?.toISOString()).toBe("2027-02-05T20:00:00.000Z");
  });
  it("ignores the placeholder time in `date`", () => {
    const m = match({ date: "2026-09-25T23:59:00+00:00", kickoff: "20:00" });
    expect(matchStart(m)?.toISOString()).toBe("2026-09-25T18:00:00.000Z");
  });
  it("returns null when the hour is unknown", () => {
    expect(matchStart(match({ kickoff: undefined }))).toBeNull();
  });
});

describe("seasonCalendar", () => {
  const build = (m: Match[] = [match()]) =>
    seasonCalendar(season(m), "https://rsa.example", new Date("2026-09-01T00:00:00Z"));

  it("wraps the events in a VCALENDAR", () => {
    const ls = lines(build());
    expect(ls[0]).toBe("BEGIN:VCALENDAR");
    expect(ls.at(-2)).toBe("END:VCALENDAR");
    expect(build().endsWith("\r\n")).toBe(true);
  });

  it("emits the kickoff as a UTC instant with a 90 minute duration", () => {
    const ls = lines(build());
    expect(ls).toContain("DTSTART:20260925T180000Z");
    expect(ls).toContain("DTEND:20260925T193000Z");
  });

  it("falls back to an all-day event when the hour is unknown", () => {
    const ls = lines(build([match({ kickoff: undefined })]));
    expect(ls).toContain("DTSTART;VALUE=DATE:20260925");
    expect(ls.some((l) => l.startsWith("DTEND"))).toBe(false);
  });

  // The namespace must not come from the deploy URL, or a preview and
  // production would mint different UIDs for the same fixture.
  it("gives each event a stable, host-independent UID", () => {
    expect(lines(build())).toContain("UID:2026-2027-m01@rsa-team.calendario");
  });

  it("carries the result once a match is played", () => {
    const played = match({ status: "played", score: { rsa: 2, opponent: 1 } });
    expect(lines(build([played]))).toContain("SUMMARY:RSA TEAM 2 - 1 Karpaty");
  });

  it("escapes the characters RFC 5545 treats as structural", () => {
    const m = match({ opponent: "A; B, C\\D" });
    const summary = lines(build([m])).find((l) => l.startsWith("SUMMARY"));
    expect(summary).toBe("SUMMARY:RSA TEAM - A\\; B\\, C\\\\D");
  });

  it("folds long lines at 75 octets without splitting a multi-byte character", () => {
    const m = match({ stadium: `Campo ${"àèìòù".repeat(20)}` });
    const encoder = new TextEncoder();
    for (const line of lines(build([m]))) {
      expect(encoder.encode(line).length).toBeLessThanOrEqual(75);
      // A split multi-byte char would not survive the round trip.
      expect(line).not.toContain("�");
    }
  });
});
