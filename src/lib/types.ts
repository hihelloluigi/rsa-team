import { z } from "zod";

export const PositionSchema = z.enum(["GK", "DEF", "MID", "FWD"]);
export type Position = z.infer<typeof PositionSchema>;

export const PlayerStatsSchema = z.object({
  appearances: z.number().int().nonnegative(),
  goals: z.number().int().nonnegative(),
  assists: z.number().int().nonnegative(),
  cleanSheets: z.number().int().nonnegative(),
  motm: z.number().int().nonnegative(),
});

export const PlayerSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug must be url-safe kebab-case"),
  name: z.string().min(1),
  nickname: z.string().min(1).optional(),
  number: z.number().int().min(1).max(99),
  position: PositionSchema,
  // Everything below is optional so players can be added with minimal info
  // and fleshed out later.
  nationality: z.string().min(1).optional(),
  nationalityCode: z.string().length(2).optional(),
  age: z.number().int().min(14).max(50).optional(),
  photo: z.string().optional(),
  stats: PlayerStatsSchema.optional(),
  bio: z.string().min(1).optional(),
  joined: z.string().min(1).optional(),
});
export type Player = z.infer<typeof PlayerSchema>;

// "postponed" is a fixture that was scheduled and did not happen — common in
// an amateur league. It keeps its original date so the calendar can still
// show when it should have been played.
export const MatchStatusSchema = z.enum(["played", "upcoming", "postponed"]);
export type MatchStatus = z.infer<typeof MatchStatusSchema>;

export const MatchSchema = z
  .object({
    id: z.string().min(1),
    opponent: z.string().min(1),
    home: z.boolean(),
    // ISO 8601 with an explicit offset. The time part is a placeholder —
    // the real kickoff hour lives in `kickoff`.
    date: z.iso.datetime({ offset: true }),
    competition: z.string().min(1),
    status: MatchStatusSchema,
    score: z
      .object({ rsa: z.number().int().nonnegative(), opponent: z.number().int().nonnegative() })
      .optional(),
    // Giornata number. Optional: older seasons were entered without it.
    round: z.number().int().positive().optional(),
    // 24h "HH:MM" — rendered verbatim in fixture lists, so the shape matters.
    kickoff: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "kickoff must be 24h HH:MM")
      .optional(),
    stadium: z.string().min(1).optional(),
    note: z.string().min(1).optional(),
    scorers: z
      .object({
        rsa: z.array(z.string().min(1)).optional(),
        opponent: z.array(z.string().min(1)).optional(),
      })
      .optional(),
  })
  .refine((m) => m.status !== "played" || m.score !== undefined, {
    message: "played matches must include a score",
  });
export type Match = z.infer<typeof MatchSchema>;

export const StandingRowSchema = z.object({
  team: z.string().min(1),
  played: z.number().int().nonnegative(),
  won: z.number().int().nonnegative(),
  drawn: z.number().int().nonnegative(),
  lost: z.number().int().nonnegative(),
  goalsFor: z.number().int().nonnegative(),
  goalsAgainst: z.number().int().nonnegative(),
  points: z.number().int().nonnegative(),
  isRSA: z.boolean().optional(),
});
export type StandingRow = z.infer<typeof StandingRowSchema>;

export const ClubSchema = z.object({
  name: z.string().min(1),
  founded: z.number().int(),
  ground: z.string().min(1),
  groundAddress: z.string().min(1).optional(),
  groundMapUrl: z.url().optional(),
  instagram: z.url().optional(),
  tagline: z.string().min(1),
  about: z.string().min(1),
  staff: z.array(z.object({ name: z.string().min(1), role: z.string().min(1) })),
});
export type Club = z.infer<typeof ClubSchema>;

export const PlayersSchema = z.array(PlayerSchema);
export const MatchesSchema = z.array(MatchSchema);
export const StandingsSchema = z.array(StandingRowSchema);

// A "turno di riposo": a giornata the team sits out because the girone has an
// odd number of teams. It is deliberately NOT a Match — a match always has an
// opponent, and weakening that would ripple through matchResult/matchSides.
// A bye has no date of its own either, only the round it displaces.
export const RestSchema = z.object({
  round: z.number().int().positive(),
});
export type Rest = z.infer<typeof RestSchema>;
export const RestsSchema = z.array(RestSchema);

export const SeasonSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  current: z.boolean().optional(),
  league: z.string().min(1).optional(),
  leagueUrl: z.url().optional(),
  matches: MatchesSchema,
  // Defaulted so seasons entered before byes were modelled still parse.
  rests: RestsSchema.default([]),
  standings: StandingsSchema,
});
export const SeasonsSchema = z.array(SeasonSchema);
export type Season = z.infer<typeof SeasonSchema>;

export const SponsorSchema = z.object({
  name: z.string().min(1),
  logo: z.string().optional(),
  url: z.url().optional(),
});
export const SponsorsSchema = z.array(SponsorSchema);
export type Sponsor = z.infer<typeof SponsorSchema>;

export type MatchResult = "W" | "D" | "L";
