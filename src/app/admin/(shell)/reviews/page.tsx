import { getAllReviewsForAdmin } from "@/lib/queries";
import { AdminReviewsClient } from "@/components/admin/AdminReviewsClient";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviewsForAdmin();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-foreground-strong">Reviews</h1>
      <AdminReviewsClient reviews={reviews} />
    </div>
  );
}
