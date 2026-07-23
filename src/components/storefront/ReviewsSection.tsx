import { StarRating } from "@/components/ui/StarRating";
import { formatDate } from "@/lib/format";
import { AutoScrollRow } from "@/components/ui/AutoScrollRow";

type Review = {
  id: string;
  authorName: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  adminReply: string | null;
  createdAt: string;
};

function ReviewCard({ r, keyPrefix }: { r: Review; keyPrefix: string }) {
  return (
    <div
      key={`${keyPrefix}-${r.id}`}
      className="flex w-72 shrink-0 flex-col gap-2 rounded-button border border-border-subtle p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <StarRating rating={r.rating} />
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-foreground/50" fill="none" stroke="currentColor" strokeWidth={1.4}>
            <path d="M2 6l2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-xs text-foreground/60">{formatDate(r.createdAt)}</span>
      </div>
      {r.title && <p className="text-sm font-semibold text-foreground-strong">{r.title}</p>}
      <p className="flex-1 text-sm text-foreground">{r.body}</p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/70">
        <span className="font-medium text-foreground-strong">{r.authorName}</span>
        {r.location && <span>· {r.location}</span>}
        {r.verifiedPurchase && (
          <span className="inline-flex items-center gap-1 rounded-input bg-neutral-100 px-1.5 py-0.5 font-medium">
            Verified Purchase
          </span>
        )}
      </div>
      {r.adminReply && (
        <div className="rounded-input bg-neutral-50 p-3 text-xs text-foreground">
          <span className="font-semibold text-foreground-strong">Toolvo Drills team:</span> {r.adminReply}
        </div>
      )}
    </div>
  );
}

export function ReviewsSection({
  reviews,
  avgRating,
  ratingCount,
  distribution,
}: {
  reviews: Review[];
  avgRating: number;
  ratingCount: number;
  distribution: { star: number; count: number }[];
}) {
  return (
    <section id="reviews" className="border-t border-border-subtle py-10">
      <h2 className="mb-6 text-lg font-semibold text-foreground-strong">Customer reviews</h2>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-foreground-strong">{avgRating.toFixed(1)}</span>
            <span className="text-sm text-foreground">out of 5</span>
          </div>
          <div className="mt-2">
            <StarRating rating={avgRating} size="md" />
          </div>
          <p className="mt-1 text-sm text-foreground">{ratingCount} review{ratingCount === 1 ? "" : "s"}</p>

          <div className="mt-5 flex flex-col gap-1.5">
            {distribution.map((d) => {
              const pct = ratingCount ? Math.round((d.count / ratingCount) * 100) : 0;
              return (
                <div key={d.star} className="flex items-center gap-2 text-xs text-foreground">
                  <span className="w-8 shrink-0">{d.star} star</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200">
                    <div className="h-full bg-brand-black" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 shrink-0 text-right">{d.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="min-w-0">
          {reviews.length === 0 ? (
            <p className="text-sm text-foreground">No reviews yet — be the first to leave one.</p>
          ) : (
            <AutoScrollRow className="-mx-1 gap-4 px-1 pb-2">
              {reviews.map((r) => (
                <ReviewCard key={`a-${r.id}`} r={r} keyPrefix="a" />
              ))}
              {reviews.map((r) => (
                <ReviewCard key={`b-${r.id}`} r={r} keyPrefix="b" />
              ))}
            </AutoScrollRow>
          )}
        </div>
      </div>
    </section>
  );
}
