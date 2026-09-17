import { lang as rootLang } from "next/root-params";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, hasLocale, localePath, type Locale } from "./config";
import { getDictionary } from "./dictionaries";

// The language of the page being rendered, with its dictionary and a link
// helper bound to it. Read from the [lang] root parameter, so any server
// component can call this without the language being threaded down as a prop.
// Route handlers (the OG images) and server actions cannot read root
// parameters: they pass the language they were given instead.
export async function getI18n(explicit?: string) {
  const value = explicit ?? (await rootLang()) ?? DEFAULT_LOCALE;
  if (!hasLocale(value)) notFound();
  const lang: Locale = value;
  return {
    lang,
    t: getDictionary(lang),
    href: (path: string) => localePath(lang, path),
  };
}
