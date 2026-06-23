import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { getClub } from "@/lib/data";
import { GiSoccerBall } from "react-icons/gi";

export const metadata = { title: "Il Club — RSA TEAM" };

export default function ClubPage() {
  const club = getClub();
  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <SectionHeading label="Il Club" title="Chi siamo" icon={<GiSoccerBall size={32} />} />
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Reveal>
            <div>
              <p className="text-2xl font-display italic uppercase text-accent leading-tight">{club.tagline}</p>
              <p className="mt-6 text-muted leading-relaxed whitespace-pre-line">{club.about}</p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="space-y-6">
            <div className="bg-surface border border-white/10 p-5">
              <p className="text-xs uppercase tracking-widest text-muted">Fondato nel</p>
              <p className="font-display text-3xl">{club.founded}</p>
              <p className="mt-4 text-xs uppercase tracking-widest text-muted">Casa nostra</p>
              <p className="font-bold">{club.ground}</p>
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-[0.2em] text-muted mb-3">Lo staff</h3>
              <ul className="space-y-2">
                {club.staff.map((s) => (
                  <li key={s.name} className="flex justify-between border-b border-white/10 py-2 text-sm">
                    <span className="font-bold">{s.name}</span>
                    <span className="text-muted">{s.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
