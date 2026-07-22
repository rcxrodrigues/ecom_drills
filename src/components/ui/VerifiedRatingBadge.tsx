import { StarRating } from "./StarRating";

export function VerifiedRatingBadge({
  rating,
  count,
  className = "",
}: {
  rating: number;
  count: number;
  className?: string;
}) {
  if (count === 0) return null;
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-input border border-border-subtle bg-white px-2.5 py-1.5 ${className}`}
    >
      <StarRating rating={rating} />
      <span className="text-xs font-semibold text-foreground-strong">{rating.toFixed(1)}</span>
      <span className="text-xs text-foreground/60">
        · {count} review{count === 1 ? "" : "s"}
      </span>
      <span className="ml-1 inline-flex items-center gap-1 rounded-input bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-strong">
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={1.6}>
          <path d="M2 6l2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Verified
      </span>
    </div>
  );
}
