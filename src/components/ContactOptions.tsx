import { FaInstagram } from "react-icons/fa";
import ButtonLink from "@/components/ButtonLink";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { getClub } from "@/lib/data";
import { contactFormEnabled, type ContactTopic } from "@/lib/contact";
import { instagramHandle } from "@/lib/format";

// The two ways to reach the club, shared by /contact and /sponsor: the form,
// and a direct message on Instagram.
export default function ContactOptions({ defaultTopic }: { defaultTopic?: ContactTopic }) {
  const club = getClub();
  // Read when the page is prerendered, so the form appears on the deploy after
  // the variables are set. Until then there is still a way in: Instagram.
  const formEnabled = contactFormEnabled();
  // ig.me opens the conversation itself, not the profile.
  const dmUrl = club.instagram && `https://ig.me/m/${instagramHandle(club.instagram)}`;

  return (
    <>
      {formEnabled && (
        <Reveal delay={0.08}>
          <div className="mt-10">
            <ContactForm defaultTopic={defaultTopic} />
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
    </>
  );
}
