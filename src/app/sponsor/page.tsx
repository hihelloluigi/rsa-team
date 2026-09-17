import { FaInstagram } from "react-icons/fa";
import ButtonLink from "@/components/ButtonLink";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import SponsorForm from "@/components/SponsorForm";
import { getClub } from "@/lib/data";
import { instagramHandle } from "@/lib/format";
import { sponsorFormEnabled } from "@/lib/sponsor-request";

const description =
  "Vuoi sostenere l'RSA TEAM? Diventa nostro sponsor: il tuo logo sotto gli occhi di tutti, anche di chi non corre.";

export const metadata = {
  title: "Diventa sponsor",
  description,
  alternates: { canonical: "/sponsor" },
};

export default function SponsorPage() {
  const club = getClub();
  // Read when the page is prerendered, so the form appears on the deploy after
  // the variables are set. Until then the page still has a way in: Instagram.
  const formEnabled = sponsorFormEnabled();
  // ig.me opens the conversation itself, not the profile.
  const dmUrl = club.instagram && `https://ig.me/m/${instagramHandle(club.instagram)}`;

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <SectionHeading as="h1" label="Chi ci sostiene" title="Questo spazio può essere tuo" />
      <Reveal>
        <p className="max-w-2xl text-lg text-muted">
          Vuoi sostenere l&apos;{club.name}? Diventa nostro sponsor: il tuo logo qui, sotto gli occhi
          di tutti (anche di chi non corre).
        </p>
      </Reveal>

      {formEnabled && (
        <Reveal delay={0.08}>
          <div className="mt-10">
            <SponsorForm />
          </div>
        </Reveal>
      )}

      {dmUrl && (
        <Reveal delay={0.12}>
          <div className="mt-6 flex flex-col items-center gap-4 border border-white/10 px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-muted">
              {formEnabled
                ? "I form non fanno per te? Scrivici in direct, rispondiamo anche lì."
                : "Scrivici in direct su Instagram: rispondiamo lì."}
            </p>
            <ButtonLink href={dmUrl} external variant={formEnabled ? "outline" : "solid"}>
              <FaInstagram size={18} aria-hidden="true" /> Scrivici su Instagram
            </ButtonLink>
          </div>
        </Reveal>
      )}
    </main>
  );
}
