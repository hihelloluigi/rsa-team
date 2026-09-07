import { describe, it, expect } from "vitest";
import { initials, instagramHandle, matchDateLong, matchDateShort } from "./format";

describe("initials", () => {
  it("takes the first letter of the first two words, uppercased", () => {
    expect(initials("Luigi Aiello")).toBe("LA");
  });
  it("caps at two letters for longer names", () => {
    expect(initials("Moleri Leonardo Maria")).toBe("ML");
  });
  it("handles a single-word name", () => {
    expect(initials("Vanga")).toBe("V");
  });
});

// These run on the build machine, so they must not depend on its TZ: the
// helpers pin Europe/Rome. A late-evening UTC timestamp is already the next
// day in Rome — that's the case an unpinned formatter gets wrong.
describe("matchDateShort", () => {
  it("formats an Italian short date", () => {
    expect(matchDateShort("2025-10-03T12:00:00+00:00")).toBe("03 ott 2025");
  });
  it("uses Rome time, not the host timezone", () => {
    expect(matchDateShort("2025-10-03T23:30:00+00:00")).toBe("04 ott 2025");
  });
});

describe("matchDateLong", () => {
  it("formats an Italian long date with the weekday", () => {
    expect(matchDateLong("2025-10-03T12:00:00+00:00")).toBe("venerdì 03 ottobre 2025");
  });
  it("uses Rome time, not the host timezone", () => {
    expect(matchDateLong("2025-10-03T23:30:00+00:00")).toBe("sabato 04 ottobre 2025");
  });
});

describe("instagramHandle", () => {
  it("takes the handle from a profile URL", () => {
    expect(instagramHandle("https://www.instagram.com/rsafussball")).toBe("rsafussball");
  });
  it("ignores a trailing slash", () => {
    expect(instagramHandle("https://www.instagram.com/rsafussball/")).toBe("rsafussball");
  });
});
