import { auth, signIn } from "@/auth";
import { getCurrentSeason } from "@/lib/data";
import { splitMatches } from "@/lib/matches";
import { matchDateShort } from "@/lib/format";
import Eyebrow from "@/components/Eyebrow";
import ResultForm from "@/components/admin/ResultForm";

// Not a public page: it reads the session, so it is dynamic and unindexed
// (robots.ts disallows it). The rest of the site stays prerendered.
export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    return (
      <main className="mx-auto max-w-md px-5 py-24 text-center">
        <Eyebrow>Area riservata</Eyebrow>
        <h1 className="mt-3 font-display italic uppercase text-4xl">Accedi</h1>
        <p className="mx-auto mt-4 max-w-sm text-muted">
          Solo l&apos;account GitHub che gestisce il sito può entrare.
        </p>
        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-accent px-6 py-3 text-sm font-extrabold uppercase tracking-widest text-white transition hover:opacity-90"
          >
            Entra con GitHub
          </button>
        </form>
      </main>
    );
  }

  const season = getCurrentSeason();
  const { upcoming } = splitMatches(season.matches);

  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <Eyebrow>{season.label}</Eyebrow>
      <h1 className="mt-3 font-display italic uppercase text-4xl">Risultati</h1>
      <p className="mt-3 text-sm text-muted">
        Ogni salvataggio è un commit su GitHub: il sito si ricostruisce da solo.
      </p>

      <div className="mt-10 space-y-4">
        {upcoming.length === 0 ? (
          <p className="text-muted">Nessuna partita da aggiornare.</p>
        ) : (
          upcoming.map((match) => (
            <ResultForm
              key={match.id}
              seasonId={season.id}
              matchId={match.id}
              opponent={match.opponent}
              home={match.home}
              date={matchDateShort(match.date)}
              status={match.status}
            />
          ))
        )}
      </div>
    </main>
  );
}
