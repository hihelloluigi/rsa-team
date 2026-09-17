import { describe, it, expect, afterEach, vi } from "vitest";
import {
  SponsorRequestSchema,
  sendSponsorRequest,
  sponsorEmail,
  sponsorFormEnabled,
} from "./sponsor-request";

const request = {
  name: "Mario Rossi",
  company: "Bar Sport",
  email: "mario@barsport.it",
  message: "Vorremmo il nostro logo sulle maglie.",
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("SponsorRequestSchema", () => {
  it("trims, and accepts a request with no company", () => {
    const parsed = SponsorRequestSchema.parse({ ...request, name: "  Mario Rossi ", company: undefined });
    expect(parsed.name).toBe("Mario Rossi");
  });

  it("rejects a bad email and a message too short to mean anything", () => {
    expect(SponsorRequestSchema.safeParse({ ...request, email: "mario" }).success).toBe(false);
    expect(SponsorRequestSchema.safeParse({ ...request, message: "ciao" }).success).toBe(false);
  });
});

describe("sponsorFormEnabled", () => {
  it("needs both the key and the inbox", () => {
    vi.stubEnv("RESEND_API_KEY", "re_x");
    vi.stubEnv("SPONSOR_INBOX", "");
    expect(sponsorFormEnabled()).toBe(false);
    // Separators with nothing between them are still nowhere to send to.
    vi.stubEnv("SPONSOR_INBOX", " , ");
    expect(sponsorFormEnabled()).toBe(false);
    vi.stubEnv("SPONSOR_INBOX", "club@example.com");
    expect(sponsorFormEnabled()).toBe(true);
  });
});

describe("sponsorEmail", () => {
  it("names the company in the subject only when there is one", () => {
    expect(sponsorEmail(request, "RSA TEAM").subject).toContain("Mario Rossi (Bar Sport)");
    expect(sponsorEmail({ ...request, company: "" }, "RSA TEAM").subject).toMatch(/Mario Rossi$/);
  });
});

describe("sendSponsorRequest", () => {
  it("sends to the inbox with the sponsor as reply-to", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_x");
    vi.stubEnv("SPONSOR_INBOX", "club@example.com");
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ id: "1" }));
    vi.stubGlobal("fetch", fetchMock);

    await sendSponsorRequest(request, "RSA TEAM");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBe("Bearer re_x");
    expect(JSON.parse(init.body)).toMatchObject({
      to: ["club@example.com"],
      reply_to: "mario@barsport.it",
    });
  });

  it("sends to every address in a comma-separated inbox", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_x");
    vi.stubEnv("SPONSOR_INBOX", "luigi@example.com, mattia@example.com,,");
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ id: "1" }));
    vi.stubGlobal("fetch", fetchMock);

    await sendSponsorRequest(request, "RSA TEAM");

    expect(JSON.parse(fetchMock.mock.calls[0][1].body).to).toEqual([
      "luigi@example.com",
      "mattia@example.com",
    ]);
  });

  it("throws when Resend refuses, so the form can say it did not go through", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_x");
    vi.stubEnv("SPONSOR_INBOX", "club@example.com");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 403 })));
    await expect(sendSponsorRequest(request, "RSA TEAM")).rejects.toThrow("403");
  });

  it("throws rather than calling out when it is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(sendSponsorRequest(request, "RSA TEAM")).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
