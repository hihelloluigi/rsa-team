import type { MatchResult, Position } from "./types";

// Up-to-two-letter initials for a name, used as a photo fallback.
export function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Match dates are formatted on the server at build time, so the timezone has to
// be pinned: a Vercel build (UTC) and a local build (CET) would otherwise
// disagree about which day a fixture falls on.
const LOCALE = "it-IT";
const TIME_ZONE = "Europe/Rome";

// "03 ott 2025" — compact form for fixture lists.
export function matchDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
}

// "venerdì 03 ottobre 2025" — long form for the match detail page.
export function matchDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
}

// Italian abbreviations shown on player badges (data keeps the GK/DEF/MID/FWD
// codes). A display mapping, so it lives here rather than in the data layer.
export const positionLabels: Record<Position, string> = {
  GK: "POR",
  DEF: "DIF",
  MID: "CEN",
  FWD: "ATT",
};

// "https://www.instagram.com/rsafussball" -> "rsafussball". Keeps the handle
// derived from the one URL in club.json rather than written out beside it.
export function instagramHandle(url: string): string {
  return url.replace(/\/+$/, "").split("/").pop() ?? "";
}

// Full Italian role names. The badge abbreviations above are for the UI; these
// are for anywhere a word is wanted — notably schema.org, where "POR" means
// nothing to a search engine.
export const positionNames: Record<Position, string> = {
  GK: "Portiere",
  DEF: "Difensore",
  MID: "Centrocampista",
  FWD: "Attaccante",
};

// Vittoria / Nullo / Perso, as shown on a result badge.
export const resultLabels: Record<MatchResult, string> = { W: "V", D: "N", L: "P" };

// The same three spelled out — read aloud by screen readers in place of the
// bare letter, and used wherever the result is stated in full.
export const resultNames: Record<MatchResult, string> = {
  W: "Vittoria",
  D: "Pareggio",
  L: "Sconfitta",
};

// A Google Maps search for an address, rather than a stored link per venue:
// one fewer field to keep in step, and it opens the native maps app on a phone.
export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
