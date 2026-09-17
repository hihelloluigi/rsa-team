// The site's languages. Italian is the default and keeps the unprefixed URLs it
// always had (/squad); English lives under /en (/en/squad). Internally both are
// routes under app/[lang] — next.config.ts rewrites an unprefixed path to /it,
// so nothing already shared, indexed or bookmarked had to move.
export const LOCALES = ["it", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "it";

export const hasLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

// BCP 47 tags for Intl and <html lang>; OpenGraph wants the underscore form.
export const INTL_LOCALES: Record<Locale, string> = { it: "it-IT", en: "en-GB" };
export const OG_LOCALES: Record<Locale, string> = { it: "it_IT", en: "en_GB" };

// The public URL of a page in a language: "/squad" is "/squad" in Italian and
// "/en/squad" in English. Every internal link goes through this, so an English
// visitor is never dropped back into Italian by a bare href.
export function localePath(lang: Locale, path: string): string {
  if (lang === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

// The reverse, for the navbar and the language switch, which only have the
// browser's pathname: "/en/squad" is { lang: "en", path: "/squad" }.
export function splitLocale(pathname: string): { lang: Locale; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (first && first !== DEFAULT_LOCALE && hasLocale(first)) {
    return { lang: first, path: `/${rest.join("/")}`.replace(/\/$/, "") || "/" };
  }
  return { lang: DEFAULT_LOCALE, path: pathname || "/" };
}

// `alternates` for a page's metadata: its canonical URL in this language plus
// the hreflang set, which is how a search engine offers each visitor the right
// version — nobody is redirected by their browser's language. Page-level
// `alternates` replaces the layout's rather than merging, so `types` (the
// calendar feed link) is passed through by the pages that want it.
export function pageAlternates(lang: Locale, path: string, types?: Record<string, string>) {
  return {
    canonical: localePath(lang, path),
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, localePath(l, path)])),
      "x-default": localePath(DEFAULT_LOCALE, path),
    },
    ...(types && { types }),
  };
}
