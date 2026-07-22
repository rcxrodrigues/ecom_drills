"use client";

import { useState, useTransition } from "react";
import { Label, Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/format";
import { trackOrder } from "@/app/actions/track-order";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default function TrackOrderPage() {
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Awaited<ReturnType<typeof trackOrder>>["order"] | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOrder(null);
    const form = new FormData(e.currentTarget);
    const orderNumber = String(form.get("orderNumber") ?? "");
    const email = String(form.get("email") ?? "");
    startTransition(async () => {
      const result = await trackOrder(orderNumber, email);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setOrder(result.order);
    });
  }

  return (
    <div className="page-container max-w-md py-14">
      <h1 className="mb-6 text-2xl font-semibold text-foreground-strong">Track Your Order</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="orderNumber">Order number</Label>
          <Input id="orderNumber" name="orderNumber" placeholder="TD-XXXXX-XXX" required />
        </div>
        <div>
          <Label htmlFor="email">Email address used at checkout</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Checking…" : "Track order"}
        </Button>
      </form>

      {order && (
        <div className="mt-8 rounded-button border border-border-subtle p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground-strong">{order.orderNumber}</span>
            <span className="rounded-input bg-neutral-100 px-2.5 py-1 text-xs font-medium">{STATUS_LABEL[order.status]}</span>
          </div>
          <p className="mt-1 text-xs text-foreground/70">Placed {formatDate(order.createdAt)}</p>
          {order.trackingNumber && (
            <p className="mt-2 text-sm text-foreground">
              Tracking number: <span className="font-medium text-foreground-strong">{order.trackingNumber}</span>
            </p>
          )}
          <ul className="mt-3 flex flex-col gap-1 text-sm text-foreground">
            {order.items.map((item, i) => (
              <li key={i}>
                {item.name} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
