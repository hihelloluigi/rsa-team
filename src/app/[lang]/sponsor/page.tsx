import ContactOptions from "@/components/ContactOptions";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { getClub } from "@/lib/data";
import { pageAlternates } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

export async function generateMetadata() {
  const { t, lang } = await getI18n();
  return {
    title: t.sponsorPage.metaTitle,
    description: t.sponsorPage.metaDescription,
    alternates: pageAlternates(lang, "/sponsor"),
  };
}

// The sponsors' way in to the contact form: the same form as /contact, under
// the pitch from the home page and already set to the sponsor topic.
export default async function SponsorPage() {
  const club = getClub();
  const { t } = await getI18n();
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <SectionHeading as="h1" label={t.sponsorPage.label} title={t.sponsorInvite.title} />
      <Reveal>
        <p className="max-w-2xl text-lg text-muted">{t.sponsorInvite.body(club.name)}</p>
      </Reveal>
      <ContactOptions defaultTopic="sponsor" />
    </main>
  );
}
