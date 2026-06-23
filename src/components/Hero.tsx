import Link from "next/link";
import { GiSoccerBall } from "react-icons/gi";

export default function Hero({ tagline }: { tagline: string }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute -top-24 -right-32 w-[28rem] h-[28rem] bg-accent rotate-45 opacity-90" />
      {/* Football watermark */}
      <div
        className="absolute bottom-8 left-[-2rem] text-white/5 pointer-events-none select-none"
        aria-hidden="true"
      >
        <GiSoccerBall size={280} />
      </div>
      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
        <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-accent mb-4">
          Dal 2024 · Più cuore che tattica
        </p>
        <h1 className="font-display italic uppercase leading-[0.8] text-7xl sm:text-9xl">
          <span className="block">RSA</span>
          <span className="block text-transparent [-webkit-text-stroke:2px_var(--color-accent)]">TEAM</span>
        </h1>
        <p className="mt-6 max-w-md text-muted">{tagline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/squad" className="bg-accent px-6 py-3 text-sm font-extrabold uppercase tracking-widest hover:opacity-90">
            Conosci la rosa
          </Link>
          <Link href="/matches" className="border border-white/20 px-6 py-3 text-sm font-extrabold uppercase tracking-widest hover:border-accent">
            Le partite
          </Link>
        </div>
      </div>
      {/* SIAMO MATTI marquee band */}
      <div className="relative overflow-hidden bg-accent py-2" aria-hidden="true">
        <div className="marquee__track flex whitespace-nowrap">
          {/* Duplicate content for seamless loop */}
          {[0, 1].map((i) => (
            <span key={i} className="flex shrink-0 items-center">
              {Array.from({ length: 8 }).map((_, j) => (
                <span key={j} className="flex items-center gap-3 mx-4">
                  <span className="font-display italic font-extrabold uppercase tracking-[0.15em] text-black text-sm sm:text-base">
                    SIAMO MATTI
                  </span>
                  <GiSoccerBall size={14} className="text-black/60" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
