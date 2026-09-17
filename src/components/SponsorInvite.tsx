import ButtonLink from "@/components/ButtonLink";
import { getI18n } from "@/i18n/server";

// The pitch to would-be sponsors. With no sponsors yet it is the whole section,
// so it takes the space; once there are logos to show it steps back to a strip
// beneath them — the logos are the point, and this is for whoever reads on.
export default async function SponsorInvite({
  clubName,
  compact = false,
}: {
  clubName: string;
  compact?: boolean;
}) {
  const { t, href } = await getI18n();
  const copy = t.sponsorInvite.body(clubName);

  if (compact) {
    return (
      <div className="mt-4 flex flex-col items-center gap-4 border border-dashed border-white/20 px-5 py-5 text-center sm:flex-row sm:justify-between sm:gap-6 sm:text-left">
        <div>
          <p className="font-display italic uppercase text-xl">{t.sponsorInvite.title}</p>
          <p className="mt-1 max-w-xl text-sm text-muted">{copy}</p>
        </div>
        <ButtonLink href={href("/sponsor")} variant="outline">{t.sponsorInvite.cta}</ButtonLink>
      </div>
    );
  }

  return (
    <div className="border border-dashed border-white/20 bg-surface px-6 py-14 text-center">
      <p className="font-display italic uppercase text-2xl sm:text-3xl">{t.sponsorInvite.title}</p>
      <p className="mx-auto mt-3 max-w-md text-muted">{copy}</p>
      <ButtonLink href={href("/sponsor")} className="mt-8">{t.sponsorInvite.cta}</ButtonLink>
    </div>
  );
}
