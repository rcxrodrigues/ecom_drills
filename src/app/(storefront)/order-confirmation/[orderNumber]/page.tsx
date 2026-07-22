import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderByNumber } from "@/lib/queries";
import { formatPrice, formatDate } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  return (
    <div className="page-container max-w-2xl py-16 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-black">
        <svg viewBox="0 0 20 20" className="h-7 w-7" fill="none" stroke="white" strokeWidth={1.8}>
          <path d="M3 10.5l4.5 4.5L17 5.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-foreground-strong">Thank you, {order.firstName}!</h1>
      <p className="mt-2 text-sm text-foreground">
        Your order <span className="font-semibold text-foreground-strong">{order.orderNumber}</span> has been
        confirmed. A confirmation email has been sent to {order.email}.
      </p>

      <div className="mt-8 rounded-button border border-border-subtle p-5 text-left">
        <div className="mb-4 flex items-center justify-between text-sm text-foreground/70">
          <span>Order date</span>
          <span>{formatDate(order.createdAt)}</span>
        </div>
        <ul className="flex flex-col gap-3 border-t border-border-subtle pt-4">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span className="text-foreground-strong">
                {item.name} {item.variantTitle && <span className="text-foreground/60">({item.variantTitle})</span>} × {item.quantity}
              </span>
              <span className="font-medium text-foreground-strong">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-1.5 border-t border-border-subtle pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground">Subtotal</span>
            <span className="text-foreground-strong">{formatPrice(order.subtotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-foreground">Discount</span>
              <span className="text-foreground-strong">−{formatPrice(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-foreground">Delivery</span>
            <span className="text-foreground-strong">{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span>
          </div>
          <div className="mt-1 flex justify-between border-t border-border-subtle pt-2 text-base font-semibold text-foreground-strong">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/">Continue shopping</ButtonLink>
        <Link href="/account" className="inline-flex h-11 items-center rounded-button border border-brand-black px-5 text-sm font-medium text-foreground-strong">
          View my orders
        </Link>
      </div>
    </div>
  );
}
