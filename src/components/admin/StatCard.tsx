export function StatCard({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div className="rounded-button border border-border-subtle bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-foreground/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground-strong">{value}</p>
      {sublabel && <p className="mt-1 text-xs text-foreground/60">{sublabel}</p>}
    </div>
  );
}
