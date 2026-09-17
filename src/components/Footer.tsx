import Link from "next/link";
import { FaInstagram } from "react-icons/fa";
import { getClub } from "@/lib/data";
import { instagramHandle } from "@/lib/format";
import { getI18n } from "@/i18n/server";
import LanguageLink from "@/components/LanguageLink";

export default async function Footer() {
  const club = getClub();
  const { t, lang, href } = await getI18n();
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <span className="font-black italic text-fg text-lg">RSA <span className="text-accent">TEAM</span></span>
          <span className="font-display italic uppercase text-white/50 tracking-widest text-xs">SIAMO MATTI</span>
        </div>
        <div className="flex flex-col items-center gap-2 text-xs">
          <span>© {new Date().getFullYear()} {club.name} · {t.footer.rights}</span>
          <nav aria-label={t.footer.navLabel} className="flex gap-4">
            <Link href={href("/contact")} className="transition hover:text-accent">{t.footer.contact}</Link>
            <Link href={href("/privacy")} className="transition hover:text-accent">{t.footer.privacy}</Link>
            <Link href={href("/terms")} className="transition hover:text-accent">{t.footer.terms}</Link>
            <LanguageLink lang={lang} label={t.nav.switchLabel} ariaLabel={t.nav.switchAria} />
          </nav>
        </div>
        {club.instagram && (
          <a
            href={club.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted hover:text-accent transition"
          >
            <FaInstagram size={18} />
            <span className="text-xs tracking-widest uppercase">@{instagramHandle(club.instagram)}</span>
          </a>
        )}
      </div>
    </footer>
  );
}
