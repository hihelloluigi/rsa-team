import { SiGooglecalendar } from "react-icons/si";
import { FaRegCalendarPlus } from "react-icons/fa6";
import ButtonLink from "@/components/ButtonLink";
import Eyebrow from "@/components/Eyebrow";
import { siteUrl } from "@/lib/site";
import { getClub } from "@/lib/data";
import { getI18n } from "@/i18n/server";

// Offers the season's fixtures as a subscribable feed. Both buttons point at
// the same /calendar.ics: Google takes it through its add-by-URL screen,
// while a webcal: link is what Apple Calendar and Outlook subscribe to directly.
const LINK =
  "underline decoration-white/20 underline-offset-4 transition hover:text-accent hover:decoration-accent";

export default async function CalendarSubscribe({ season }: { season: { id: string; label: string } }) {
  const { t } = await getI18n();
  const ics = `${siteUrl()}/calendar.ics`;
  const webcal = ics.replace(/^https?:/, "webcal:");
  const google = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`;

  return (
    <div className="border border-white/10 bg-surface px-6 py-10 text-center">
      <Eyebrow>{t.calendar.eyebrow}</Eyebrow>
      <h2 className="mt-3 font-display italic uppercase text-2xl sm:text-3xl leading-tight">
        {t.calendar.title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-muted">{t.calendar.body(getClub().name)}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <ButtonLink href={google} external>
          <SiGooglecalendar size={16} aria-hidden="true" /> Google Calendar
        </ButtonLink>
        <ButtonLink href={webcal} variant="outline">
          <FaRegCalendarPlus size={16} aria-hidden="true" /> Apple · Outlook
        </ButtonLink>
      </div>
      {/* The feed and its files are language-neutral URLs: one calendar, in
          Italian, whatever language this page is in. */}
      <p className="mt-5 text-xs text-muted">
        {t.calendar.preferFile}{" "}
        <a href="/calendar.ics" className={LINK}>
          {t.calendar.allSeasons}
        </a>{" "}
        {t.calendar.or}{" "}
        <a href={`/matches/${season.id}/calendar.ics`} className={LINK}>
          {t.calendar.onlySeason(season.label)}
        </a>
        . {t.calendar.googleNote}
        {t.calendar.languageNote && ` ${t.calendar.languageNote}`}
      </p>
    </div>
  );
}
