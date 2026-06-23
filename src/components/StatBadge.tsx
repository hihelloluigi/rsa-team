export default function StatBadge({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-surface border border-white/10 px-5 py-4 text-center">
      <div className="font-display text-3xl text-accent leading-none">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-widest text-muted">{label}</div>
    </div>
  );
}
