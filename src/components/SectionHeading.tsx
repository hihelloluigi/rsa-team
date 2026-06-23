export default function SectionHeading({ label, title }: { label?: string; title: string }) {
  return (
    <div className="mb-8">
      {label && (
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-[3px] bg-accent" />
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">{label}</span>
        </div>
      )}
      <h2 className="font-display italic text-4xl sm:text-5xl uppercase leading-none">{title}</h2>
    </div>
  );
}
