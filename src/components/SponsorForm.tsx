"use client";

import { useActionState } from "react";
import { submitSponsorRequest, type SponsorFormState } from "@/app/sponsor/actions";

const INITIAL: SponsorFormState = { status: "idle", message: "" };

const LABEL = "block text-xs font-extrabold uppercase tracking-eyebrow text-muted";
const FIELD =
  "mt-2 w-full border border-white/20 bg-bg px-4 py-3 text-base outline-none transition focus:border-accent";

export default function SponsorForm() {
  const [state, formAction, pending] = useActionState(submitSponsorRequest, INITIAL);

  if (state.status === "sent") {
    return (
      <div role="status" className="border border-accent bg-surface px-6 py-12 text-center">
        <p className="font-display italic uppercase text-3xl">Messaggio ricevuto</p>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Ti rispondiamo appena finisce il terzo tempo. Quindi con calma, ma ti rispondiamo.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5 border border-white/10 bg-surface p-5 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="sponsor-name" className={LABEL}>Come ti chiami</label>
          <input
            id="sponsor-name"
            name="name"
            required
            maxLength={80}
            autoComplete="name"
            defaultValue={state.values?.name}
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="sponsor-company" className={LABEL}>
            Azienda <span className="font-normal normal-case tracking-normal">(se c&apos;è)</span>
          </label>
          <input
            id="sponsor-company"
            name="company"
            maxLength={120}
            autoComplete="organization"
            defaultValue={state.values?.company}
            className={FIELD}
          />
        </div>
      </div>
      <div>
        <label htmlFor="sponsor-email" className={LABEL}>La tua email</label>
        <input
          id="sponsor-email"
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          defaultValue={state.values?.email}
          className={FIELD}
        />
      </div>
      <div>
        <label htmlFor="sponsor-message" className={LABEL}>Cosa avevi in mente</label>
        <textarea
          id="sponsor-message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          defaultValue={state.values?.message}
          className={FIELD}
        />
      </div>

      {/* The honeypot: off-screen rather than display:none, which bots skip. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="sponsor-website">Sito web</label>
        <input id="sponsor-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="bg-accent px-6 py-3 text-sm font-extrabold uppercase tracking-widest text-white transition hover:opacity-90 disabled:opacity-40"
        >
          {pending ? "Invio…" : "Manda il messaggio"}
        </button>
        <p aria-live="polite" className="text-sm text-accent">
          {state.status === "error" ? state.message : ""}
        </p>
      </div>
    </form>
  );
}
