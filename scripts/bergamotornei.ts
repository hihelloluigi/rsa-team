// What the importers know about bergamotornei: where a season lives upstream
// and how to read the markup its own pages render. Every parser here fails
// loudly on markup it does not recognise rather than returning half an answer,
// because what it returns is written straight into seasons.json.

export const ENDPOINT = "https://www.bergamotornei.com/system/include/ajax/public/league.php";

// Our club's name upstream. Rows and fixtures are found by it.
export const US = "RSA Team";

// Where each season lives upstream. `round` is the girone id, taken from the
// value of its option in the site's own season/girone dropdown.
export const SOURCES: Record<string, Source> = {
  "2026-2027": { tid: 154, round: 1226, label: "Serie D Girone D" },
};
export type Source = { tid: number; round: number; label: string };

export const decode = (s: string): string =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// The site's pages fetch their tables from this endpoint as `{ html }`.
export async function leagueHtml(body: string): Promise<string> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`upstream returned ${res.status}`);
  const { html } = await res.json();
  if (typeof html !== "string") throw new Error("upstream response had no html");
  return html;
}

export async function pageHtml(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  return res.text();
}

// One fixture as a giornata's calendar lists it. The first team named is the
// home side. `score` is absent until the result is entered upstream.
export type Fixture = {
  home: string;
  away: string;
  day: number;
  month: number; // 1-12
  kickoff: string; // "HH:MM"
  score?: { home: number; away: number };
  url: string;
};

const MONTHS = ["GEN", "FEB", "MAR", "APR", "MAG", "GIU", "LUG", "AGO", "SET", "OTT", "NOV", "DIC"];

// A giornata's calendar (op=22). Byes ("Turno di riposo") carry no link and
// are skipped: our own byes already live in the season's `rests`.
export function parseCalendar(html: string): Fixture[] {
  const elements = html.split('<div class="match-element">').slice(1);
  if (elements.length === 0) throw new Error("no fixtures parsed — the markup has probably changed");
  return elements.flatMap((el): Fixture[] => {
    const url = el.match(/<a href="([^"]+\/match\/\d+\/[^"]*)"/)?.[1];
    if (!url) {
      if (el.includes("Turno di riposo")) return [];
      throw new Error("a fixture has no match link — the markup has probably changed");
    }
    const teams = [...el.matchAll(/participant-name[^>]*>([^<]+)</g)].map((m) => decode(m[1]));
    const when = el.match(/(\d{1,2}) ([A-Z]{3}) (\d{2}:\d{2})\s*<\/div>/);
    const month = when ? MONTHS.indexOf(when[2]) + 1 : 0;
    if (teams.length !== 2 || !when || month === 0) {
      throw new Error(`could not read the fixture at ${url}`);
    }
    const scores = [...el.matchAll(/<div class='score'>(\d+)<\/div>/g)].map((m) => Number(m[1]));
    if (scores.length !== 0 && scores.length !== 2) {
      throw new Error(`fixture at ${url} has ${scores.length} scores`);
    }
    return [
      {
        home: teams[0],
        away: teams[1],
        day: Number(when[1]),
        month,
        kickoff: when[3],
        ...(scores.length ? { score: { home: scores[0], away: scores[1] } } : {}),
        url,
      },
    ];
  });
}

// A match page's scorers, home side first, in our spelling of a brace: the file
// has always said "Rossi Mario (x2)". Upstream mirrors its two columns, so the
// count sits on the inner side of the name — "(2) Rossi Mario" for the away
// team, "Rossi Mario (2)" for the home team — and is looked for on either.
export function parseScorers(html: string): { home: string[]; away: string[] } {
  const side = (cls: string): string[] => {
    const block = html.match(new RegExp(`<div class="${cls}">([\\s\\S]*?)</div>`))?.[1];
    if (block === undefined) throw new Error(`no ${cls} block — the markup has probably changed`);
    return block.split(/<br\s*\/?>/).flatMap((entry) => {
      const name = entry.match(/<a [^>]*>([^<]+)<\/a>/)?.[1];
      if (!name) return [];
      const n = Number(entry.replace(/<a [^>]*>[^<]*<\/a>/, "").match(/\((\d+)\)/)?.[1] ?? 1);
      return [n > 1 ? `${decode(name)} (x${n})` : decode(name)];
    });
  };
  return { home: side("scorer_a"), away: side("scorer_b") };
}

// Goals a scorer list accounts for: "Rossi Mario (x3)" counts three.
export const goalsListed = (scorers: string[]): number =>
  scorers.reduce((n, s) => n + Number(s.match(/\(x(\d+)\)$/)?.[1] ?? 1), 0);
