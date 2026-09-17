import ContactOptions from "@/components/ContactOptions";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { getClub } from "@/lib/data";

const description =
  "Vuoi sostenere l'RSA TEAM? Diventa nostro sponsor: il tuo logo sotto gli occhi di tutti, anche di chi non corre.";

export const metadata = {
  title: "Diventa sponsor",
  description,
  alternates: { canonical: "/sponsor" },
};

// The sponsors' way in to the contact form: the same form as /contact, under
// the pitch from the home page and already set to the sponsor topic.
export default function SponsorPage() {
  const club = getClub();
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <SectionHeading as="h1" label="Chi ci sostiene" title="Questo spazio può essere tuo" />
      <Reveal>
        <p className="max-w-2xl text-lg text-muted">
          Vuoi sostenere l&apos;{club.name}? Diventa nostro sponsor: il tuo logo qui, sotto gli occhi
          di tutti (anche di chi non corre).
        </p>
      </Reveal>
      <ContactOptions defaultTopic="sponsor" />
    </main>
  );
}
