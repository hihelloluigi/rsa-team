"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/squad", label: "Squad" },
  { href: "/matches", label: "Matches" },
  { href: "/club", label: "Club" },
];

export default function Navbar() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-bg/90 backdrop-blur border-b border-white/10">
      <nav className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link href="/" className="font-black italic text-xl tracking-tight">
          RSA<span className="text-accent">.</span>TEAM
        </Link>
        <ul className="flex gap-2">
          {links.map((l) => {
            const active = l.href === "/" ? path === "/" : path === l.href || path.startsWith(l.href + "/");
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest transition ${
                    active ? "bg-accent text-white" : "text-muted hover:text-fg"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
