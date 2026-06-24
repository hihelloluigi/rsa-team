import Link from "next/link";
import { GiSoccerBall } from "react-icons/gi";

export default function Hero({ tagline }: { tagline: string }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      {/* Pink ball accent — replaces the old rotated square */}
      <div
        className="absolute -top-14 -right-14 sm:-top-24 sm:-right-24 text-accent opacity-95 pointer-events-none select-none drop-shadow-[0_10px_40px_rgba(255,32,119,0.35)]"
        aria-hidden="true"
      >
        <GiSoccerBall className="h-52 w-52 sm:h-104 sm:w-104 rotate-12" />
      </div>
      {/* Madonna watermark */}
      <div
        className="absolute bottom-0 -left-8 sm:-left-4 pointer-events-none select-none"
        aria-hidden="true"
      >
        {/* SVG madonna — served as-is, faded to a watermark via opacity. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/madonna.svg" alt="" className="h-[26rem] w-auto opacity-[0.12] sm:h-[36rem] sm:opacity-[0.1]" />
      </div>
      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
        <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-accent mb-4">
          Dal 2025
        </p>
        <h1 className="font-display italic uppercase leading-[0.8] text-7xl sm:text-9xl">
          <span className="block">RSA</span>
          <span className="block text-accent">TEAM</span>
        </h1>
        <p className="mt-6 max-w-md text-lg sm:text-xl text-fg">{tagline}</p>
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
