"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitContactRequest, type ContactFormState } from "@/app/contact/actions";
import { CONTACT_TOPICS, type ContactTopic } from "@/lib/contact";

const INITIAL: ContactFormState = { status: "idle", message: "" };

const LABEL = "block text-xs font-extrabold uppercase tracking-eyebrow text-muted";
const FIELD =
  "mt-2 w-full border border-white/20 bg-bg px-4 py-3 text-base outline-none transition focus:border-accent";

// `defaultTopic` is how a page says why its visitor is probably here: /sponsor
// opens the form already set to "Diventare sponsor".
export default function ContactForm({ defaultTopic = "altro" }: { defaultTopic?: ContactTopic }) {
  const [state, formAction, pending] = useActionState(submitContactRequest, INITIAL);

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
      <div>
        <label htmlFor="contact-topic" className={LABEL}>Perché ci scrivi</label>
        <select
          id="contact-topic"
          name="topic"
          // Keyed so an error's handed-back value is applied: a select ignores
          // a defaultValue that changes after it has mounted.
          key={state.values?.topic ?? defaultTopic}
          defaultValue={state.values?.topic ?? defaultTopic}
          className={FIELD}
        >
          {Object.entries(CONTACT_TOPICS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={LABEL}>Come ti chiami</label>
          <input
            id="contact-name"
            name="name"
            required
            maxLength={80}
            autoComplete="name"
            defaultValue={state.values?.name}
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="contact-company" className={LABEL}>
            Azienda o squadra <span className="font-normal normal-case tracking-normal">(se c&apos;è)</span>
          </label>
          <input
            id="contact-company"
            name="organization"
            maxLength={120}
            autoComplete="organization"
            defaultValue={state.values?.organization}
            className={FIELD}
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-email" className={LABEL}>La tua email</label>
        <input
          id="contact-email"
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
        <label htmlFor="contact-message" className={LABEL}>Cosa avevi in mente</label>
        <textarea
          id="contact-message"
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
        <label htmlFor="contact-website">Sito web</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Art. 13 GDPR: the notice has to be within reach where the data is given. */}
      <p className="text-xs text-muted">
        Usiamo questi dati solo per risponderti. I dettagli sono nell&apos;
        <Link href="/privacy" className="text-fg underline decoration-accent underline-offset-4 hover:text-accent">
          informativa privacy
        </Link>
        .
      </p>

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
