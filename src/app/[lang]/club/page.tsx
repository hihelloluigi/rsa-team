import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { clubText, getClub } from "@/lib/data";
import { pageAlternates } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

export async function generateMetadata() {
  const { t, lang } = await getI18n();
  return {
    title: t.club.metaTitle,
    description: t.club.metaDescription,
    alternates: pageAlternates(lang, "/club"),
  };
}

export default async function ClubPage() {
  const club = getClub();
  const { t, lang } = await getI18n();
  const text = clubText(lang);
  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <SectionHeading as="h1" label={t.club.label} title={t.club.title} />
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Reveal>
            <div>
              <p className="text-2xl sm:text-3xl font-display italic uppercase text-accent leading-tight">{text.tagline}</p>
              <p className="mt-6 max-w-2xl text-muted leading-relaxed whitespace-pre-line">{text.about}</p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="space-y-6">
            <div className="bg-surface border border-white/10 p-5">
              <p className="text-xs uppercase tracking-widest text-muted">{t.club.founded}</p>
              <p className="font-display text-3xl">{club.founded}</p>
              <p className="mt-4 text-xs uppercase tracking-widest text-muted">{t.club.home}</p>
              {club.groundMapUrl ? (
                <a
                  href={club.groundMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-block"
                >
                  <span className="font-bold group-hover:text-accent transition">{club.ground}</span>
                  {club.groundAddress && (
                    <span className="block text-xs text-muted group-hover:text-accent/80 transition">
                      {club.groundAddress} ↗
                    </span>
                  )}
                </a>
              ) : (
                <p className="font-bold">{club.ground}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-subhead text-muted mb-3">{t.club.staff}</h3>
              <ul className="space-y-2">
                {club.staff.map((s) => (
                  <li key={s.name} className="flex items-baseline justify-between gap-4 border-b border-white/10 py-2 text-sm">
                    <span className="font-bold">{s.name}</span>
                    <span className="text-right text-muted">{t.content.staffRoles[s.role] ?? s.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
