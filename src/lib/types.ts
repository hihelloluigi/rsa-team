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
  number: z.number().int().min(1).max(99),
  position: PositionSchema,
  nationality: z.string().min(1),
  nationalityCode: z.string().length(2),
  age: z.number().int().min(14).max(50),
  photo: z.string().optional(),
  stats: PlayerStatsSchema,
  bio: z.string().min(1),
  joined: z.string().min(1),
});
export type Player = z.infer<typeof PlayerSchema>;

export const MatchStatusSchema = z.enum(["played", "upcoming"]);
export type MatchStatus = z.infer<typeof MatchStatusSchema>;

export const MatchSchema = z
  .object({
    id: z.string().min(1),
    opponent: z.string().min(1),
    home: z.boolean(),
    date: z.string().datetime({ offset: true }).or(z.string().min(1)),
    competition: z.string().min(1),
    status: MatchStatusSchema,
    score: z
      .object({ rsa: z.number().int().nonnegative(), opponent: z.number().int().nonnegative() })
      .optional(),
  })
  .refine((m) => m.status === "upcoming" || m.score !== undefined, {
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
  groundMapUrl: z.string().url().optional(),
  tagline: z.string().min(1),
  about: z.string().min(1),
  staff: z.array(z.object({ name: z.string().min(1), role: z.string().min(1) })),
});
export type Club = z.infer<typeof ClubSchema>;

export const PlayersSchema = z.array(PlayerSchema);
export const MatchesSchema = z.array(MatchSchema);
export const StandingsSchema = z.array(StandingRowSchema);

export const SeasonSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  current: z.boolean().optional(),
  league: z.string().min(1).optional(),
  leagueUrl: z.string().url().optional(),
  matches: MatchesSchema,
  standings: StandingsSchema,
});
export const SeasonsSchema = z.array(SeasonSchema);
export type Season = z.infer<typeof SeasonSchema>;

export type MatchResult = "W" | "D" | "L";
