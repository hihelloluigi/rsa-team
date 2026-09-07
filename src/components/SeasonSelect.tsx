"use client";
import { useRouter } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";

// Each season is its own prerendered URL, so the option value *is* the
// destination — the client does not need to know which season is current.
export default function SeasonSelect({
  seasons,
  selected,
}: {
  seasons: { label: string; href: string }[];
  selected: string;
}) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="season" className="text-xs font-extrabold uppercase tracking-widest text-muted">
        Stagione
      </label>
      <div className="relative">
        <select
          id="season"
          value={selected}
          onChange={(e) => router.push(e.target.value)}
          className="appearance-none cursor-pointer bg-surface border border-white/10 text-fg text-xs font-extrabold uppercase tracking-widest pl-4 pr-9 py-2.5 transition hover:border-accent focus:outline-none focus:border-accent"
        >
          {seasons.map((s) => (
            <option key={s.href} value={s.href} className="bg-bg text-fg normal-case">
              {s.label}
            </option>
          ))}
        </select>
        <FaChevronDown
          size={11}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-accent"
        />
      </div>
    </div>
  );
}
