import { describe, it, expect } from "vitest";
import { localePath, pageAlternates, splitLocale } from "./config";

describe("localePath", () => {
  it("leaves Italian, the default, unprefixed", () => {
    expect(localePath("it", "/")).toBe("/");
    expect(localePath("it", "/squad")).toBe("/squad");
  });

  it("prefixes English, with no trailing slash on the home page", () => {
    expect(localePath("en", "/")).toBe("/en");
    expect(localePath("en", "/matches/2026-2027/m01")).toBe("/en/matches/2026-2027/m01");
  });
});

describe("splitLocale", () => {
  it("reads an unprefixed path as Italian", () => {
    expect(splitLocale("/squad")).toEqual({ lang: "it", path: "/squad" });
    expect(splitLocale("/")).toEqual({ lang: "it", path: "/" });
  });

  it("peels the prefix off an English path", () => {
    expect(splitLocale("/en")).toEqual({ lang: "en", path: "/" });
    expect(splitLocale("/en/squad/luigi-aiello")).toEqual({ lang: "en", path: "/squad/luigi-aiello" });
  });

  it("does not mistake a page that merely starts with the letters for a language", () => {
    expect(splitLocale("/entrance")).toEqual({ lang: "it", path: "/entrance" });
  });

  it("round-trips with localePath, which is what the language switch relies on", () => {
    for (const path of ["/", "/club", "/matches/2025-2026"]) {
      expect(splitLocale(localePath("en", path))).toEqual({ lang: "en", path });
    }
  });
});

describe("pageAlternates", () => {
  it("points x-default at the Italian URL and lists both languages", () => {
    expect(pageAlternates("en", "/club")).toEqual({
      canonical: "/en/club",
      languages: { it: "/club", en: "/en/club", "x-default": "/club" },
    });
  });

  it("passes the feed link through, since page alternates replace the layout's", () => {
    expect(pageAlternates("it", "/matches", { "text/calendar": "/calendar.ics" }).types).toEqual({
      "text/calendar": "/calendar.ics",
    });
  });
});
