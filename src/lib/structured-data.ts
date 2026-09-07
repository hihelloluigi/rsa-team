// schema.org structured-data builders. Each returns a plain object rendered
// via <JsonLd>. URLs are absolute (resolved against the canonical origin) so
// search engines can dereference the @id graph across pages.
import type { Club, Match, Player, Season } from "./types";
import { getClub } from "./data";
import { matchSides } from "./matches";
import { positionNames } from "./format";
import { siteUrl } from "./site";

const teamId = () => `${siteUrl()}/#team`;

export function websiteLd() {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    name: getClub().name,
    url: base,
    inLanguage: "it",
  };
}

export function sportsTeamLd(club: Club) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    "@id": teamId(),
    name: club.name,
    alternateName: "RSA",
    sport: "Soccer",
    foundingDate: String(club.founded),
    url: base,
    logo: `${base}/icon.svg`,
    image: `${base}/opengraph-image`,
    slogan: club.tagline,
    ...(club.instagram && { sameAs: [club.instagram] }),
    ...(club.ground && {
      location: {
        "@type": "Place",
        name: club.ground,
        ...(club.groundAddress && {
          address: { "@type": "PostalAddress", streetAddress: club.groundAddress },
        }),
      },
    }),
  };
}

export function playerLd(player: Player) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${base}/squad/${player.slug}#person`,
    name: player.name,
    ...(player.nickname && { alternateName: player.nickname }),
    url: `${base}/squad/${player.slug}`,
    ...(player.photo && { image: `${base}${player.photo}` }),
    ...(player.nationality && { nationality: player.nationality }),
    jobTitle: positionNames[player.position],
    memberOf: { "@type": "SportsTeam", "@id": teamId(), name: getClub().name },
    ...(player.bio && { description: player.bio }),
  };
}

export function matchLd(season: Season, match: Match) {
  const base = siteUrl();
  const { home, away } = matchSides(match);
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": `${base}/matches/${season.id}/${match.id}#event`,
    name: `${home} - ${away}`,
    sport: "Soccer",
    startDate: match.date,
    url: `${base}/matches/${season.id}/${match.id}`,
    homeTeam: { "@type": "SportsTeam", name: home },
    awayTeam: { "@type": "SportsTeam", name: away },
    ...(season.league && {
      superEvent: { "@type": "SportsEvent", name: season.league },
    }),
    ...(match.stadium && { location: { "@type": "Place", name: match.stadium } }),
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${base}${item.path}`,
    })),
  };
}
