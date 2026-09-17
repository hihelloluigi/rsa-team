import Link from "next/link";
import LegalSection, { type LegalContentProps } from "@/components/LegalSection";

// A faithful translation of content-it.tsx, which is the original. The Italian
// text prevails if the two ever differ.
export default function TermsEn({ club, season, contactHref, privacyHref }: LegalContentProps) {
  return (
    <>
      <p className="text-lg text-muted">
        A few rules, like down at the local pitch. By using this site you accept them; if they
        don&apos;t suit you, no hard feelings: we&apos;ll see you at the ground instead.
      </p>

      <LegalSection title="What this site is">
        <p>
          It is the website of {club.name}, an amateur football team. It is not a news
          publication, it sells nothing and it is not run for profit: it is there to tell the
          story of the team, the fixtures and the results. It is run by {club.dataController}, in
          a personal capacity.
        </p>
      </LegalSection>

      <LegalSection title="Content and photos">
        <p>
          Text, graphics, the crest and the photos belong to {club.name} or to their respective
          authors. Share the pages as much as you like (thank you, in fact). To reuse photos or
          content elsewhere, ask first: a message from the{" "}
          <Link href={contactHref}>Contact</Link> page is enough.
        </p>
        <p>In a photo and would rather not be? Write to us and we&apos;ll take it down, no argument.</p>
      </LegalSection>

      <LegalSection title="Sponsors and trademarks">
        <p>
          Sponsors&apos; logos and names belong to their respective owners and appear here with
          their agreement. Their presence does not mean they answer for what we publish, still
          less for how we play.
        </p>
      </LegalSection>

      <LegalSection title="Results, tables and fixtures">
        <p>
          Results, league tables and kick-off times are entered by hand or taken from the
          league&apos;s website
          {season?.leagueUrl ? (
            <>
              {" "}(<a href={season.leagueUrl} target="_blank" rel="noopener noreferrer">{season.league}</a>)
            </>
          ) : null}
          , which remains the only official source. We do our best to keep them up to date, but
          they may contain errors or delays: before crossing town for a match, check the official
          source. The same goes for the calendar you can subscribe to.
        </p>
      </LegalSection>

      <LegalSection title="No warranty">
        <p>
          The site is provided as is, with no guarantee of availability or accuracy, and may
          change or disappear at any time. To the extent the law allows, we are not liable for
          damage arising from its use. Nor are we responsible for the external sites we link to,
          Instagram included.
        </p>
      </LegalSection>

      <LegalSection title="Personal data">
        <p>
          How we handle your data is explained in the <Link href={privacyHref}>privacy notice</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These terms are governed by Italian law. We may update them: the version published on
          this page is the one that counts. The Italian text prevails over this translation.
        </p>
      </LegalSection>
    </>
  );
}
