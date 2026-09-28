#!/usr/bin/env node
// Pulls a season's league table from bergamotornei and writes it into
// src/data/seasons.json, so the classifica does not have to be retyped after
// every giornata — eighty-four numbers that all move when other teams play.
//
//   npm run import:standings              # every season in bergamotornei.ts
//   npm run import:standings 2026-2027    # just one
//
// The script itself commits nothing: the daily sync workflow tests, builds and
// commits what it writes; run by hand, review the diff and commit as usual.
// This reads an undocumented endpoint the site's own pages call, so it is
// expected to break if they change it — it fails loudly rather than writing
// half a table.

import { readFile, writeFile } from "node:fs/promises";
// Shared with the admin so both write the file the same way.
import { serializeSeasons } from "../src/lib/seasons-file.ts";
import type { Season, StandingRow } from "../src/lib/types.ts";
import { decode, leagueHtml, SOURCES, US, type Source } from "./bergamotornei.ts";

const DATA = new URL("../src/data/seasons.json", import.meta.url);

// The response labels its own columns, so they are matched by title rather
// than by position — a reordering upstream then fails to match instead of
// silently swapping goals for and against.
const COLUMNS: Record<Stat, string> = {
  points: "Punti Classifica",
  played: "Partite Disputate",
  won: "Vittorie",
  drawn: "Pareggi",
  lost: "Sconfitte",
  goalsFor: "Gol Fatti",
  goalsAgainst: "Gol Subiti",
};

// The stats we take from upstream; the rest of its columns (fair play, goal
// difference) are derivable or unused here.
type Stat = "points" | "played" | "won" | "drawn" | "lost" | "goalsFor" | "goalsAgainst";
type Fetched = { team: string } & Record<Stat, number>;

async function fetchTable({ tid, round }: Source): Promise<Fetched[]> {
  const html = await leagueHtml(`op=20&tid=${tid}&round=${round}`);

  const headers = [...html.matchAll(/col-data text-center' title="([^"]+)"/g)].map((m) => m[1]);
  const names = [...html.matchAll(/participant-name[^>]*>([^<]+)</g)].map((m) => decode(m[1]));
  const rows = [...html.matchAll(/tables-body tables-row (?:even|odd)">((?:<div class="col-data[^>]*><small>-?\d+<\/small><\/div>)+)<\/div>/g)]
    .map((m) => [...m[1].matchAll(/<small>(-?\d+)<\/small>/g)].map((n) => Number(n[1])));

  if (names.length === 0) throw new Error("no teams parsed — the markup has probably changed");
  if (names.length !== rows.length) {
    throw new Error(`parsed ${names.length} teams but ${rows.length} rows of numbers`);
  }
  const index = {} as Record<Stat, number>;
  for (const [key, title] of Object.entries(COLUMNS)) {
    const at = headers.indexOf(title);
    if (at < 0) throw new Error(`column "${title}" is missing upstream`);
    index[key as Stat] = at;
  }
  return names.map((team, i) => {
    const row = { team } as Fetched;
    for (const [key, at] of Object.entries(index)) row[key as Stat] = rows[i][at];
    return row;
  });
}

// Every goal is scored by one team and conceded by another, and every decisive
// match makes a winner and a loser — so a mis-parse usually shows up here.
function assertCoherent(rows: Fetched[]): void {
  const sum = (k: Stat) => rows.reduce((n, r) => n + r[k], 0);
  for (const r of rows) {
    if (r.played !== r.won + r.drawn + r.lost) throw new Error(`${r.team}: played != W+D+L`);
    if (r.points !== r.won * 3 + r.drawn) throw new Error(`${r.team}: points != 3W+D`);
  }
  if (sum("goalsFor") !== sum("goalsAgainst")) throw new Error("goals for != goals against");
  if (sum("won") !== sum("lost")) throw new Error("wins != losses");
}

// Upstream spelling drifts from ours ("Asd Comun Nuovo calcio" vs "... Calcio").
// Fixtures reference our spelling, so keep it rather than letting an import
// quietly introduce a second name for the same club.
function reconcileNames(rows: Fetched[], season: Season): Fetched[] {
  const known = new Map<string, string>();
  for (const r of season.standings) known.set(r.team.toLowerCase(), r.team);
  for (const m of season.matches) known.set(m.opponent.toLowerCase(), m.opponent);

  const unknown: string[] = [];
  const out = rows.map((r) => {
    const ours = known.get(r.team.toLowerCase());
    if (!ours) unknown.push(r.team);
    return { ...r, team: ours ?? r.team };
  });
  if (unknown.length) {
    throw new Error(
      `these teams are not in the season yet: ${unknown.join(", ")}\n` +
        "Add them (or fix the spelling) before importing, so a club does not end up under two names.",
    );
  }
  return out;
}

const only = process.argv[2];
const seasons: Season[] = JSON.parse(await readFile(DATA, "utf8"));
const targets = Object.entries(SOURCES).filter(([id]) => !only || id === only);
if (!targets.length) {
  console.error(`No source configured for "${only}". Known: ${Object.keys(SOURCES).join(", ")}`);
  process.exit(1);
}

let changed = 0;
for (const [id, source] of targets) {
  const season = seasons.find((s) => s.id === id);
  if (!season) throw new Error(`season ${id} is not in seasons.json`);

  const fetched = reconcileNames(await fetchTable(source), season);
  assertCoherent(fetched);

  const before = JSON.stringify(season.standings);
  season.standings = fetched.map((r): StandingRow => ({
    team: r.team,
    played: r.played,
    won: r.won,
    drawn: r.drawn,
    lost: r.lost,
    goalsFor: r.goalsFor,
    goalsAgainst: r.goalsAgainst,
    points: r.points,
    // The site marks its own row; carry that over rather than re-deriving it.
    ...(r.team === US ? { isRSA: true } : {}),
  }));

  const same = before === JSON.stringify(season.standings);
  if (!same) changed += 1;
  const us = fetched.findIndex((r) => r.team === US);
  console.log(
    `${id} (${source.label}): ${fetched.length} teams` +
      (us >= 0 ? `, RSA ${us + 1}${us === 0 ? "st" : "th"} on ${fetched[us].points} pts` : "") +
      (same ? " — unchanged" : " — updated"),
  );
}

if (changed) {
  await writeFile(DATA, serializeSeasons(seasons));
  console.log("\nsrc/data/seasons.json written. Review the diff, run `npm test`, then commit.");
} else {
  console.log("\nNothing to write.");
}
