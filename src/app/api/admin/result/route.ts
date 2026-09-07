import { z } from "zod";
import { auth } from "@/auth";
import { SeasonsSchema } from "@/lib/types";
import { serializeSeasons } from "@/lib/seasons-file";
import { commitFileToRepo, readFileFromRepo } from "@/lib/github";

const PATH = "src/data/seasons.json";

// Scores are stored RSA-first (see CLAUDE.md), and the form asks for them that
// way too, so nothing has to be flipped between the two.
const Body = z.object({
  seasonId: z.string().min(1),
  matchId: z.string().min(1),
  status: z.enum(["played", "upcoming", "postponed"]),
  rsa: z.number().int().min(0).max(99).optional(),
  opponent: z.number().int().min(0).max(99).optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.githubToken) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }

  const parsed = Body.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const { seasonId, matchId, status, rsa, opponent } = parsed.data;
  if (status === "played" && (rsa === undefined || opponent === undefined)) {
    return Response.json({ error: "A played match needs both scores." }, { status: 400 });
  }

  try {
    const { text, sha } = await readFileFromRepo(session.githubToken, PATH);
    const seasons = SeasonsSchema.parse(JSON.parse(text));

    const season = seasons.find((s) => s.id === seasonId);
    const match = season?.matches.find((m) => m.id === matchId);
    if (!season || !match) {
      return Response.json({ error: "That match no longer exists." }, { status: 404 });
    }

    match.status = status;
    if (status === "played") {
      match.score = { rsa: rsa!, opponent: opponent! };
    } else {
      // An upcoming or postponed fixture has no score; leaving a stale one would
      // fail the schema's own rule about which matches may carry a result.
      delete match.score;
    }

    // The same validation the build runs, before anything is committed — a bad
    // edit is rejected here rather than breaking the next deploy.
    const next = serializeSeasons(SeasonsSchema.parse(seasons));

    const url = await commitFileToRepo(session.githubToken, {
      path: PATH,
      text: next,
      sha,
      message: `content(matches): update ${season.label} ${match.opponent}`,
    });
    return Response.json({ ok: true, commit: url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return Response.json({ error: message }, { status: 500 });
  }
}
