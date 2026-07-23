const badges = [
  {
    title: "Free UK delivery",
    subtitle: "On orders over £50",
    icon: "M3 10h11l3 4h3v4H3z M7 18a2 2 0 100 4 2 2 0 000-4z M16 18a2 2 0 100 4 2 2 0 000-4z",
    highlight: true,
  },
  { title: "30-day returns", subtitle: "Money-back guarantee", icon: "M4 10a8 8 0 1 1 2.3 5.6 M4 10V5 M4 10h5" },
  { title: "CE certified", subtitle: "Meets UK safety standards", icon: "M10 1.5l6.5 2.3v4.6c0 4.6-2.8 7.6-6.5 8.6-3.7-1-6.5-4-6.5-8.6V3.8z" },
  { title: "2-year warranty", subtitle: "Manufacturer guarantee", icon: "M10 2l2.2 4.6 5 .7-3.6 3.6.8 5-4.4-2.3-4.4 2.3.8-5-3.6-3.6 5-.7z" },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {badges.map((b) => (
        <div
          key={b.title}
          className={`flex items-start gap-2.5 rounded-button border p-3 ${
            b.highlight
              ? "border-[#D4AF37] shadow-[0_0_0_1px_#D4AF37,0_0_14px_rgba(212,175,55,0.55)]"
              : "border-border-subtle"
          }`}
        >
          <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="#121212" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
            <path d={b.icon} />
          </svg>
          <div>
            <p className="text-xs font-semibold text-foreground-strong">{b.title}</p>
            <p className="text-xs text-foreground/70">{b.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
