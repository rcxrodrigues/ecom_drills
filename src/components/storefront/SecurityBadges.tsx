function Stars({ color = "white" }: { color?: string }) {
  return (
    <span className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 12 12" className="h-2.5 w-2.5" fill={color}>
          <path d="M6 0.5l1.6 3.3 3.6.5-2.6 2.6.6 3.6L6 8.8 2.8 10.5l.6-3.6L.8 4.3l3.6-.5z" />
        </svg>
      ))}
    </span>
  );
}

function ReviewsBadge({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex h-9 items-center gap-2 rounded-input bg-[#00B67A] px-2.5">
      <Stars />
      <span className="text-xs font-bold text-white">{rating.toFixed(1)}</span>
      <span className="text-[10px] text-white/85">Toolvo Reviews · {count}</span>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <div className="flex h-9 items-center gap-2 rounded-input border border-border-subtle bg-white px-2.5">
      <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="#1A73E8">
        <path d="M10 1l2.2 1.7 2.7-.4 1 2.6 2.4 1.3-.6 2.7.6 2.7-2.4 1.3-1 2.6-2.7-.4L10 17l-2.2-1.7-2.7.4-1-2.6-2.4-1.3.6-2.7-.6-2.7 2.4-1.3 1-2.6 2.7.4z" />
        <path d="M6.5 10.2l2.3 2.3 4.7-4.9" stroke="white" strokeWidth={1.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-xs font-semibold text-foreground-strong">Verified Reviews</span>
    </div>
  );
}

function SecureBadge() {
  return (
    <div className="flex h-9 items-center gap-2 rounded-input border border-border-subtle bg-white px-2.5">
      <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" stroke="#121212" strokeWidth={1.4}>
        <path d="M8 1.5l5.5 2v4c0 4-2.4 6.5-5.5 7.5-3.1-1-5.5-3.5-5.5-7.5v-4z" strokeLinejoin="round" />
        <path d="M5.5 8l1.8 1.8L10.5 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-xs font-semibold text-foreground-strong">SSL Secure Checkout</span>
    </div>
  );
}

export function SecurityBadges({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {count > 0 && <ReviewsBadge rating={rating} count={count} />}
      <VerifiedBadge />
      <SecureBadge />
    </div>
  );
}
