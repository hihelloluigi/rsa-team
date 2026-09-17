import SectionHeading from "@/components/SectionHeading";
import { getClub, getCurrentSeason } from "@/lib/data";
import { pageAlternates } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import TermsIt from "./content-it";
import TermsEn from "./content-en";

export async function generateMetadata() {
  const { t, lang } = await getI18n();
  return {
    title: t.legal.termsMetaTitle,
    description: t.legal.termsMetaDescription,
    alternates: pageAlternates(lang, "/terms"),
  };
}

const UPDATED = { it: "17 settembre 2026", en: "17 September 2026" };
const CONTENT = { it: TermsIt, en: TermsEn };

export default async function TermsPage() {
  const { t, lang, href } = await getI18n();
  const Content = CONTENT[lang];
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <SectionHeading as="h1" label={t.legal.eyebrow} title={t.legal.termsTitle} />
      <Content
        club={getClub()}
        season={getCurrentSeason()}
        contactHref={href("/contact")}
        privacyHref={href("/privacy")}
      />
      <p className="mt-12 text-sm text-muted">{t.legal.updated(UPDATED[lang])}</p>
    </main>
  );
}
