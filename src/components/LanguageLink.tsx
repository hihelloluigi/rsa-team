"use client";
import { usePathname } from "next/navigation";
import { FaGlobe } from "react-icons/fa6";
import { LOCALES, localePath, splitLocale, type Locale } from "@/i18n/config";

// The way into the other language. With only two languages there is nothing to
// choose between, so this is a single quiet link rather than a toggle or a
// menu: a globe, and the other language's name written out in that language
// ("English" on the Italian pages). Not "EN" — abbreviations are what browser
// auto-translation mangles, and they mean little to someone who cannot read
// the page they are on. It appears in the header, where people look first, and
// in the footer, where they look next.
//
// It leads to the same page, not the home: the path under the language prefix
// is carried over. A plain anchor, so the whole document — <html lang>
// included — is loaded fresh rather than patched in place.
export default function LanguageLink({
  lang,
  label,
  ariaLabel,
  className = "",
}: {
  lang: Locale;
  // The other language's own name, and the sentence read out for it.
  label: string;
  ariaLabel: string;
  className?: string;
}) {
  const { path } = splitLocale(usePathname());
  const other = LOCALES.find((l) => l !== lang) ?? lang;
  return (
    <a
      href={localePath(other, path)}
      hrefLang={other}
      lang={other}
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1.5 text-xs text-muted transition hover:text-accent ${className}`.trimEnd()}
    >
      <FaGlobe size={12} aria-hidden="true" />
      {label}
    </a>
  );
}
