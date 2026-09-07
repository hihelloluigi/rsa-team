import type { MetadataRoute } from "next";
import { getPlayers, getSeasons } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const seasons = getSeasons();

  // `lastModified` is only worth sending when it means something. Stamping the
  // build time would claim every page changed on every deploy, and a fixture's
  // own date is in the future until it is played — a sitemap that dates pages
  // in the future is one a crawler learns to ignore. So a date is emitted only
  // once it has passed, and pages with no date of their own omit it entirely.
  const now = Date.now();
  const past = (iso: string): Date | undefined => {
    const d = new Date(iso);
    return d.getTime() <= now ? d : undefined;
  };

  // The site's content last changed when the most recent fixture was played.
  const lastPlayed = seasons
    .flatMap((s) => s.matches)
    .filter((m) => m.status === "played")
    .map((m) => new Date(m.date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const staticRoutes = ["/", "/squad", "/matches", "/club"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.8,
    // The home and fixture pages move with the calendar; the squad and club
    // pages do not, so they say nothing rather than something untrue.
    ...(lastPlayed && (path === "/" || path === "/matches")
      ? { lastModified: lastPlayed }
      : {}),
  }));

  // Past seasons only: the current one is served at /matches and canonicals
  // there, so listing it twice would offer a duplicate.
  const seasonRoutes = seasons
    .filter((s) => !s.current)
    .map((s) => ({
      url: `${base}/matches/${s.id}`,
      ...(lastPlayed ? { lastModified: lastPlayed } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const playerRoutes = getPlayers().map((p) => ({
    url: `${base}/squad/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const matchRoutes = seasons.flatMap((s) =>
    s.matches.map((m) => ({
      url: `${base}/matches/${s.id}/${m.id}`,
      ...(past(m.date) ? { lastModified: past(m.date) } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  );

  return [...staticRoutes, ...seasonRoutes, ...playerRoutes, ...matchRoutes];
}
