#!/usr/bin/env node
// Pulls our fixtures from bergamotornei and writes their results into
// src/data/seasons.json: the score, the scorers, and the day and kickoff when
// a game is moved. The daily sync workflow runs this before the standings
// importer; it is just as happy run by hand.
//
//   npm run import:matches              # every season listed in bergamotornei.ts
//   npm run import:matches 2026-2027    # just one
//
// Upstream only ever adds to a fixture. What stays ours: the id, the stadium
// (our spelling, which venues.json is keyed by), the note, and a result
// upstream has not entered — a match played here is never reset to upcoming.
// Scorers are replaced side by side, and only when upstream names someone.
// Like the standings importer, it reads undocumented endpoints and fails
// loudly rather than writing a fixture it could not fully read.

import { readFile, writeFile } from "node:fs/promises";
import { serializeSeasons } from "../src/lib/seasons-file.ts";
import type { Match, Season } from "../src/lib/types.ts";
import {
  goalsListed,
  leagueHtml,
  pageHtml,
  parseCalendar,
  parseScorers,
  SOURCES,
  US,
  type Fixture,
  type Source,
} from "./bergamotornei.ts";

const DATA = new URL("../src/data/seasons.json", import.meta.url);

// Upstream names a day and a month but no year. The year is the one that puts
// the day closest to where the fixture already sits, since a rescheduled game
// moves by weeks, not by a year — and a season spans a new year's eve.
function datedLike(current: string, day: number, month: number): string {
  const was = new Date(current);
  const year = was.getUTCFullYear();
  const [best] = [year - 1, year, year + 1]
    .map((y) => new Date(Date.UTC(y, month - 1, day, 12)))
    .sort((a, b) => Math.abs(a.getTime() - was.getTime()) - Math.abs(b.getTime() - was.getTime()));
  // Keep the file's placeholder time: only the day is meaningful.
  return `${best.toISOString().slice(0, 10)}${current.slice(10)}`;
}

// Rebuild in the file's key order, so an imported score lands where a hand
// edit would have put it and the diff reads as the change it is.
function ordered(m: Match): Match {
  const { id, opponent, home, date, competition, status, score, round, kickoff, stadium, note, scorers, ...rest } = m;
  const all = { id, opponent, home, date, competition, status, score, round, kickoff, stadium, note, scorers, ...rest };
  // serializeSeasons would write an absent key out as `undefined`.
  return Object.fromEntries(Object.entries(all).filter(([, v]) => v !== undefined)) as Match;
}

async function update(match: Match, fixture: Fixture): Promise<Match> {
  const next: Match = { ...match, date: datedLike(match.date, fixture.day, fixture.month), kickoff: fixture.kickoff };
  if (!fixture.score) return ordered(next);

  const ours = match.home ? fixture.score.home : fixture.score.away;
  const theirs = match.home ? fixture.score.away : fixture.score.home;
  next.status = "played";
  next.score = { rsa: ours, opponent: theirs };

  const scorers = parseScorers(await pageHtml(fixture.url));
  const rsa = match.home ? scorers.home : scorers.away;
  const opponent = match.home ? scorers.away : scorers.home;
  // Fewer goals listed than scored is normal — own goals, scorers never
  // entered — but more means the page was misread, so nothing is written.
  for (const [who, list, goals] of [[US, rsa, ours], [match.opponent, opponent, theirs]] as const) {
    if (goalsListed(list) > goals) {
      throw new Error(`${match.id}: ${list.length} scorers account for ${goalsListed(list)} goals, but ${who} scored ${goals}`);
    }
  }
  if (rsa.length || opponent.length) {
    next.scorers = {
      ...match.scorers,
      ...(rsa.length ? { rsa } : {}),
      ...(opponent.length ? { opponent } : {}),
    };
  }
  return ordered(next);
}

async function importSeason(season: Season, { tid, round }: Source): Promise<string[]> {
  const log: string[] = [];
  const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

  for (const [i, match] of season.matches.entries()) {
    if (match.round === undefined) throw new Error(`${match.id} has no round to look it up by`);
    const fixtures = parseCalendar(await leagueHtml(`op=22&tid=${tid}&round=${round}&match_day=${match.round}`));
    const fixture = fixtures.find((f) => f.home === US || f.away === US);
    if (!fixture) throw new Error(`giornata ${match.round}: ${US} is not in upstream's calendar`);

    // The fixture list is ours to keep: if upstream disagrees about who we
    // play or where, something needs a human, not an overwrite.
    const upstreamHome = fixture.home === US;
    const upstreamOpponent = upstreamHome ? fixture.away : fixture.home;
    if (!same(upstreamOpponent, match.opponent) || upstreamHome !== match.home) {
      throw new Error(
        `giornata ${match.round}: we have ${match.home ? "home to" : "away at"} ${match.opponent}, ` +
          `upstream has ${upstreamHome ? "home to" : "away at"} ${upstreamOpponent}`,
      );
    }

    const next = await update(match, fixture);
    if (JSON.stringify(next) !== JSON.stringify(ordered(match))) {
      season.matches[i] = next;
      const result = next.score ? ` ${next.score.rsa}-${next.score.opponent}` : "";
      log.push(`  ${match.id} vs ${match.opponent}:${result} (${next.date.slice(0, 10)} ${next.kickoff})`);
    }
  }
  return log;
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

  const log = await importSeason(season, source);
  changed += log.length;
  console.log(`${id} (${source.label}): ${season.matches.length} fixtures` + (log.length ? " — updated" : " — unchanged"));
  for (const line of log) console.log(line);
}

if (changed) {
  await writeFile(DATA, serializeSeasons(seasons));
  console.log("\nsrc/data/seasons.json written. Review the diff, run `npm test`, then commit.");
} else {
  console.log("\nNothing to write.");
}
