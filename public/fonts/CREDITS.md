# Font credits

| File | Font | Source |
|------|------|--------|
| `Anton-Regular.ttf` | Anton Regular | https://github.com/google/fonts/tree/main/ofl/anton |

**License:** [SIL Open Font License 1.1](https://openfontlicense.org) — © 2020 The Anton Project
Authors. Free to use, embed and redistribute, including commercially; the font itself may not be
sold on its own, and any modified version must keep the OFL and drop the reserved name.

## Why the file is here at all

The pages load Anton through `next/font/google` (see `src/app/layout.tsx`) and never touch this
copy. It exists for the share-card renderer in
`src/app/matches/[seasonId]/[matchId]/opengraph-image.tsx`: that runs outside the browser, cannot
reach `next/font`, and needs the raw font bytes handed to it. It sits in `public/` because Next
guarantees that directory is present both at build time and at runtime.
