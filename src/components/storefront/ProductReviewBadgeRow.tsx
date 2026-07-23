import { StarRating } from "@/components/ui/StarRating";

export function ProductReviewBadgeRow({ rating, count }: { rating: number; count: number }) {
  if (count === 0) return null;
  return (
    <div className="flex flex-col gap-1.5 border-y border-border-subtle py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="#00B67A">
            <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z" />
          </svg>
          <span className="text-sm font-semibold text-foreground-strong">Toolvo Reviews</span>
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-[#00B67A]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00B67A]" />
          VERIFIED
        </span>
      </div>
      <div className="flex items-center gap-2">
        <StarRating rating={rating} />
        <span className="text-xs text-foreground/70">
          {rating.toFixed(1)} | {count} review{count === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}
