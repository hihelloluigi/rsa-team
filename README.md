<div align="center">

# ⚽ RSA TEAM

### *Più cuore che tattica, da sempre.*

The official website of **RSA TEAM** — an amateur football club from Bergamo that runs little, wins sometimes, and is fine with that. **Siamo matti.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-087EA4?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel)](https://vercel.com)

</div>

---

## What is this?

A fast, content-driven marketing site for the club: the squad roster, fixtures & results, the league table, and the club story — all in Italian. There's **no CMS and no database**. Every bit of content is a JSON file validated at build time, and almost every page is pre-rendered to static HTML. Editing the season means editing a file, not touching a server.

## Tech stack

| | |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack, React Server Components) |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS v4 (`@theme` tokens) |
| **Motion** | Framer Motion (`Reveal`), `canvas-confetti` (win celebrations) |
| **Icons** | react-icons |
| **Validation** | Zod — content schemas enforced at build time |
| **Tests** | Vitest |
| **Hosting** | Vercel (+ Analytics & Speed Insights) |

## Getting started

```bash
npm install
npm run dev          # http://localhost:3002
```

| Command | What it does |
|---------|--------------|
| `npm run dev` | Dev server on **port 3002** (Turbopack) |
| `npm run build` | Production build — **also validates all content JSON** |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Run the Vitest suite once |

> Run a single test: `npx vitest run src/lib/data.test.ts` &nbsp;·&nbsp; or by name: `npx vitest run -t "sortStandings"`

## How it's structured

```
src/
├─ app/                    # App Router pages, SEO files, layout
│  ├─ page.tsx             # Home
│  ├─ squad/               # Roster + [slug] player profiles  (SSG)
│  ├─ matches/             # Fixtures + [seasonId]/[matchId]  (SSG)
│  ├─ club/                # Club story
│  ├─ sitemap.ts • robots.ts • opengraph-image.tsx
│  └─ icon/apple-icon/manifest …   # favicons via file conventions
├─ components/             # Presentational components (server by default)
├─ data/                   # ← all site content lives here (JSON)
└─ lib/                    # The data layer (validation, accessors, helpers)
```

### The data pipeline (the important part)

The whole app is built around one rule: **content flows JSON → Zod → typed accessors → components.** Components never import JSON directly.

```
src/data/*.json  →  src/lib/types.ts   (Zod schemas = source of truth)
                 →  src/lib/data.ts     (validates at module load, exposes accessors)
                 →  pages & components   (consume typed data only)
```

- **`lib/types.ts`** — Zod schemas; every TypeScript type is inferred from them.
- **`lib/data.ts`** — parses the JSON **once at module load** (bad data throws and **fails the build**), then exposes typed accessors and pure helpers (`matchResult`, `matchSides`, `splitMatches`, `sortStandings`).
- Rendering is overwhelmingly **server components**; only `Navbar`, `Reveal`, `SeasonSelect`, and `WinCelebration` are client components.

## Editing content

All content lives in `src/data/`:

| File | Controls |
|------|----------|
| `players.json` | Squad roster (name, number, position, stats, bio, photo …) |
| `seasons.json` | Seasons — each with its own **fixtures** *and* **standings** |
| `club.json` | Club info (tagline, about, founded, ground, staff) |
| `sponsors.json` | Sponsor logos shown on the homepage |

**Good to know**
- Invalid JSON **breaks `npm run build`** — the Zod error tells you which field. Check the schemas in `src/lib/types.ts`.
- Within a season, `standings` is maintained **independently** of `matches`: editing a score does *not* recompute the table — update both.
- Player photos go in `public/players/` and are served through `next/image`.
- Invariants the schemas can't express (unique slugs/numbers/ids, one current season) are guarded by `src/lib/content.test.ts` — run `npm test` after editing.

## Routes

| Path | Page |
|------|------|
| `/` | Homepage — hero, season status, hot players, sponsors |
| `/squad` · `/squad/[slug]` | Full roster · individual player profile |
| `/matches` · `/matches/[seasonId]/[matchId]` | Fixtures & table · match detail |
| `/club` | Club information |

## SEO & performance

Wired through Next.js file conventions, not hand-written `<head>` tags:

- `sitemap.ts` / `robots.ts` generated from the real routes
- branded `opengraph-image.tsx` for link previews, plus Open Graph / Twitter metadata
- favicon, `icon`, `apple-icon`, and `manifest.webmanifest` via the metadata file conventions
- `next/image` for automatic WebP/AVIF, lazy-loading and zero layout shift
- **Vercel Analytics + Speed Insights** for real-user Core Web Vitals

## Deployment

Deploys to **Vercel** — push to `main` and Vercel builds and ships it. The build validates all content, so a bad data edit is caught before it goes live.

**Environment variables**

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | optional | Canonical origin for metadata/sitemap/robots. Defaults to Vercel's production URL, so you only need this once you have a custom domain. |
| `ALLOWED_DEV_ORIGINS` | optional | Comma-separated extra dev origins (local only). |

Canonical-URL resolution lives in `src/lib/site.ts`: `NEXT_PUBLIC_SITE_URL` → Vercel production URL → `localhost:3002`.

---

<div align="center">

**RSA TEAM** · Dal 2025 · [@rsafussball](https://www.instagram.com/rsafussball)

*Squadra che non gioca, non perde.*

</div>
