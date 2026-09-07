import SeasonFixtures from "@/components/SeasonFixtures";
import { getCurrentSeason, getSeasons } from "@/lib/data";

const description =
  "Calendario, risultati e classifica dell'RSA TEAM, stagione per stagione. Tutte le partite del club amatoriale di Bergamo.";

export const metadata = {
  title: "Partite",
  description,
  // Page-level `alternates` replaces the layout's wholesale rather than merging,
  // so the feed link has to be repeated here — this is the page it belongs on.
  alternates: {
    canonical: "/matches",
    types: { "text/calendar": "/calendario.ics" },
  },
};

// The current season, prerendered. Past seasons live at /matches/[seasonId];
// this route reads no search params, which is what keeps it static.
export default function MatchesPage() {
  return <SeasonFixtures season={getCurrentSeason()} seasons={getSeasons()} />;
}
