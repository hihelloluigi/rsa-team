"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";

import LanguageLink from "@/components/LanguageLink";
import { localePath, splitLocale, type Locale } from "@/i18n/config";

export default function Navbar({
  lang,
  links: paths,
  clubName,
  labels,
}: {
  lang: Locale;
  // Language-neutral paths ("/squad"); the hrefs are built here.
  links: { path: string; label: string }[];
  clubName: string;
  labels: {
    openMenu: string;
    closeMenu: string;
    language: string;
    switchLabel: string;
    switchAria: string;
  };
}) {
  // The browser's path, language prefix and all; `path` is the page underneath
  // it, which is what the links are compared against.
  const { path } = splitLocale(usePathname());
  const [open, setOpen] = useState(false);

  const links = paths.map((l) => ({ ...l, href: localePath(lang, l.path) }));

  const isActive = (target: string) =>
    target === "/" ? path === "/" : path === target || path.startsWith(target + "/");

  return (
    <header className="sticky top-0 z-50 bg-bg/90 backdrop-blur border-b border-white/10">
      <nav className="mx-auto max-w-6xl px-4 sm:px-5 h-16 flex items-center justify-between">
        <Link href={localePath(lang, "/")} onClick={() => setOpen(false)} className="shrink-0">
          {/* SVG crest — served as-is (vectors need no next/image optimization). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt={clubName} className="h-14 w-14" />
        </Link>

        {/* Desktop links */}
        <ul className="hidden sm:flex items-center gap-2">
          {links.map((l) => {
            const active = isActive(l.path);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest transition ${
                    active ? "bg-accent text-white" : "text-muted hover:text-fg"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li className="ml-3 border-l border-white/10 pl-4">
            <LanguageLink lang={lang} label={labels.switchLabel} ariaLabel={labels.switchAria} />
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? labels.closeMenu : labels.openMenu}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="sm:hidden -mr-2 p-2 text-fg hover:text-accent transition"
        >
          {open ? <FaXmark size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {open && (
        <div id="mobile-menu" className="sm:hidden border-t border-white/10 bg-bg">
          <ul>
            {links.map((l) => {
              const active = isActive(l.path);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block border-b border-white/5 px-5 py-4 text-sm font-extrabold uppercase tracking-widest transition ${
                      active ? "bg-accent/10 text-accent" : "text-muted hover:text-fg"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* The language lives in the menu on a phone, but not as one more row of
              it: it is not a page to go to. A captioned strip under the list, in
              the small print's size and colour, keeps the two apart. */}
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-[11px] font-extrabold uppercase tracking-eyebrow text-muted/70">
              {labels.language}
            </span>
            <LanguageLink lang={lang} label={labels.switchLabel} ariaLabel={labels.switchAria} />
          </div>
        </div>
      )}
    </header>
  );
}
