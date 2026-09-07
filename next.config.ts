import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS
  ? process.env.ALLOWED_DEV_ORIGINS.split(",")
  : [],
};

export default nextConfig;
