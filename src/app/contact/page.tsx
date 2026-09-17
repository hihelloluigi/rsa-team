import ContactOptions from "@/components/ContactOptions";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const description =
  "Scrivi all'RSA TEAM: per diventare sponsor, organizzare un'amichevole, giocare con noi o qualsiasi altra cosa.";

export const metadata = {
  title: "Contatti",
  description,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <SectionHeading as="h1" label="Contatti" title="Fatti sentire" />
      <Reveal>
        <p className="max-w-2xl text-lg text-muted">
          Vuoi sfidarci in amichevole, giocare con noi, mettere il tuo logo sulle maglie o solo
          dirci che abbiamo giocato male? Scrivici: leggiamo tutto, anche le critiche (quelle con
          più calma).
        </p>
      </Reveal>
      <ContactOptions />
    </main>
  );
}
