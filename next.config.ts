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
      // Italian is served unprefixed, so its internal /it address must not be
      // a second, duplicate URL for every page.
      { source: "/it", destination: "/", permanent: true },
      // The share images are the exception: Next writes their og:image URL with
      // the internal /it prefix, and a crawler fetching a card should get the
      // image, not a redirect to follow.
      {
        source: "/it/:path((?!.*opengraph-image).*)",
        destination: "/:path",
        permanent: true,
      },
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
    return {
      beforeFiles: [
        { source: "/calendario.ics", destination: "/calendar.ics" },
        // Italian, the default language, keeps the unprefixed URLs it always
        // had: every page lives under app/[lang], and a path with no language
        // in front is served from /it. A rewrite in the router rather than a
        // proxy, so the pages stay static files with no function in front of
        // them. Left alone: /en, the non-page routes, Next's own paths, and
        // anything with a dot — files in /public and the metadata routes
        // (sitemap.xml, robots.txt, calendar.ics, the icons).
        { source: "/", destination: "/it" },
        {
          source: "/:path((?!it/|en/|it$|en$|api/|admin|_next/|_vercel/|.*\\.).*)",
          destination: "/it/:path",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS
  ? process.env.ALLOWED_DEV_ORIGINS.split(",")
  : [],
};

export default nextConfig;
