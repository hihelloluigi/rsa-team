import Link from "next/link";
import type { ReactNode } from "react";

// The site's call-to-action link. Both variants were copy-pasted across five
// call sites and had already drifted apart — the 404 button had picked up a
// different text size and hover opacity from every other button — so this is
// now the single definition.
const BASE =
  "inline-flex shrink-0 items-center justify-center gap-2 px-6 py-3 text-sm font-extrabold uppercase tracking-widest transition";

const VARIANTS = {
  solid: "bg-accent text-white hover:opacity-90",
  outline: "border border-white/20 hover:border-accent",
} as const;

export default function ButtonLink({
  href,
  children,
  variant = "solid",
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  // Renders a plain anchor with the safe target/rel pair instead of next/link.
  external?: boolean;
  className?: string;
}) {
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`.trimEnd();
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
