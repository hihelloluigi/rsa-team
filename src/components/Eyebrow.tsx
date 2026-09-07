import type { ReactNode } from "react";

// The small caps caption that sits above or beside content — "Prossima
// partita", "Marcatori", "Ultimo risultato". The class string was repeated at
// eight call sites and one of them had slipped off the tracking scale, so it is
// defined once here.
const TONES = {
  accent: "text-accent",
  muted: "text-muted",
} as const;

export default function Eyebrow({
  children,
  tone = "accent",
  as: Tag = "p",
  className = "",
}: {
  children: ReactNode;
  tone?: keyof typeof TONES;
  as?: "p" | "span" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag
      className={`text-xs font-extrabold uppercase tracking-eyebrow ${TONES[tone]} ${className}`.trimEnd()}
    >
      {children}
    </Tag>
  );
}
