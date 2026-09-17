import Link from "next/link";
import LegalSection, { type LegalContentProps } from "@/components/LegalSection";

// A faithful translation of content-it.tsx, which is the original: the two
// have to say the same things. The Italian text prevails if they ever differ.
export default function PrivacyEn({ club, contactHref }: LegalContentProps) {
  return (
    <>
      <p className="text-lg text-muted">
        On the pitch we improvise; with your data we don&apos;t. Below is what we collect (not
        much), why, and how to have it deleted. This notice is given under Article 13 of
        Regulation (EU) 2016/679 (the “GDPR”).
      </p>

      <LegalSection title="Who the controller is">
        <p>
          The data controller is <strong>{club.dataController}</strong>, who built and runs this
          website on behalf of {club.name}, an amateur team with no legal personality.
        </p>
        <p>
          For any request about your data, write to us from the{" "}
          <Link href={contactHref}>Contact</Link> page
          {club.instagram && (
            <>
              {" "}or send a direct message on{" "}
              <a href={club.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            </>
          )}
          .
        </p>
      </LegalSection>

      <LegalSection title="What data we process, and why">
        <ul>
          <li>
            <strong>Contact form.</strong> Your name, email, company or team if you give one, and
            the text of your message. We use them only to reply to you: the legal basis is your
            own request (Art. 6(1)(b) GDPR). The message reaches us by email and is not stored in
            any database on the site. We keep it for as long as it takes to deal with the request,
            and in any case no longer than 12 months after the last exchange.
          </li>
          <li>
            <strong>Browsing data.</strong> Like every website, the server that hosts us records,
            for technical and security reasons, data such as IP address, page requested and
            browser type. We also collect aggregate, anonymous visit statistics, without cookies
            and without recognising you from one visit to the next (legitimate interest,
            Art. 6(1)(f) GDPR).
          </li>
          <li>
            <strong>Players and staff.</strong> The names, photos, shirt numbers and statistics of
            registered players are published with their consent. In the squad and want something
            removed or corrected? Tell the manager, or write to us: we&apos;ll do it right away.
          </li>
          <li>
            <strong>Restricted area.</strong> The admin page can only be reached by the person who
            runs the site, through their GitHub account. It doesn&apos;t concern you, unless you
            are them.
          </li>
        </ul>
        <p>
          We do no profiling, we do not sell or pass data on to anyone, and we will not sign you
          up to any newsletter.
        </p>
      </LegalSection>

      <LegalSection id="cookie" title="Cookies">
        <p>
          This site <strong>uses no profiling or third-party cookies</strong>, and its visit
          statistics work without cookies. That is why we don&apos;t ask for your consent: there
          is nothing to consent to.
        </p>
        <p>The only things saved in your browser are technical:</p>
        <ul>
          <li>
            a note in the browser&apos;s local storage recording that you closed the cookie
            notice, so we don&apos;t show it again on every visit. It contains no personal data
            and never leaves your device;
          </li>
          <li>
            a session cookie, only for whoever signs in to the restricted area (that is, nobody
            but the person who runs the site).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Who else sees the data">
        <p>To run the site we rely on providers that process data on our behalf:</p>
        <ul>
          <li><strong>Vercel Inc.</strong> — website hosting and aggregate visit statistics;</li>
          <li><strong>Resend</strong> — delivery of the messages sent through the contact form;</li>
          <li>the provider of the mailbox where we receive those messages.</li>
        </ul>
        <p>
          Some of these providers are based in the United States: the transfer takes place with
          the safeguards required by the GDPR (the EU-US Data Privacy Framework or standard
          contractual clauses).
        </p>
        <p>
          The photos and videos on the home page come from our Instagram profile, but we serve
          them to you ourselves: until you click on a post, Instagram doesn&apos;t know you were
          here. Once you are on Instagram, or on any other site we link to, their own notice
          applies.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          At any time you can ask us what data we hold about you, have it corrected or deleted,
          have its use restricted or receive a copy of it, and you can object to its processing
          (Arts. 15-22 GDPR). Just write to us from the <Link href={contactHref}>Contact</Link>{" "}
          page: we reply within a month, usually much sooner.
        </p>
        <p>
          If you think we have mishandled your data you can lodge a complaint with the Italian
          data protection authority, the{" "}
          <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">
            Garante per la protezione dei dati personali
          </a>
          . But write to us first: these things usually get sorted out.
        </p>
      </LegalSection>
    </>
  );
}
