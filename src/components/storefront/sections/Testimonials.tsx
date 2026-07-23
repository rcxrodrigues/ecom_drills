import { getFeaturedReviews } from "@/lib/queries";
import { StarRating } from "@/components/ui/StarRating";
import { AutoScrollRow } from "@/components/ui/AutoScrollRow";

export type TestimonialsConfig = { heading?: string };

function ReviewCard({ r, keyPrefix }: { r: Awaited<ReturnType<typeof getFeaturedReviews>>[number]; keyPrefix: string }) {
  return (
    <div
      key={`${keyPrefix}-${r.id}`}
      className="flex w-72 shrink-0 flex-col gap-3 rounded-button border border-border-subtle bg-white p-5"
    >
      <div className="flex items-center gap-1.5">
        <StarRating rating={r.rating} />
        <svg viewBox="0 0 12 12" className="h-3 w-3 text-foreground/50" fill="none" stroke="currentColor" strokeWidth={1.4}>
          <path d="M2 6l2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {r.title && <p className="text-sm font-semibold text-foreground-strong">{r.title}</p>}
      <p className="flex-1 text-sm text-foreground">{r.body}</p>
      <div className="flex items-center gap-2 text-xs text-foreground/70">
        <span className="font-medium text-foreground-strong">{r.authorName}</span>
        {r.location && <span>· {r.location}</span>}
        {r.verifiedPurchase && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-input bg-neutral-100 px-1.5 py-0.5 font-medium">
            Verified
          </span>
        )}
      </div>
    </div>
  );
}

export async function Testimonials({ config }: { config: TestimonialsConfig }) {
  const reviews = await getFeaturedReviews();
  if (reviews.length === 0) return null;

  return (
    <section className="border-t border-border-subtle bg-neutral-50 py-10 lg:py-14">
      <div className="page-container">
        <h2 className="mb-6 text-xl font-semibold text-foreground-strong sm:text-2xl">
          {config.heading ?? "What our customers say"}
        </h2>
      </div>
      <AutoScrollRow className="gap-4 px-4 pb-2 sm:px-6 lg:px-10">
        {reviews.map((r) => (
          <ReviewCard key={`a-${r.id}`} r={r} keyPrefix="a" />
        ))}
        {reviews.map((r) => (
          <ReviewCard key={`b-${r.id}`} r={r} keyPrefix="b" />
        ))}
      </AutoScrollRow>
    </section>
  );
}
