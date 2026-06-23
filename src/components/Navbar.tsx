"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";

const links = [
  { href: "/", label: "Home" },
  { href: "/squad", label: "Squadra" },
  { href: "/matches", label: "Partite" },
  { href: "/club", label: "Il Club" },
];

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? path === "/" : path === href || path.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 bg-bg/90 backdrop-blur border-b border-white/10">
      <nav className="mx-auto max-w-6xl px-4 sm:px-5 h-16 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-black italic text-lg sm:text-xl tracking-tight shrink-0"
        >
          RSA <span className="text-accent">TEAM</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden sm:flex gap-2">
          {links.map((l) => {
            const active = isActive(l.href);
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
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="sm:hidden -mr-2 p-2 text-fg hover:text-accent transition"
        >
          {open ? <FaXmark size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {open && (
        <ul id="mobile-menu" className="sm:hidden border-t border-white/10 bg-bg">
          {links.map((l) => {
            const active = isActive(l.href);
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
      )}
    </header>
  );
}
