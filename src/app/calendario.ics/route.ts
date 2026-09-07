import { getSeasons } from "@/lib/data";
import { fixturesCalendar } from "@/lib/calendar";
import { siteUrl } from "@/lib/site";

// Subscribers point at this one URL for good, and it carries every season — a
// subscription mirrors its feed, so dropping past seasons would delete them
// from subscribers' calendars rather than just hiding them here.
export const dynamic = "force-static";

export function GET() {
  return new Response(fixturesCalendar(getSeasons(), siteUrl()), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="rsa-team.ics"',
    },
  });
}
