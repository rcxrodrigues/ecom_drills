const MESSAGES = [
  "30-DAY MONEY-BACK GUARANTEE",
  "FREE UK DELIVERY ON ORDERS OVER £50",
  "2-YEAR MINIMUM WARRANTY ON ALL TOOLS",
];

export function AnnouncementBar() {
  return (
    <div className="bg-brand-black text-white">
      <div className="page-container flex h-9 items-center justify-center overflow-hidden">
        <p className="truncate text-center text-[11px] font-medium tracking-wide sm:text-xs">
          {MESSAGES.join("  •  ")}
        </p>
      </div>
    </div>
  );
}
