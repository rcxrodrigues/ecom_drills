import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/auth";
import { getCustomerById, getCustomerOrders, getCustomerReviews } from "@/lib/queries";
import { formatPrice, formatDate } from "@/lib/format";
import { StarRating } from "@/components/ui/StarRating";
import { LogoutButton } from "@/components/storefront/LogoutButton";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default async function AccountPage() {
  const session = await getCustomerSession();
  if (!session) redirect("/account/login");

  const customer = await getCustomerById(session.customerId);
  if (!customer) redirect("/account/login");

  const [orders, reviews] = await Promise.all([
    getCustomerOrders(session.customerId),
    getCustomerReviews(session.customerId),
  ]);

  return (
    <div className="page-container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground-strong">
            Hello, {customer.firstName}
          </h1>
          <p className="mt-1 text-sm text-foreground">{customer.email}</p>
        </div>
        <LogoutButton />
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-base font-semibold text-foreground-strong">Order history</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-foreground">You haven&apos;t placed any orders yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border-subtle border-y border-border-subtle">
            {orders.map((order) => (
              <div key={order.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground-strong">{order.orderNumber}</p>
                  <p className="text-xs text-foreground/70">
                    {formatDate(order.createdAt)} · {order.items.length} item{order.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-input bg-neutral-100 px-2.5 py-1 text-xs font-medium text-foreground-strong">
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                  <span className="text-sm font-semibold text-foreground-strong">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-base font-semibold text-foreground-strong">Your reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-foreground">You haven&apos;t left any reviews yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border-subtle border-y border-border-subtle">
            {reviews.map((review) => (
              <div key={review.id} className="py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground-strong">{review.product.name}</p>
                  <span className="text-xs text-foreground/60">{formatDate(review.createdAt)}</span>
                </div>
                <div className="mt-1">
                  <StarRating rating={review.rating} />
                </div>
                <p className="mt-2 text-sm text-foreground">{review.body}</p>
                <span className="mt-2 inline-block rounded-input bg-neutral-100 px-2 py-0.5 text-xs font-medium text-foreground-strong">
                  {review.status === "APPROVED" ? "Published" : review.status === "PENDING" ? "Awaiting approval" : "Not published"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
