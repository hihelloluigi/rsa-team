import SeasonFixtures from "@/components/SeasonFixtures";
import { getCurrentSeason, getSeasons } from "@/lib/data";
import { pageAlternates } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

export async function generateMetadata() {
  const { t, lang } = await getI18n();
  return {
    title: t.matches.metaTitle,
    description: t.matches.metaDescription,
    // Page-level `alternates` replaces the layout's wholesale rather than
    // merging, so the feed link is repeated here — this is the page it belongs on.
    alternates: pageAlternates(lang, "/matches", { "text/calendar": "/calendar.ics" }),
  };
}

// The current season, prerendered. Past seasons live at /matches/[seasonId];
// this route reads no search params, which is what keeps it static.
export default function MatchesPage() {
  return <SeasonFixtures season={getCurrentSeason()} seasons={getSeasons()} />;
}
