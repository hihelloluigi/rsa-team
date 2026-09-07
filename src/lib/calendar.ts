// Builds an iCalendar (RFC 5545) feed from a season's fixtures, so anyone can
// subscribe in Google Calendar, Apple Calendar or Outlook and have the
// calendar follow the site rather than be maintained separately.
import type { Match, Season } from "./types";
import { matchSides } from "./matches";

const TIME_ZONE = "Europe/Rome";

// Amateur 7-a-side: two short halves plus the bits around them.
const DURATION_MINUTES = 90;

// How often a subscriber should re-poll. Google honours this loosely.
const REFRESH = "PT12H";

// UID namespace. Deliberately a constant rather than the deploy URL: a preview
// and production must mint the same UID for the same fixture, or anyone who
// subscribed from one would collect duplicates of every match from the other.
const UID_NAMESPACE = "rsa-team.calendario";

// Offset of `tz` from UTC at a given instant, in milliseconds.
function zoneOffset(at: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .formatToParts(at)
    .reduce<Record<string, string>>((acc, p) => {
      acc[p.type] = p.value;
      return acc;
    }, {});
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );
  return asUtc - at.getTime();
}

// A wall-clock time in `tz` resolved to the instant it denotes. Two passes, so
// the offset applied is the one actually in force at that instant rather than
// the one at the naive guess — that is what makes February and September
// kickoffs both land correctly across the DST boundary.
function fromZonedTime(iso: string, hhmm: string, tz: string): Date {
  const [y, mo, d] = iso.slice(0, 10).split("-").map(Number);
  const [h, mi] = hhmm.split(":").map(Number);
  const naive = Date.UTC(y, mo - 1, d, h, mi);
  const once = naive - zoneOffset(new Date(naive), tz);
  return new Date(naive - zoneOffset(new Date(once), tz));
}

// The instant a fixture kicks off. `date` carries only the day (its time is a
// placeholder) and `kickoff` only the hour, so neither is usable alone. Returns
// null when the hour is unknown — the caller then emits an all-day event.
export function matchStart(match: Match): Date | null {
  return match.kickoff ? fromZonedTime(match.date, match.kickoff, TIME_ZONE) : null;
}

// 20260925T180000Z
function utcStamp(d: Date): string {
  return `${d.toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`;
}

// 20260925
function dateStamp(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, "");
}

// RFC 5545 §3.3.11: backslash, semicolon, comma and newlines are significant.
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// RFC 5545 §3.1: content lines are folded at 75 octets, continuations begin
// with a space. Folding counts octets, not characters, and must not split a
// multi-byte one — this feed carries "·" and accented text.
function fold(line: string): string {
  const encoder = new TextEncoder();
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const size = encoder.encode(ch).length;
    // A continuation carries a leading space, so it holds one octet less.
    const limit = out.length === 0 ? 75 : 74;
    if (bytes + size > limit) {
      out.push(current);
      current = "";
      bytes = 0;
    }
    current += ch;
    bytes += size;
  }
  out.push(current);
  return out.join("\r\n ");
}

function summary(match: Match): string {
  const { home, away, homeScore, awayScore } = matchSides(match);
  // A played fixture carries its result, so the calendar doubles as a record.
  return match.score ? `${home} ${homeScore} - ${awayScore} ${away}` : `${home} - ${away}`;
}

function event(season: Season, match: Match, base: string, stamp: string): string[] {
  const start = matchStart(match);
  const url = `${base}/matches/${season.id}/${match.id}`;

  const when = start
    ? [
        `DTSTART:${utcStamp(start)}`,
        `DTEND:${utcStamp(new Date(start.getTime() + DURATION_MINUTES * 60_000))}`,
      ]
    : // Hour unknown: an all-day event is honest, a guessed time is not.
      [`DTSTART;VALUE=DATE:${dateStamp(match.date)}`];

  const details = [match.competition, match.round && `${match.round}ª giornata`, match.note]
    .filter(Boolean)
    .join(" · ");

  return [
    "BEGIN:VEVENT",
    // Stable, so re-subscribing updates an event instead of duplicating it.
    `UID:${season.id}-${match.id}@${UID_NAMESPACE}`,
    `DTSTAMP:${stamp}`,
    ...when,
    `SUMMARY:${escapeText(summary(match))}`,
    ...(match.stadium ? [`LOCATION:${escapeText(match.stadium)}`] : []),
    `DESCRIPTION:${escapeText(`${details}\n${url}`)}`,
    `URL:${url}`,
    "END:VEVENT",
  ];
}

export function seasonCalendar(season: Season, base: string, now = new Date()): string {
  const stamp = utcStamp(now);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RSA TEAM//Calendario//IT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(`RSA TEAM ${season.label}`)}`,
    `X-WR-CALDESC:${escapeText(`Calendario e risultati dell'RSA TEAM, stagione ${season.label}.`)}`,
    `X-WR-TIMEZONE:${TIME_ZONE}`,
    `REFRESH-INTERVAL;VALUE=DURATION:${REFRESH}`,
    `X-PUBLISHED-TTL:${REFRESH}`,
    ...season.matches.flatMap((m) => event(season, m, base, stamp)),
    "END:VCALENDAR",
  ];
  // RFC 5545 §3.1: lines are CRLF-delimited, and the file ends with one.
  return `${lines.map(fold).join("\r\n")}\r\n`;
}
