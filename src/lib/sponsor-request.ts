import { z } from "zod";

// A would-be sponsor's message, delivered as an email through Resend's REST API
// — called with fetch like the other two services here, so no SDK comes along
// for a single POST.
const API = "https://api.resend.com/emails";

// Resend's shared sender. It delivers only to the address the Resend account
// was opened with, which is exactly who should be reading these — so the form
// works before anyone has verified a domain. Set SPONSOR_FROM once one is.
const DEFAULT_FROM = "RSA TEAM <onboarding@resend.dev>";

export const SponsorRequestSchema = z.object({
  name: z.string().trim().min(2, "Dicci almeno come ti chiami.").max(80),
  company: z.string().trim().max(120).optional(),
  email: z.email("Questa email non sembra valida.").max(200),
  message: z
    .string()
    .trim()
    .min(10, "Scrivici due righe in più.")
    .max(2000, "Bello l'entusiasmo, ma stai sotto i 2000 caratteri."),
});
export type SponsorRequest = z.infer<typeof SponsorRequestSchema>;

// SPONSOR_INBOX is one address or several, comma-separated — a request should
// not wait on whichever one person happens to check their mail.
export function sponsorInboxes(): string[] {
  return (process.env.SPONSOR_INBOX ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

// Both are needed: a key with nowhere to send to is as unconfigured as no key.
export function sponsorFormEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY) && sponsorInboxes().length > 0;
}

export function sponsorEmail(request: SponsorRequest, clubName: string) {
  const who = request.company ? `${request.name} (${request.company})` : request.name;
  return {
    subject: `Nuovo sponsor per ${clubName}? Scrive ${who}`,
    text: [
      `Nome: ${request.name}`,
      `Azienda: ${request.company || "—"}`,
      `Email: ${request.email}`,
      "",
      request.message,
    ].join("\n"),
  };
}

export async function sendSponsorRequest(request: SponsorRequest, clubName: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const inboxes = sponsorInboxes();
  if (!key || inboxes.length === 0) throw new Error("Sponsor form is not configured.");

  const res = await fetch(API, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.SPONSOR_FROM || DEFAULT_FROM,
      to: inboxes,
      // Hitting reply answers the sponsor, not the sending address.
      reply_to: request.email,
      ...sponsorEmail(request, clubName),
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Resend failed: ${res.status}`);
}
