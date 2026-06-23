import type { ReactNode } from "react";
import { GiSoccerBall } from "react-icons/gi";

// Centered bordered card used as a friendly placeholder (e.g. a season with no
// fixtures yet). `as` keeps the heading level correct for its surrounding outline.
export default function EmptyState({
  title,
  children,
  footer,
  as: Heading = "h2",
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  as?: "h2" | "h3";
}) {
  return (
    <div className="border border-white/10 bg-surface px-6 py-16 text-center">
      <GiSoccerBall className="mx-auto mb-5 text-accent" size={56} />
      <Heading className="font-display italic uppercase text-2xl sm:text-3xl leading-tight">
        {title}
      </Heading>
      <div className="mx-auto mt-5 max-w-md text-muted">{children}</div>
      {footer && <div className="mt-6">{footer}</div>}
    </div>
  );
}
