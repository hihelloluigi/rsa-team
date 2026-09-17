import { describe, it, expect, afterEach, vi } from "vitest";
import {
  ContactRequestSchema,
  contactEmail,
  contactFormEnabled,
  sendContactRequest,
} from "./contact";

const request = {
  topic: "sponsor" as const,
  name: "Mario Rossi",
  organization: "Bar Sport",
  email: "mario@barsport.it",
  message: "Vorremmo il nostro logo sulle maglie.",
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("ContactRequestSchema", () => {
  it("trims, and accepts a request with no organization", () => {
    const parsed = ContactRequestSchema.parse({ ...request, name: "  Mario Rossi ", organization: undefined });
    expect(parsed.name).toBe("Mario Rossi");
  });

  it("rejects a bad email and a message too short to mean anything", () => {
    expect(ContactRequestSchema.safeParse({ ...request, email: "mario" }).success).toBe(false);
    expect(ContactRequestSchema.safeParse({ ...request, message: "ciao" }).success).toBe(false);
  });

  it("rejects a topic the form does not offer", () => {
    expect(ContactRequestSchema.safeParse({ ...request, topic: "reclami" }).success).toBe(false);
  });
});

describe("contactFormEnabled", () => {
  it("needs both the key and the inbox", () => {
    vi.stubEnv("RESEND_API_KEY", "re_x");
    vi.stubEnv("CONTACT_INBOX", "");
    expect(contactFormEnabled()).toBe(false);
    // Separators with nothing between them are still nowhere to send to.
    vi.stubEnv("CONTACT_INBOX", " , ");
    expect(contactFormEnabled()).toBe(false);
    vi.stubEnv("CONTACT_INBOX", "club@example.com");
    expect(contactFormEnabled()).toBe(true);
  });
});

describe("contactEmail", () => {
  it("leads the subject with the topic", () => {
    expect(contactEmail(request).subject).toBe("[Sponsor] Scrive Mario Rossi (Bar Sport)");
    expect(contactEmail({ ...request, topic: "amichevole" }).subject).toMatch(/^\[Amichevole\]/);
  });

  it("names the organization only when there is one", () => {
    expect(contactEmail({ ...request, organization: "" }).subject).toMatch(/Mario Rossi$/);
  });
});

describe("sendContactRequest", () => {
  it("sends to the inbox with the writer as reply-to", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_x");
    vi.stubEnv("CONTACT_INBOX", "club@example.com");
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ id: "1" }));
    vi.stubGlobal("fetch", fetchMock);

    await sendContactRequest(request);

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBe("Bearer re_x");
    expect(JSON.parse(init.body)).toMatchObject({
      to: ["club@example.com"],
      reply_to: "mario@barsport.it",
    });
  });

  it("sends to every address in a comma-separated inbox", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_x");
    vi.stubEnv("CONTACT_INBOX", "luigi@example.com, mattia@example.com,,");
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ id: "1" }));
    vi.stubGlobal("fetch", fetchMock);

    await sendContactRequest(request);

    expect(JSON.parse(fetchMock.mock.calls[0][1].body).to).toEqual([
      "luigi@example.com",
      "mattia@example.com",
    ]);
  });

  it("throws when Resend refuses, so the form can say it did not go through", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_x");
    vi.stubEnv("CONTACT_INBOX", "club@example.com");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 403 })));
    await expect(sendContactRequest(request)).rejects.toThrow("403");
  });

  it("throws rather than calling out when it is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(sendContactRequest(request)).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
