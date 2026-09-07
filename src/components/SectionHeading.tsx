import type { ReactNode } from "react";
import Eyebrow from "@/components/Eyebrow";

export default function SectionHeading({
  label,
  title,
  icon,
  as: Heading = "h2",
}: {
  label?: string;
  title: string;
  icon?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-6">
      {label && (
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-[3px] bg-accent" />
          <Eyebrow as="span">{label}</Eyebrow>
        </div>
      )}
      <div className="flex items-center gap-3">
        {icon && <span className="text-accent" aria-hidden="true">{icon}</span>}
        <Heading className="font-display italic text-4xl sm:text-5xl uppercase leading-none">{title}</Heading>
      </div>
    </div>
  );
}
