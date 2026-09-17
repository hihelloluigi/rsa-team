import ContactOptions from "@/components/ContactOptions";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { pageAlternates } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

export async function generateMetadata() {
  const { t, lang } = await getI18n();
  return {
    title: t.contact.metaTitle,
    description: t.contact.metaDescription,
    alternates: pageAlternates(lang, "/contact"),
  };
}

export default async function ContactPage() {
  const { t } = await getI18n();
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <SectionHeading as="h1" label={t.contact.label} title={t.contact.title} />
      <Reveal>
        <p className="max-w-2xl text-lg text-muted">{t.contact.intro}</p>
      </Reveal>
      <ContactOptions />
    </main>
  );
}
