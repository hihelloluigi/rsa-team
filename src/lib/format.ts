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
