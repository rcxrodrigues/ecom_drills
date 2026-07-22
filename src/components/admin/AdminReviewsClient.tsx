"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { StarRating } from "@/components/ui/StarRating";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { setReviewStatus, setReviewFeatured, replyToReview, deleteReview } from "@/app/actions/admin-reviews";

type Review = {
  id: string;
  authorName: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  featured: boolean;
  verifiedPurchase: boolean;
  adminReply: string | null;
  createdAt: string;
  product: { name: string; handle: string };
};

const FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const;

export function AdminReviewsClient({ reviews }: { reviews: Review[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const [, startTransition] = useTransition();
  const router = useRouter();

  const filtered = filter === "ALL" ? reviews : reviews.filter((r) => r.status === filter);

  return (
    <div>
      <div className="mb-5 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-input px-3 py-1.5 text-xs font-medium ${
              filter === f ? "bg-brand-black text-white" : "border border-border-subtle text-foreground-strong"
            }`}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((r) => (
          <div key={r.id} className="rounded-button border border-border-subtle bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-foreground-strong">{r.product.name}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-foreground/70">
                  <StarRating rating={r.rating} />
                  <span>{r.authorName}</span>
                  {r.location && <span>· {r.location}</span>}
                  <span>· {formatDate(r.createdAt)}</span>
                  {r.verifiedPurchase && <span className="rounded-input bg-neutral-100 px-1.5 py-0.5">Verified</span>}
                </div>
              </div>
              <span
                className={`rounded-input px-2 py-0.5 text-xs font-medium ${
                  r.status === "APPROVED"
                    ? "bg-neutral-100 text-foreground-strong"
                    : r.status === "PENDING"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {r.status}
              </span>
            </div>
            {r.title && <p className="mt-2 text-sm font-medium text-foreground-strong">{r.title}</p>}
            <p className="mt-1 text-sm text-foreground">{r.body}</p>

            <ReplyBox reviewId={r.id} initialReply={r.adminReply} />

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {r.status !== "APPROVED" && (
                <button
                  className="text-xs font-medium text-foreground-strong underline"
                  onClick={() => startTransition(async () => { await setReviewStatus(r.id, "APPROVED"); router.refresh(); })}
                >
                  Approve
                </button>
              )}
              {r.status !== "REJECTED" && (
                <button
                  className="text-xs font-medium text-foreground-strong underline"
                  onClick={() => startTransition(async () => { await setReviewStatus(r.id, "REJECTED"); router.refresh(); })}
                >
                  Reject
                </button>
              )}
              <button
                className="text-xs font-medium text-foreground-strong underline"
                onClick={() => startTransition(async () => { await setReviewFeatured(r.id, !r.featured); router.refresh(); })}
              >
                {r.featured ? "Unfeature" : "Feature on product page"}
              </button>
              <button
                className="text-xs font-medium text-red-600 underline"
                onClick={() => startTransition(async () => { await deleteReview(r.id); router.refresh(); })}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-foreground">No reviews in this filter.</p>}
      </div>
    </div>
  );
}

function ReplyBox({ reviewId, initialReply }: { reviewId: string; initialReply: string | null }) {
  const [reply, setReply] = useState(initialReply ?? "");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="mt-3 flex gap-2">
      <Textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Reply to this review (visible on the product page)"
        className="min-h-16"
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await replyToReview(reviewId, reply);
            router.refresh();
          })
        }
      >
        Save
      </Button>
    </div>
  );
}
