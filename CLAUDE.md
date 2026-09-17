# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> The import above is load-bearing: **Next.js 16 here diverges from training data.** Read the relevant guide under `node_modules/next/dist/docs/` before writing any Next.js code.

## Commands

```bash
npm run dev        # dev server on port 3002 (Turbopack)
npm run import:standings [seasonId]   # refresh the classifica from bergamotornei
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

**Content lives in `src/data/*.json`** (`players`, `seasons`, `club`, `sponsors`, `venues`) and is the only thing that changes for routine updates — there is no CMS or database.

**`src/lib/` is the data layer — go through it, never import JSON directly into components:**
- `types.ts` — Zod schemas are the single source of truth for content shape; all TS types are `z.infer` of them.
- `data.ts` — content access only: validates every JSON file **once at module load** (`Schema.parse(...)` throws at build time on bad data) and exposes the typed accessors.
- `matches.ts` — the pure helpers that compute over a season (`matchResult`, `matchSides`, `splitMatches`, `sortStandings`, `withRests`). Depends on `data.ts`, never the reverse.
- `format.ts` — the display layer: date formatting, `initials`, `instagramHandle`, and `positionLabels` (GK/DEF/MID/FWD → Italian POR/DIF/CEN/ATT — data keeps the English codes).
- `site.ts` — resolves the canonical origin for `metadataBase`/sitemap/robots (`NEXT_PUBLIC_SITE_URL` → Vercel production URL → localhost).

**Routes (`src/app/`, App Router):** `/`, `/squad` + `/squad/[slug]`, `/matches` + `/matches/[seasonId]/[matchId]`, `/club`, `/contact`, `/sponsor`, `/privacy`, `/terms`. Player and match detail pages are SSG via `generateStaticParams`; `/matches` is dynamic (reads `?season=` from `searchParams`). Components are **server components by default** — only `ContactForm`, `CookieNotice`, `Navbar`, `Reveal`, `SeasonSelect`, `ShareButton`, `ShirtViewer`, and `WinCelebration` are `"use client"`.

**3D shirt (`ShirtViewer`):** a `<model-viewer>` web component over `public/shirt/rsa-team-shirt.glb`
(3 MB). The viewer bundles three.js, so the component imports it only once the section scrolls
near; until then the tag is an unknown element showing the poster child. The poster is the GLB
rendered at the opening orbit on a transparent background — it is not a photo, so regenerate it
if the model or the opening `camera-orbit` changes. Its JSX attributes are declared in
`src/types/model-viewer.d.ts`; the element's own `:host` style fixes `height: 150px`, so the
`h-auto` in its class list is what lets the aspect ratio apply.

**Calendar feed:** `app/calendar.ics/route.ts` is a `force-static` route handler that
serves **every** season as iCalendar, built by `lib/calendar.ts`. A subscription mirrors
its feed — clients delete any event the feed stops listing — so never narrow this to the
current season: that would erase past fixtures from subscribers' calendars. For the same
reason event UIDs are namespaced to a constant, never the deploy URL, so a preview and
production mint the same UID for a fixture instead of duplicating it.
`matches/[seasonId]/calendar.ics` is the one-season variant, deliberately a **download**
rather than a second subscription — an import is additive, so it cannot later remove what
it added the way a narrowed feed would. The feed was first published as `/calendario.ics`,
which lives on in subscribers' calendar apps: `next.config.ts` rewrites (not redirects) it
to the feed, so never remove that rewrite.

**Instagram feed (`InstagramFeed`, `lib/instagram.ts`):** the one piece of the home page
that is not repo content. It reads the club's latest posts from the Instagram API with
`INSTAGRAM_ACCESS_TOKEN` and revalidates every six hours. That interval is a balance, so
don't shorten it casually: Instagram's CDN URLs are signed and expire in about four days
(the page must never be cached that long), but every API read returns freshly signed URLs
and each one is a new, billed `next/image` transformation. The optimiser is not optional —
Instagram serves originals, and one tile was a 4.6 MB JPEG.
Every failure, a missing token included, yields an empty list, and the section falls back
to the follow invitation alone (it owns that too — there is no separate "follow us"
section). The token dies 60 days after its last refresh, so `vercel.json` schedules
a weekly cron to `/api/cron/instagram-token`, which fails closed without `CRON_SECRET`.
With no token at build time `/` has no fetch and is fully static, so adding the token
needs a redeploy to take effect.

**Contact form (`/contact`, `/sponsor`, `lib/contact.ts`):** one form, two doors.
`/contact` is the general page; `/sponsor` is the sponsors' way in — the home page's pitch
above the same form, opened on the sponsor topic. Both render `ContactOptions`: the form,
plus a button that opens an Instagram DM. The topic (`CONTACT_TOPICS`) leads the email's
subject, so the inbox can be triaged at a glance. The server action emails the club through
Resend's REST API (plain `fetch`, no SDK) with the writer as `reply_to`. The form needs
`RESEND_API_KEY` and `CONTACT_INBOX` (one address or several, comma-separated); the pages
are prerendered, so without them they ship with the DM button alone, and setting them
needs a redeploy. The default sender is Resend's shared `onboarding@resend.dev`, which only
delivers to the Resend account's own address; set `CONTACT_FROM` once a domain is verified.
Spam is held off by a honeypot field only. The home page's pitch is `SponsorInvite`: the
whole sponsor section while `sponsors.json` is empty, a quieter strip under the logos once
it is not.

**Legal pages and the cookie notice (`/privacy`, `/terms`, `CookieNotice`):** the privacy
notice exists because the contact form collects names and emails (GDPR art. 13), and names
`club.dataController` — a person, since the club is not a legal entity. `CookieNotice` is a
notice, **not a consent banner**: the public site sets no cookie or storage that needs
consent (cookieless analytics, self-hosted fonts, Instagram stills proxied through
`next/image`), so there is nothing to accept. Its own dismissal flag in `localStorage` is the
only thing stored, and `/privacy#cookie` says so. Anything that changes this — a third-party
embed, an ad or analytics script that sets cookies, an iframe — needs a real consent banner
and a rewrite of that section first, and any new processor (a service that sees visitors'
data) has to be added to the list on `/privacy`.

**Admin (`/admin`):** a signed-in editor for match results that commits to
`seasons.json` through the GitHub Contents API — so an edit made from a phone lands
in git history, runs CI, and redeploys exactly like a hand edit. Sign-in is GitHub
OAuth restricted to `ADMIN_GITHUB_LOGIN`, and **fails closed**: with the variable
unset nobody can sign in. It writes via `serializeSeasons` (shared with the standings
importer) and re-parses through `SeasonsSchema` before committing, so an invalid edit
is rejected before it can break a build. `/admin` and `/api/` are the only dynamic
routes and are disallowed in `robots.ts`.

**SEO/PWA is wired through Next file conventions, not manual `<head>` tags:** `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, and the favicon/`icon`/`apple-icon`/`manifest.webmanifest` files. Metadata + Vercel Analytics/Speed Insights live in `app/layout.tsx`.

### Things that will bite you

- **Match data is RSA-centric** (`score.rsa` / `score.opponent`, `home: boolean`). For display, convert with `matchSides(match)` — do not re-derive home/away/score sides inline (that duplication was already removed once).
- **Venues are keyed by the `stadium` string, and are optional.** `venues.json`
  maps a ground's exact name to its address — ten of this season's twenty
  fixtures share one pitch, so an address per match would be the same address
  ten times. An unlisted ground shows its name with no directions, so a fixture
  can be added before anyone has looked the address up. A key matching no
  fixture fails `content.test.ts`, which is the detectable half of a typo.
  Addresses for the league's own grounds are published in its
  [pitch list PDF](https://cdn.enjore.com/wl/bergamotornei_com/doc/tournament_doc/65-1M5V4NhBNq-lista-campi-aggiornata.pdf).
- **A bye is not a match.** A giornata the team sits out lives in the season's
  `rests` array, not in `matches` — a `Match` always has an opponent, and
  weakening that would ripple through `matchResult`/`matchSides`. Rests carry
  only a `round`; `withRests` weaves them into the calendar by giornata, and they
  show in the upcoming list only.
- **Within a season, `standings` is maintained independently of `matches`** — editing a fixture score does NOT recompute the league table. Update both.
  `npm run import:standings` pulls the table from the league instead of retyping it;
  it reads an undocumented endpoint the site's own pages call (`op=20&tid=&round=`),
  maps columns by their header titles rather than position, refuses to write if the
  table does not balance or a club appears under an unknown spelling, and reproduces
  the file's one-object-per-line formatting so the diff stays readable.
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
- **Page `metadata.alternates` replaces the layout's, it does not merge.** Adding a
  `canonical` on a page silently drops the layout's `types` entry (the calendar feed
  link), so repeat what that page needs.
- Path alias: `@/*` → `src/*`.
