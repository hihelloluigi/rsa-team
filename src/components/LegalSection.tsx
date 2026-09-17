import type { ReactNode } from "react";
import type { Club, Season } from "@/lib/types";

// What a legal page hands its per-language body: the content it quotes, and
// links already in the page's language.
export type LegalContentProps = {
  club: Club;
  season?: Season;
  contactHref: string;
  privacyHref: string;
};

// One titled block of a legal page (/privacy, /terms). The prose styling —
// paragraph rhythm, lists, links — is set here once for both pages.
export default function LegalSection({
  id,
  title,
  children,
}: {
  // Makes the block linkable, e.g. /privacy#cookie from the cookie notice.
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <h2 className="font-display italic uppercase text-2xl sm:text-3xl leading-tight">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-muted [&_a]:text-fg [&_a]:underline [&_a]:decoration-accent [&_a]:underline-offset-4 hover:[&_a]:text-accent [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-fg [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  );
}
