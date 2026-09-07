import { notFound } from "next/navigation";
import SeasonFixtures from "@/components/SeasonFixtures";
import { getSeasonById, getSeasons } from "@/lib/data";

type Params = Promise<{ seasonId: string }>;

export function generateStaticParams() {
  return getSeasons().map((s) => ({ seasonId: s.id }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { seasonId } = await params;
  const season = getSeasonById(seasonId);
  if (!season) return { title: "Partite" };
  return {
    title: `Partite ${season.label}`,
    description: `Calendario, risultati e classifica dell'RSA TEAM nella stagione ${season.label}.`,
    alternates: {
      // The current season is also served at /matches, which is where it is
      // linked from; point there so the two URLs are not read as duplicates.
      canonical: season.current ? "/matches" : `/matches/${season.id}`,
      types: { "text/calendar": `/matches/${season.id}/calendario.ics` },
    },
  };
}

export default async function SeasonPage({ params }: { params: Params }) {
  const { seasonId } = await params;
  const season = getSeasonById(seasonId);
  if (!season) notFound();
  return <SeasonFixtures season={season} seasons={getSeasons()} />;
}
