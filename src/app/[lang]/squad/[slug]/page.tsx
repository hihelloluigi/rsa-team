import { notFound } from "next/navigation";
import Link from "next/link";
import StatBadge from "@/components/StatBadge";
import Reveal from "@/components/Reveal";
import PositionIcon from "@/components/PositionIcon";
import PlayerPortrait from "@/components/PlayerPortrait";
import { getPlayers, getPlayerBySlug } from "@/lib/data";
import { countryName } from "@/lib/format";
import { pageAlternates } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import JsonLd from "@/components/JsonLd";
import { playerLd, breadcrumbLd } from "@/lib/structured-data";
import Eyebrow from "@/components/Eyebrow";

export function generateStaticParams() {
  return getPlayers().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { t, lang } = await getI18n();
  const player = getPlayerBySlug(slug);
  if (!player) return { title: t.player.metaFallbackTitle };
  // A bio is the player's own words and is shown as written; the generated
  // line is the one that can follow the page's language.
  const description = player.bio
    ? player.bio.length > 160 ? `${player.bio.slice(0, 157)}…` : player.bio
    : t.player.metaDescription(
        player.name,
        t.positions.long[player.position],
        player.number,
        countryName(player.nationalityCode, player.nationality, lang),
      );
  return {
    title: player.name,
    description,
    alternates: pageAlternates(lang, `/squad/${player.slug}`),
  };
}

export default async function PlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);
  if (!player) notFound();
  const { t, lang, href } = await getI18n();
  const nationality = countryName(player.nationalityCode, player.nationality, lang);

  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <JsonLd
        data={[
          playerLd(player, lang),
          breadcrumbLd(
            [
              { name: t.nav.home, path: "/" },
              { name: t.nav.squad, path: "/squad" },
              { name: player.nickname ?? player.name, path: `/squad/${player.slug}` },
            ],
            lang,
          ),
        ]}
      />
      <Link href={href("/squad")} className="text-xs uppercase tracking-widest text-muted hover:text-accent">{t.player.back}</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <Reveal>
          <PlayerPortrait
            player={player}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="border border-white/10"
          >
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
            <span className="absolute bottom-4 left-4 font-display text-7xl text-accent drop-shadow-lg">{player.number}</span>
          </PlayerPortrait>
        </Reveal>

        <Reveal delay={0.1}>
          <div>
            <Eyebrow className="flex items-center gap-1.5">
              <PositionIcon position={player.position} size={18} className="text-accent" />
              {t.positions.short[player.position]} · #{player.number}
            </Eyebrow>
            <h1 className="font-display italic uppercase text-5xl sm:text-6xl leading-none mt-2 break-words">{player.nickname ?? player.name}</h1>
            {player.nickname && (
              <p className="mt-2 text-sm uppercase tracking-widest text-muted">{player.name}</p>
            )}
            {(nationality || player.age || player.joined) && (
              <dl className="mt-6 grid grid-cols-2 gap-y-3 text-sm">
                {nationality && (<><dt className="text-muted uppercase tracking-widest text-xs">{t.player.nationality}</dt><dd>{nationality}</dd></>)}
                {player.age && (<><dt className="text-muted uppercase tracking-widest text-xs">{t.player.age}</dt><dd>{player.age}</dd></>)}
                {player.joined && (<><dt className="text-muted uppercase tracking-widest text-xs">{t.player.since}</dt><dd>{player.joined}</dd></>)}
              </dl>
            )}
            {player.bio && <p className="mt-6 text-muted leading-relaxed">{player.bio}</p>}

            {player.stats && (
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatBadge label={t.player.appearances} value={player.stats.appearances} />
                <StatBadge label={t.player.goals} value={player.stats.goals} />
                <StatBadge label={t.player.assists} value={player.stats.assists} />
                {player.position === "GK"
                  ? <StatBadge label={t.player.cleanSheets} value={player.stats.cleanSheets} />
                  : <StatBadge label={t.player.motm} value={player.stats.motm} />}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
