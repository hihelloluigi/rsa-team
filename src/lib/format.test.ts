import { describe, it, expect } from "vitest";
import { initials } from "./format";

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
