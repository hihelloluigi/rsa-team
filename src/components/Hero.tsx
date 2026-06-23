import Link from "next/link";

export default function Hero({ tagline }: { tagline: string }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute -top-24 -right-32 w-[28rem] h-[28rem] bg-accent rotate-45 opacity-90" />
      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
        <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-accent mb-4">
          Est. 2024 · Football Club
        </p>
        <h1 className="font-display italic uppercase leading-[0.8] text-7xl sm:text-9xl">
          <span className="block">RSA</span>
          <span className="block text-transparent [-webkit-text-stroke:2px_var(--color-accent)]">TEAM</span>
        </h1>
        <p className="mt-6 max-w-md text-muted">{tagline}</p>
        <div className="mt-8 flex gap-3">
          <Link href="/squad" className="bg-accent px-6 py-3 text-sm font-extrabold uppercase tracking-widest hover:opacity-90">
            Meet the Squad
          </Link>
          <Link href="/matches" className="border border-white/20 px-6 py-3 text-sm font-extrabold uppercase tracking-widest hover:border-accent">
            Fixtures
          </Link>
        </div>
      </div>
    </section>
  );
}
