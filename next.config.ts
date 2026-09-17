import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Instagram feed's stills. Instagram serves originals — one 157px tile
  // was a 4.6 MB JPEG — so they go through the optimiser, which needs the CDN
  // allowed here. The subdomain names an edge node and varies per image.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
    ],
  },
  // Seasons used to be a query param on /matches; they are their own
  // prerendered routes now. Existing links and bookmarks are redirected rather
  // than quietly served the wrong season, which is what would happen otherwise
  // — a static page ignores the query string.
  async redirects() {
    return [
      {
        source: "/matches",
        has: [{ type: "query", key: "season", value: "(?<seasonId>[^&]+)" }],
        destination: "/matches/:seasonId",
        permanent: true,
      },
      // The one-season calendar is a download reached from a link on the site,
      // so a redirect is enough for any copy of the old Italian URL.
      {
        source: "/matches/:seasonId/calendario.ics",
        destination: "/matches/:seasonId/calendar.ics",
        permanent: true,
      },
    ];
  },
  // The calendar feed was first published as /calendario.ics, and that URL is
  // stored inside subscribers' calendar apps, where nobody will ever update it.
  // A rewrite, not a redirect: the old address keeps answering with the feed
  // itself, so nothing depends on how a given calendar client treats a 301 — a
  // client that drops the subscription would take every fixture with it.
  async rewrites() {
    return [{ source: "/calendario.ics", destination: "/calendar.ics" }];
  },
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS
  ? process.env.ALLOWED_DEV_ORIGINS.split(",")
  : [],
};

export default nextConfig;
