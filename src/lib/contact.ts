import { z } from "zod";
import { getClub } from "./data";
import { it } from "@/i18n/it";
import type { Dictionary } from "@/i18n/dictionaries";

// A message from the contact form, delivered as an email through Resend's REST
// API — called with fetch like the other two services here, so no SDK comes
// along for a single POST.
const API = "https://api.resend.com/emails";

// Resend's shared sender. It delivers only to the address the Resend account
// was opened with, so the form works before anyone has verified a domain — as
// long as that address is the inbox. Set CONTACT_FROM once a domain is verified.
const defaultFrom = () => `${getClub().name} <onboarding@resend.dev>`;

// Why someone is writing. It leads the email's subject, so whoever opens the
// inbox can tell a sponsor from a request for a friendly without reading on.
// The order here is the order of the form's menu. These Italian labels are the
// ones used in the email, which goes to the club whatever language the visitor
// wrote from; the form's own labels come from the dictionary.
export const CONTACT_TOPICS = {
  sponsor: "Diventare sponsor",
  amichevole: "Organizzare un'amichevole",
  giocare: "Giocare con voi",
  altro: "Altro",
} as const;
export type ContactTopic = keyof typeof CONTACT_TOPICS;

const SUBJECT_TAGS: Record<ContactTopic, string> = {
  sponsor: "Sponsor",
  amichevole: "Amichevole",
  giocare: "Nuovo giocatore",
  altro: "Contatto",
};

// A factory because the messages are shown to the visitor, so they have to be
// in the visitor's language.
export const contactRequestSchema = (errors: Dictionary["form"]["errors"]) =>
  z.object({
    topic: z.enum(Object.keys(CONTACT_TOPICS) as [ContactTopic, ...ContactTopic[]], errors.invalid),
    name: z.string().trim().min(2, errors.name).max(80, errors.invalid),
    // A company for a sponsor, a team for a friendly, nothing for most people.
    organization: z.string().trim().max(120, errors.invalid).optional(),
    email: z.email(errors.email).max(200, errors.invalid),
    message: z.string().trim().min(10, errors.messageShort).max(2000, errors.messageLong),
  });

export const ContactRequestSchema = contactRequestSchema(it.form.errors);
export type ContactRequest = z.infer<typeof ContactRequestSchema>;

// CONTACT_INBOX is one address or several, comma-separated — a message should
// not wait on whichever one person happens to check their mail.
export function contactInboxes(): string[] {
  return (process.env.CONTACT_INBOX ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

// Both are needed: a key with nowhere to send to is as unconfigured as no key.
export function contactFormEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY) && contactInboxes().length > 0;
}

export function contactEmail(request: ContactRequest) {
  const who = request.organization ? `${request.name} (${request.organization})` : request.name;
  return {
    subject: `[${SUBJECT_TAGS[request.topic]}] Scrive ${who}`,
    text: [
      `Motivo: ${CONTACT_TOPICS[request.topic]}`,
      `Nome: ${request.name}`,
      `Azienda o squadra: ${request.organization || "—"}`,
      `Email: ${request.email}`,
      "",
      request.message,
    ].join("\n"),
  };
}

export async function sendContactRequest(request: ContactRequest): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const inboxes = contactInboxes();
  if (!key || inboxes.length === 0) throw new Error("Contact form is not configured.");

  const res = await fetch(API, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || defaultFrom(),
      to: inboxes,
      // Hitting reply answers the person who wrote, not the sending address.
      reply_to: request.email,
      ...contactEmail(request),
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Resend failed: ${res.status}`);
}
