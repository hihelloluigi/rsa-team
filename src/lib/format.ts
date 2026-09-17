import { DEFAULT_LOCALE, INTL_LOCALES, type Locale } from "@/i18n/config";

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
// disagree about which day a fixture falls on. The zone is Rome's in every
// language — it is where the match is played, not where the reader is.
const TIME_ZONE = "Europe/Rome";

// "03 ott 2025" / "03 Oct 2025" — compact form for fixture lists.
export function matchDateShort(iso: string, lang: Locale = DEFAULT_LOCALE): string {
  return new Date(iso).toLocaleDateString(INTL_LOCALES[lang], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
}

// "venerdì 03 ottobre 2025" / "Friday, 03 October 2025" — long form for the
// match detail page.
export function matchDateLong(iso: string, lang: Locale = DEFAULT_LOCALE): string {
  return new Date(iso).toLocaleDateString(INTL_LOCALES[lang], {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
}

// "https://www.instagram.com/rsafussball" -> "rsafussball". Keeps the handle
// derived from the one URL in club.json rather than written out beside it.
export function instagramHandle(url: string): string {
  return url.replace(/\/+$/, "").split("/").pop() ?? "";
}

// A country's name in the reader's language, from the ISO code the content
// already carries for the flag — so "Italia" in players.json never has to be
// translated by hand. Falls back to the written name for a missing or odd code.
export function countryName(code: string | undefined, fallback: string | undefined, lang: Locale): string | undefined {
  if (!code) return fallback;
  try {
    return new Intl.DisplayNames([INTL_LOCALES[lang]], { type: "region" }).of(code.toUpperCase()) ?? fallback;
  } catch {
    return fallback;
  }
}

// A Google Maps search for an address, rather than a stored link per venue:
// one fewer field to keep in step, and it opens the native maps app on a phone.
export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
