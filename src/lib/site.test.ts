import { describe, it, expect, afterEach, vi } from "vitest";
import { siteUrl } from "./site";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("siteUrl", () => {
  it("prefers NEXT_PUBLIC_SITE_URL and strips trailing slashes", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://rsateam.it///");
    expect(siteUrl()).toBe("https://rsateam.it");
  });

  it("falls back to the Vercel production URL with an https scheme", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "rsa-team.vercel.app");
    expect(siteUrl()).toBe("https://rsa-team.vercel.app");
  });

  it("falls back to local dev when nothing is set", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    expect(siteUrl()).toBe("http://localhost:3002");
  });
});
