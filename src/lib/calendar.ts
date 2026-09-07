// Builds an iCalendar (RFC 5545) feed from a season's fixtures, so anyone can
// subscribe in Google Calendar, Apple Calendar or Outlook and have the
// calendar follow the site rather than be maintained separately.
import type { Match, Season } from "./types";
import { matchSides } from "./matches";
import { getVenue } from "./data";

const TIME_ZONE = "Europe/Rome";

// Amateur 7-a-side: two short halves plus the bits around them.
const DURATION_MINUTES = 90;

// How often a subscriber should re-poll. Google honours this loosely.
const REFRESH = "PT12H";

// UID namespace. Deliberately a constant rather than the deploy URL: a preview
// and production must mint the same UID for the same fixture, or anyone who
// subscribed from one would collect duplicates of every match from the other.
const UID_NAMESPACE = "rsa-team.calendario";

// Europe/Rome under the EU rules: CET (+01) with CEST (+02) from the last
// Sunday in March to the last Sunday in October. Shipping this and referencing
// it by TZID — rather than emitting absolute UTC — means a client resolves each
// kickoff with its own current tz database. If the EU ever does drop seasonal
// clock changes, subscribers stay correct without waiting for a redeploy.
const VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  `TZID:${TIME_ZONE}`,
  "X-LIC-LOCATION:Europe/Rome",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0200",
  "TZNAME:CEST",
  "DTSTART:19700329T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0200",
  "TZOFFSETTO:+0100",
  "TZNAME:CET",
  "DTSTART:19701025T030000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

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

// 20260925T180000Z — used for DTSTAMP, which is genuinely an absolute instant.
function utcStamp(d: Date): string {
  return `${d.toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`;
}

// 20260925T200000 — an instant rendered as wall-clock time in `tz`, to be
// paired with TZID.
function localStamp(at: Date, tz: string): string {
  const p = new Intl.DateTimeFormat("en-CA", {
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
    .reduce<Record<string, string>>((acc, x) => {
      acc[x.type] = x.value;
      return acc;
    }, {});
  const hour = String(Number(p.hour) % 24).padStart(2, "0");
  return `${p.year}${p.month}${p.day}T${hour}${p.minute}${p.second}`;
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

function venueLine(stadium: string): string {
  const venue = getVenue(stadium);
  return venue ? `${stadium}, ${venue.address}` : stadium;
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
        `DTSTART;TZID=${TIME_ZONE}:${localStamp(start, TIME_ZONE)}`,
        // The end is computed as an instant then rendered back to wall time, so
        // a fixture that spanned a clock change would still last 90 minutes.
        `DTEND;TZID=${TIME_ZONE}:${localStamp(new Date(start.getTime() + DURATION_MINUTES * 60_000), TIME_ZONE)}`,
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
    // A bare venue name is only a label; with the street address the calendar
    // app turns it into directions, which is the point of having it here.
    ...(match.stadium
      ? [`LOCATION:${escapeText(venueLine(match.stadium))}`]
      : []),
    `DESCRIPTION:${escapeText(`${details}\n${url}`)}`,
    // Struck through in the subscriber's calendar rather than vanishing, which
    // is what deleting the fixture outright would do.
    ...(match.status === "postponed" ? ["STATUS:CANCELLED"] : []),
    `URL:${url}`,
    "END:VEVENT",
  ];
}

// Every season, not just the current one. A subscribed calendar is a mirror of
// its feed: a client drops any event the feed no longer lists, so serving only
// the current season would erase a season of history from every subscriber the
// day the next one starts. Past fixtures cost nothing — calendars show today
// forward — and they keep the feed additive.
export function fixturesCalendar(seasons: Season[], base: string, now = new Date()): string {
  const stamp = utcStamp(now);
  // A single-season export says which one; the full feed spans all of them.
  const scope =
    seasons.length === 1 ? `stagione ${seasons[0].label}` : "stagione per stagione";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RSA TEAM//Calendario//IT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    // Deliberately season-less: the feed URL is permanent, and several clients
    // snapshot this name at subscribe time and never refresh it.
    "X-WR-CALNAME:RSA TEAM",
    `X-WR-CALDESC:${escapeText(`Calendario e risultati dell'RSA TEAM, ${scope}.`)}`,
    `X-WR-TIMEZONE:${TIME_ZONE}`,
    `REFRESH-INTERVAL;VALUE=DURATION:${REFRESH}`,
    `X-PUBLISHED-TTL:${REFRESH}`,
    ...VTIMEZONE,
    ...seasons.flatMap((s) => s.matches.map((m) => event(s, m, base, stamp))).flat(),
    "END:VCALENDAR",
  ];
  // RFC 5545 §3.1: lines are CRLF-delimited, and the file ends with one.
  return `${lines.map(fold).join("\r\n")}\r\n`;
}
