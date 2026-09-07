import { SiGooglecalendar } from "react-icons/si";
import { FaRegCalendarPlus } from "react-icons/fa6";
import ButtonLink from "@/components/ButtonLink";
import Eyebrow from "@/components/Eyebrow";
import { siteUrl } from "@/lib/site";

// Offers the season's fixtures as a subscribable feed. Both buttons point at
// the same /calendario.ics: Google takes it through its add-by-URL screen,
// while a webcal: link is what Apple Calendar and Outlook subscribe to directly.
export default function CalendarSubscribe() {
  const ics = `${siteUrl()}/calendario.ics`;
  const webcal = ics.replace(/^https?:/, "webcal:");
  const google = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`;

  return (
    <div className="border border-white/10 bg-surface px-6 py-10 text-center">
      <Eyebrow>Non perdertene una</Eyebrow>
      <h2 className="mt-3 font-display italic uppercase text-2xl sm:text-3xl leading-tight">
        Porta il calendario con te
      </h2>
      <p className="mx-auto mt-3 max-w-md text-muted">
        Aggiungi le partite dell&apos;RSA TEAM al tuo calendario — questa stagione e
        quelle passate. Si aggiorna da solo: se cambia un orario, salta una partita
        o arriva un risultato, lo trovi lì senza rifare nulla.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <ButtonLink href={google} external>
          <SiGooglecalendar size={16} aria-hidden="true" /> Google Calendar
        </ButtonLink>
        <ButtonLink href={webcal} variant="outline">
          <FaRegCalendarPlus size={16} aria-hidden="true" /> Apple · Outlook
        </ButtonLink>
      </div>
      <p className="mt-5 text-xs text-muted">
        Preferisci scaricarlo?{" "}
        <a
          href="/calendario.ics"
          className="underline decoration-white/20 underline-offset-4 transition hover:text-accent hover:decoration-accent"
        >
          Scarica il file .ics
        </a>
        . Google ricontrolla i calendari esterni ogni tanto, non all&apos;istante.
      </p>
    </div>
  );
}
