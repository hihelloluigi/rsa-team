export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <span className="font-black italic text-fg">RSA<span className="text-accent">.</span>TEAM</span>
        <span>© 2026 RSA TEAM. All rights reserved.</span>
        <span className="flex gap-4 uppercase text-xs tracking-widest">
          <a href="#" className="hover:text-accent">Instagram</a>
          <a href="#" className="hover:text-accent">X</a>
          <a href="#" className="hover:text-accent">YouTube</a>
        </span>
      </div>
    </footer>
  );
}
