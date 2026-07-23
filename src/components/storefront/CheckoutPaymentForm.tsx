"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { confirmOrderPayment } from "@/app/actions/checkout";
import { useCart } from "@/lib/cart-context";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PayButton({ orderId, orderNumber, total }: { orderId: string; orderNumber: string; total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const cart = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/checkout/complete?orderId=${orderId}`,
      },
    });

    if (submitError) {
      setError(submitError.message ?? "Payment could not be completed.");
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      const result = await confirmOrderPayment(orderId);
      if (!result.ok) {
        setError(result.error);
        setSubmitting(false);
        return;
      }
      cart.clear();
      router.push(`/order-confirmation/${orderNumber}`);
      return;
    }

    // Payment requires further action (e.g. was redirected away and back).
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={!stripe || submitting}>
        {submitting ? "Processing…" : `Pay ${formatPrice(total)}`}
      </Button>
    </form>
  );
}

export function CheckoutPaymentForm({
  clientSecret,
  orderId,
  orderNumber,
  total,
}: {
  clientSecret: string;
  orderId: string;
  orderNumber: string;
  total: number;
}) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
      <PayButton orderId={orderId} orderNumber={orderNumber} total={total} />
    </Elements>
  );
}
