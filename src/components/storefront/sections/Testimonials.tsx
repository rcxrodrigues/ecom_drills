import { getFeaturedReviews } from "@/lib/queries";
import { StarRating } from "@/components/ui/StarRating";

export type TestimonialsConfig = { heading?: string };

export async function Testimonials({ config }: { config: TestimonialsConfig }) {
  const reviews = await getFeaturedReviews();
  if (reviews.length === 0) return null;

  return (
    <section className="border-t border-border-subtle bg-neutral-50 py-10 lg:py-14">
      <div className="page-container">
        <h2 className="mb-6 text-xl font-semibold text-foreground-strong sm:text-2xl">
          {config.heading ?? "What our customers say"}
        </h2>
        <div className="scrollbar-hidden -mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="flex w-72 shrink-0 snap-start flex-col gap-3 rounded-button border border-border-subtle bg-white p-5"
            >
              <StarRating rating={r.rating} />
              {r.title && <p className="text-sm font-semibold text-foreground-strong">{r.title}</p>}
              <p className="flex-1 text-sm text-foreground">{r.body}</p>
              <div className="flex items-center gap-2 text-xs text-foreground/70">
                <span className="font-medium text-foreground-strong">{r.authorName}</span>
                {r.location && <span>· {r.location}</span>}
                {r.verifiedPurchase && (
                  <span className="ml-auto inline-flex items-center gap-1 rounded-input bg-neutral-100 px-1.5 py-0.5 font-medium">
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="#121212" strokeWidth={1.4}>
                      <path d="M2 6l2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Verified Purchase
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
