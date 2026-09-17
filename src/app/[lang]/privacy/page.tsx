import SectionHeading from "@/components/SectionHeading";
import { getClub } from "@/lib/data";
import { pageAlternates } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import PrivacyIt from "./content-it";
import PrivacyEn from "./content-en";

export async function generateMetadata() {
  const { t, lang } = await getI18n();
  return {
    title: t.legal.privacyMetaTitle,
    description: t.legal.privacyMetaDescription,
    alternates: pageAlternates(lang, "/privacy"),
  };
}

// Bump when the text changes in substance: the notice has to say how current
// it is. One date for both languages — they are the same notice.
const UPDATED = { it: "17 settembre 2026", en: "17 September 2026" };

// Pages of prose are written out per language rather than squeezed through the
// dictionary: a legal text has to be read and checked as a whole.
const CONTENT = { it: PrivacyIt, en: PrivacyEn };

export default async function PrivacyPage() {
  const { t, lang, href } = await getI18n();
  const Content = CONTENT[lang];
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <SectionHeading as="h1" label={t.legal.eyebrow} title={t.legal.privacyTitle} />
      <Content club={getClub()} contactHref={href("/contact")} privacyHref={href("/privacy")} />
      <p className="mt-12 text-sm text-muted">{t.legal.updated(UPDATED[lang])}</p>
    </main>
  );
}
