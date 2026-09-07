import { getCurrentSeason } from "@/lib/data";
import { seasonCalendar } from "@/lib/calendar";
import { siteUrl } from "@/lib/site";

// Subscribers point at this one URL for good; it always serves whichever season
// is current, so the feed follows the site instead of being re-added each year.
export const dynamic = "force-static";

export function GET() {
  const season = getCurrentSeason();
  return new Response(seasonCalendar(season, siteUrl()), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="rsa-team-${season.id}.ics"`,
    },
  });
}
