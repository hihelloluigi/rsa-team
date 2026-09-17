import { notFound } from "next/navigation";
import SeasonFixtures from "@/components/SeasonFixtures";
import { getSeasonById, getSeasons } from "@/lib/data";
import { pageAlternates } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

type Params = Promise<{ seasonId: string }>;

export function generateStaticParams() {
  return getSeasons().map((s) => ({ seasonId: s.id }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { seasonId } = await params;
  const { t, lang } = await getI18n();
  const season = getSeasonById(seasonId);
  if (!season) return { title: t.matches.metaTitle };
  return {
    title: t.matches.seasonMetaTitle(season.label),
    description: t.matches.seasonMetaDescription(season.label),
    // The current season is also served at /matches, which is where it is
    // linked from; point there so the two URLs are not read as duplicates.
    alternates: pageAlternates(lang, season.current ? "/matches" : `/matches/${season.id}`, {
      "text/calendar": `/matches/${season.id}/calendar.ics`,
    }),
  };
}

export default async function SeasonPage({ params }: { params: Params }) {
  const { seasonId } = await params;
  const season = getSeasonById(seasonId);
  if (!season) notFound();
  return <SeasonFixtures season={season} seasons={getSeasons()} />;
}
