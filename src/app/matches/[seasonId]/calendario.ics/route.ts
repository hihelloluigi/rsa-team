import { getSeasonById, getSeasons } from "@/lib/data";
import { fixturesCalendar } from "@/lib/calendar";
import { siteUrl } from "@/lib/site";

// A one-off export of a single season, offered alongside the whole-archive
// subscription at /calendario.ics. This is a download rather than a feed: an
// import is additive and permanent, so unlike a narrowed subscription it can
// never later remove the events it added.
export const dynamic = "force-static";

export function generateStaticParams() {
  return getSeasons().map((s) => ({ seasonId: s.id }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ seasonId: string }> },
) {
  const { seasonId } = await params;
  const season = getSeasonById(seasonId);
  if (!season) return new Response(null, { status: 404 });

  return new Response(fixturesCalendar([season], siteUrl()), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="rsa-team-${season.id}.ics"`,
    },
  });
}
