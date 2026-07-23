const badges = [
  {
    title: "FREE SHIPPING",
    subtitle: "All UK orders over £50",
    icon: "M3 10h11l3 4h3v4H3z M7 18a2 2 0 100 4 2 2 0 000-4z M16 18a2 2 0 100 4 2 2 0 000-4z",
  },
  {
    title: "30-DAY RETURN",
    subtitle: "100% money-back guarantee",
    icon: "M4 10a8 8 0 1 1 2.3 5.6 M4 10V5 M4 10h5",
  },
  {
    title: "FREE GIFT",
    subtitle: "Orders over £75",
    icon: "M4 8h12v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8z M2.5 5.5h15v3h-15z M10 5.5V18 M10 5.5c-1-2.5-5-3-5 0s4 0 5 0z M10 5.5c1-2.5 5-3 5 0s-4 0-5 0z",
    highlight: true,
  },
  {
    title: "CE CERTIFIED",
    subtitle: "Legal & certified safety",
    icon: "M10 1.5l6.5 2.3v4.6c0 4.6-2.8 7.6-6.5 8.6-3.7-1-6.5-4-6.5-8.6V3.8z M7 10l2 2 4-4",
  },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {badges.map((b) => (
        <div
          key={b.title}
          className={`flex items-start gap-2.5 rounded-button border p-3 ${
            b.highlight
              ? "border-[#D4AF37] bg-[#FBF6E8] shadow-[0_0_0_1px_#D4AF37,0_0_16px_rgba(212,175,55,0.5)]"
              : "border-border-subtle"
          }`}
        >
          <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="#121212" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
            <path d={b.icon} />
          </svg>
          <div>
            <p className="text-xs font-bold tracking-wide text-foreground-strong">{b.title}</p>
            <p className="text-xs text-foreground/70">{b.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
