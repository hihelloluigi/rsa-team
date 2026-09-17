import { refreshInstagramToken } from "@/lib/instagram";

// Called weekly by the Vercel cron in vercel.json. An Instagram token dies 60
// days after it was last refreshed, and nothing on the site would say so — the
// feed section would just quietly disappear — so it is extended on a schedule
// rather than by whoever remembers.
//
// Vercel signs its cron calls with `Authorization: Bearer $CRON_SECRET`. Like
// the admin sign-in this fails closed: with the variable unset nobody gets in.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return Response.json({ ok: true, skipped: "No token configured." });

  try {
    const refreshed = await refreshInstagramToken(token);
    // A refresh has always extended the same token, but the API's contract is
    // only "here is a token". If it ever hands back a different one, the one in
    // the environment stops being extended — say so where it will be seen.
    const rotated = refreshed.token !== token;
    if (rotated) {
      console.error(
        "Instagram returned a different token on refresh: INSTAGRAM_ACCESS_TOKEN must be replaced by hand.",
      );
    }
    return Response.json({ ok: true, expiresInDays: refreshed.expiresInDays, rotated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    console.error(message);
    return Response.json({ error: message }, { status: 500 });
  }
}
