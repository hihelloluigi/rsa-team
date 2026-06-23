# RSA TEAM

Website for RSA TEAM, an amateur football club. The site language is Italian.

## Tech stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — page animations via the `Reveal` component
- **react-icons** — SVG icon components
- **Zod** — runtime data validation for content JSON files

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3002](http://localhost:3002).

## Editing content

All site content lives in `src/data/`:

| File | What it controls |
|------|-----------------|
| `src/data/players.json` | Squad roster (name, number, position, bio, …) |
| `src/data/seasons.json` | Seasons, each with its own fixtures **and** standings table |
| `src/data/club.json` | Club info (tagline, about, founded, ground, staff) |
| `src/data/sponsors.json` | Sponsor logos shown on the homepage |

The homepage hero copy comes from `club.json` (`tagline`) — there is no separate home data file.

Within a season, `standings` is maintained **independently** of `matches`: editing a fixture's score does not recompute the league table, so update both if you want them to agree.

Data is validated by Zod schemas at build time — invalid JSON **will break `npm run build`**. Check the schema files in `src/lib/` if you get a validation error.

## Routes

| Path | Page |
|------|------|
| `/` | Homepage |
| `/squad` | Full squad roster |
| `/squad/[slug]` | Individual player profile |
| `/matches` | Fixtures & results |
| `/club` | Club information |

## Other commands

```bash
npm run build   # Production build (validates data)
npm run lint    # ESLint
npm test        # Vitest unit tests
```
