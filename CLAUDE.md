# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> The import above is load-bearing: **Next.js 16 here diverges from training data.** Read the relevant guide under `node_modules/next/dist/docs/` before writing any Next.js code.

## Commands

```bash
npm run dev        # dev server on port 3002 (Turbopack)
npm run build      # production build — also validates all content JSON (see below)
npm run lint       # ESLint with --fix
npm run lint:check # ESLint, no writes — this is what CI runs
npm run typecheck  # tsc --noEmit
npm test           # Vitest, run once

npx vitest run src/lib/data.test.ts          # single test file
npx vitest run -t "sortStandings"            # single test by name
```

CI (`.github/workflows/ci.yml`) runs `lint:check`, `typecheck`, `test` and `build`
as four parallel jobs on every PR and push to `main`. Deploys are **not** in the
workflow — Vercel's Git integration handles them.

`npm run build` parses every content file through its Zod schema at module load, so **invalid content JSON fails the build** rather than rendering broken pages.

## Architecture

A content-driven, statically-generated site (Italian-language) for an amateur football club. The defining pattern is a **strict data pipeline**: JSON content → Zod validation → typed accessors → server components.

**Content lives in `src/data/*.json`** (`players`, `seasons`, `club`, `sponsors`) and is the only thing that changes for routine updates — there is no CMS or database.

**`src/lib/` is the data layer — go through it, never import JSON directly into components:**
- `types.ts` — Zod schemas are the single source of truth for content shape; all TS types are `z.infer` of them.
- `data.ts` — content access only: validates every JSON file **once at module load** (`Schema.parse(...)` throws at build time on bad data) and exposes the typed accessors.
- `matches.ts` — the pure helpers that compute over a season (`matchResult`, `matchSides`, `splitMatches`, `sortStandings`, `withRests`). Depends on `data.ts`, never the reverse.
- `format.ts` — the display layer: date formatting, `initials`, `instagramHandle`, and `positionLabels` (GK/DEF/MID/FWD → Italian POR/DIF/CEN/ATT — data keeps the English codes).
- `site.ts` — resolves the canonical origin for `metadataBase`/sitemap/robots (`NEXT_PUBLIC_SITE_URL` → Vercel production URL → localhost).

**Routes (`src/app/`, App Router):** `/`, `/squad` + `/squad/[slug]`, `/matches` + `/matches/[seasonId]/[matchId]`, `/club`. Player and match detail pages are SSG via `generateStaticParams`; `/matches` is dynamic (reads `?season=` from `searchParams`). Components are **server components by default** — only `Navbar`, `Reveal`, `SeasonSelect`, and `WinCelebration` are `"use client"`.

**SEO/PWA is wired through Next file conventions, not manual `<head>` tags:** `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, and the favicon/`icon`/`apple-icon`/`manifest.webmanifest` files. Metadata + Vercel Analytics/Speed Insights live in `app/layout.tsx`.

### Things that will bite you

- **Match data is RSA-centric** (`score.rsa` / `score.opponent`, `home: boolean`). For display, convert with `matchSides(match)` — do not re-derive home/away/score sides inline (that duplication was already removed once).
- **A bye is not a match.** A giornata the team sits out lives in the season's
  `rests` array, not in `matches` — a `Match` always has an opponent, and
  weakening that would ripple through `matchResult`/`matchSides`. Rests carry
  only a `round`; `withRests` weaves them into the calendar by giornata, and they
  show in the upcoming list only.
- **Within a season, `standings` is maintained independently of `matches`** — editing a fixture score does NOT recompute the league table. Update both.
- **Content invariants the schemas can't express** (unique player slugs/numbers, unique match ids, ≤1 current season) are guarded by `src/lib/content.test.ts`, not Zod. Run the tests after editing content.
- **Never format a match date inline.** Pages are prerendered, so `toLocaleDateString`
  without an explicit `timeZone` renders in the *build machine's* zone — UTC on
  Vercel, CET locally. Use `matchDateShort`/`matchDateLong` from `lib/format.ts`,
  which pin `Europe/Rome`.
- **A match's kickoff hour lives in `kickoff`, not `date`.** The time component of
  `date` is a placeholder (`T12:00:00+00:00`); only the day is meaningful.
- **Club identity comes from `club.json`, never a literal.** The club name and
  Instagram URL are content: `matchSides` and the structured-data builders read
  `club.name`, and the footer and home page read `club.instagram`.
- **Repeated UI is a component, not a class string** (`ButtonLink`, `Scoreline`,
  `PlayerPortrait`, `Eyebrow`). These were copy-pasted and had already drifted
  apart; add call sites rather than re-pasting the classes.
- **Small-caps tracking is a named scale**, declared in `globals.css`:
  `tracking-eyebrow` (0.3em, `text-xs` captions) and `tracking-subhead` (0.2em,
  `text-sm` group headings). Tracking widens as text shrinks — don't reach for an
  arbitrary `tracking-[…]` value.
- Path alias: `@/*` → `src/*`.
