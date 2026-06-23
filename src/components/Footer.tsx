import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <span className="font-black italic text-fg text-lg">RSA <span className="text-accent">TEAM</span></span>
          <span className="font-display italic uppercase text-white/50 tracking-widest text-xs">SIAMO MATTI</span>
        </div>
        <span className="text-xs">© {new Date().getFullYear()} RSA TEAM · Tutti i diritti riservati</span>
        <a
          href="https://www.instagram.com/rsafussball"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-muted hover:text-accent transition"
        >
          <FaInstagram size={18} />
          <span className="text-xs tracking-widest uppercase">@rsafussball</span>
        </a>
      </div>
    </footer>
  );
}
