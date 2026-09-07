"use client";
import { useState } from "react";

type Status = "played" | "upcoming" | "postponed";

// One fixture, one row, one save. Deliberately plain: this gets used on a phone
// outside a pitch, so the controls are large and there is nothing to scroll
// past to reach the save button.
export default function ResultForm({
  seasonId,
  matchId,
  opponent,
  home,
  date,
  status: initialStatus,
}: {
  seasonId: string;
  matchId: string;
  opponent: string;
  home: boolean;
  date: string;
  status: Status;
}) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [rsa, setRsa] = useState("");
  const [opp, setOpp] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function save() {
    setState("saving");
    setMessage("");
    const res = await fetch("/api/admin/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seasonId,
        matchId,
        status,
        ...(status === "played" ? { rsa: Number(rsa), opponent: Number(opp) } : {}),
      }),
    });
    const body = await res.json();
    if (res.ok) {
      setState("done");
      setMessage("Salvato. Il sito si aggiorna fra qualche minuto.");
    } else {
      setState("error");
      setMessage(body.error ?? "Non è andata.");
    }
  }

  const numberField = "w-16 border border-white/20 bg-bg px-3 py-2 text-center text-lg font-bold";

  return (
    <div className="border border-white/10 bg-surface p-5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-bold">{home ? `RSA — ${opponent}` : `${opponent} — RSA`}</span>
        <span className="text-xs uppercase tracking-widest text-muted">{date}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className="border border-white/20 bg-bg px-3 py-2 text-sm"
          aria-label="Stato della partita"
        >
          <option value="upcoming">Da giocare</option>
          <option value="played">Giocata</option>
          <option value="postponed">Rinviata</option>
        </select>

        {status === "played" && (
          <div className="flex items-center gap-2">
            <label className="text-xs uppercase tracking-widest text-muted" htmlFor={`rsa-${matchId}`}>
              RSA
            </label>
            <input
              id={`rsa-${matchId}`}
              className={numberField}
              inputMode="numeric"
              value={rsa}
              onChange={(e) => setRsa(e.target.value.replace(/\D/g, ""))}
            />
            <span className="text-muted">:</span>
            <input
              aria-label={`Gol ${opponent}`}
              className={numberField}
              inputMode="numeric"
              value={opp}
              onChange={(e) => setOpp(e.target.value.replace(/\D/g, ""))}
            />
          </div>
        )}

        <button
          type="button"
          onClick={save}
          disabled={state === "saving" || (status === "played" && (rsa === "" || opp === ""))}
          className="ml-auto bg-accent px-5 py-2 text-sm font-extrabold uppercase tracking-widest text-white transition hover:opacity-90 disabled:opacity-40"
        >
          {state === "saving" ? "Salvo…" : "Salva"}
        </button>
      </div>

      {message && (
        <p className={`mt-3 text-sm ${state === "error" ? "text-accent" : "text-muted"}`}>{message}</p>
      )}
    </div>
  );
}
