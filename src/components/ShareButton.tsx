"use client";
import { useEffect, useState } from "react";
import { FaCheck, FaShareNodes } from "react-icons/fa6";

// Shares a deep link to a section of the current page (`/#anchor`). On touch
// devices that means the native share sheet; elsewhere the link is copied and
// the button says so for a moment.
export default function ShareButton({
  anchor,
  title,
  className = "",
  labels,
}: {
  anchor: string;
  title: string;
  className?: string;
  labels: { share: string; copied: string; aria: string };
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const share = async () => {
    const url = `${location.origin}${location.pathname}#${anchor}`;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (touch && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
      } catch {
        // Dismissed the sheet — nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // No clipboard (insecure context, denied): at least put the link in
      // the address bar.
      location.hash = anchor;
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-label={labels.aria}
      className={`inline-flex shrink-0 items-center gap-2 border border-white/20 px-3 py-2 text-xs font-extrabold uppercase tracking-widest text-muted transition hover:border-accent hover:text-fg ${className}`.trimEnd()}
    >
      {copied ? (
        <FaCheck className="text-accent" aria-hidden="true" />
      ) : (
        <FaShareNodes aria-hidden="true" />
      )}
      <span className={copied ? "" : "sr-only sm:not-sr-only"} aria-live="polite">
        {copied ? labels.copied : labels.share}
      </span>
    </button>
  );
}
