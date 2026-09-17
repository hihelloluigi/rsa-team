import type { ReactNode } from "react";
import Eyebrow from "@/components/Eyebrow";
import ShareButton from "@/components/ShareButton";
import { getI18n } from "@/i18n/server";

export default async function SectionHeading({
  label,
  title,
  icon,
  as: Heading = "h2",
  anchor,
}: {
  label?: string;
  title: string;
  icon?: ReactNode;
  as?: "h1" | "h2";
  // Makes the section linkable as `/#anchor` and adds a share button for
  // that link. The scroll margin keeps the sticky navbar off the heading.
  anchor?: string;
}) {
  const { t } = await getI18n();
  return (
    <div id={anchor} className={anchor ? "mb-6 scroll-mt-24" : "mb-6"}>
      {label && (
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-[3px] bg-accent" />
          <Eyebrow as="span">{label}</Eyebrow>
        </div>
      )}
      <div className="flex items-center gap-3">
        {icon && <span className="text-accent" aria-hidden="true">{icon}</span>}
        <Heading className="font-display italic text-4xl sm:text-5xl uppercase leading-none">{title}</Heading>
        {anchor && <ShareButton
            anchor={anchor}
            title={title}
            className="ml-auto"
            labels={{ share: t.common.share, copied: t.common.linkCopied, aria: t.common.shareAria(title) }}
          />}
      </div>
    </div>
  );
}
