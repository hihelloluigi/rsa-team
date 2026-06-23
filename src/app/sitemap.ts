import type { MetadataRoute } from "next";
import { getPlayers, getSeasons } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  const staticRoutes = ["/", "/squad", "/matches", "/club"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  const playerRoutes = getPlayers().map((p) => ({
    url: `${base}/squad/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const matchRoutes = getSeasons().flatMap((s) =>
    s.matches.map((m) => ({
      url: `${base}/matches/${s.id}/${m.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  );

  return [...staticRoutes, ...playerRoutes, ...matchRoutes];
}
