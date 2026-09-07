import { FaInstagram } from "react-icons/fa";
import { getClub } from "@/lib/data";
import { instagramHandle } from "@/lib/format";

export default function Footer() {
  const club = getClub();
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <span className="font-black italic text-fg text-lg">RSA <span className="text-accent">TEAM</span></span>
          <span className="font-display italic uppercase text-white/50 tracking-widest text-xs">SIAMO MATTI</span>
        </div>
        <span className="text-xs">
          © {new Date().getFullYear()} {club.name} · Tutti i diritti riservati
        </span>
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
