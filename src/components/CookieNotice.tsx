"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "rsa-cookie-notice-dismissed";

// A notice, not a consent banner: the site sets no cookie that needs consent,
// so there is nothing to accept — only something to say, once. Remembering the
// dismissal is the one thing stored in the visitor's browser, which the notice
// itself owns up to. If storage is unavailable (private mode, blocked site
// data) the notice simply comes back next visit.
// localStorage has no change event within the tab that wrote to it, and the
// value only moves when this component moves it, so there is nothing to
// subscribe to.
const subscribe = () => () => {};

function wasDismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export default function CookieNotice() {
  // The server cannot know what this browser remembers, so it renders the
  // notice closed — open by default would flash it at everyone who closed it.
  const dismissedBefore = useSyncExternalStore(subscribe, wasDismissed, () => true);
  const [dismissedNow, setDismissedNow] = useState(false);

  if (dismissedBefore || dismissedNow) return null;

  const dismiss = () => {
    setDismissedNow(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Nothing to do: it will be shown again, which is the honest fallback.
    }
  };

  return (
    <aside
      aria-label="Avviso sui cookie"
      className="fixed inset-x-3 bottom-3 z-50 border border-white/20 bg-surface p-5 shadow-2xl shadow-black/60 sm:inset-x-auto sm:left-5 sm:bottom-5 sm:max-w-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-display italic uppercase text-xl leading-tight">
          Avviso cookie obbligatorio per legge
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Chiudi l'avviso"
          className="-mr-2 -mt-2 shrink-0 p-2 text-2xl leading-none text-muted transition hover:text-accent"
        >
          ×
        </button>
      </div>
      <p className="mt-3 text-sm text-muted">
        Solo che di cookie non ne usiamo: niente profilazione, niente terze parti, nessun dato
        venduto a nessuno. L&apos;unica cosa che ci segniamo è che hai chiuso questo avviso.
      </p>
      <p className="mt-3 text-sm text-muted">
        (Il Garante sarebbe fiero di noi. Il mister un po&apos; meno.){" "}
        <Link href="/privacy#cookie" onClick={dismiss} className="text-fg underline decoration-accent underline-offset-4 hover:text-accent">
          Dettagli
        </Link>
      </p>
    </aside>
  );
}
