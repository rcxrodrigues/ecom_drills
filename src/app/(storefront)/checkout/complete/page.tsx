import { redirect } from "next/navigation";
import Link from "next/link";
import { confirmOrderPayment } from "@/app/actions/checkout";

export default async function CheckoutCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  if (!orderId) redirect("/checkout");

  const result = await confirmOrderPayment(orderId);
  if (result.ok) redirect(`/order-confirmation/${result.orderNumber}`);

  return (
    <div className="page-container flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="text-xl font-semibold text-foreground-strong">We couldn&apos;t confirm your payment</h1>
      <p className="text-sm text-foreground">{result.error}</p>
      <Link href="/checkout" className="text-sm font-medium text-foreground-strong underline">
        Return to checkout
      </Link>
    </div>
  );
}
