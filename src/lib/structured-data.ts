// schema.org structured-data builders. Each returns a plain object rendered
// via <JsonLd>. URLs are absolute (resolved against the canonical origin) so
// search engines can dereference the @id graph across pages.
import type { Club, Match, Player, Season } from "./types";
import { clubText, getClub } from "./data";
import { matchSides } from "./matches";
import { countryName } from "./format";
import { siteUrl } from "./site";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// Entity ids (#team, #person, #event) are the same in every language: they
// name the thing, and the English page describes the same team. Page URLs are
// the ones that differ.
const pageUrl = (lang: Locale, path: string) => `${siteUrl()}${localePath(lang, path)}`;

const teamId = () => `${siteUrl()}/#team`;

export function websiteLd(lang: Locale) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    name: getClub().name,
    url: pageUrl(lang, "/"),
    inLanguage: lang,
  };
}

export function sportsTeamLd(club: Club, lang: Locale) {
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
    slogan: clubText(lang).tagline,
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

export function playerLd(player: Player, lang: Locale) {
  const base = siteUrl();
  const nationality = countryName(player.nationalityCode, player.nationality, lang);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${base}/squad/${player.slug}#person`,
    name: player.name,
    ...(player.nickname && { alternateName: player.nickname }),
    url: pageUrl(lang, `/squad/${player.slug}`),
    ...(player.photo && { image: `${base}${player.photo}` }),
    ...(nationality && { nationality }),
    jobTitle: getDictionary(lang).positions.long[player.position],
    memberOf: { "@type": "SportsTeam", "@id": teamId(), name: getClub().name },
    ...(player.bio && { description: player.bio }),
  };
}

export function matchLd(season: Season, match: Match, lang: Locale) {
  const base = siteUrl();
  const { home, away } = matchSides(match);
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": `${base}/matches/${season.id}/${match.id}#event`,
    name: `${home} - ${away}`,
    sport: "Soccer",
    startDate: match.date,
    url: pageUrl(lang, `/matches/${season.id}/${match.id}`),
    homeTeam: { "@type": "SportsTeam", name: home },
    awayTeam: { "@type": "SportsTeam", name: away },
    ...(season.league && {
      superEvent: { "@type": "SportsEvent", name: season.league },
    }),
    ...(match.stadium && { location: { "@type": "Place", name: match.stadium } }),
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[], lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: pageUrl(lang, item.path),
    })),
  };
}
