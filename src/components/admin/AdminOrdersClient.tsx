"use client";

import { Fragment, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatDate, formatPrice } from "@/lib/format";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { updateOrder } from "@/app/actions/admin-orders";
import { ORDER_STATUSES } from "@/lib/constants";

type Order = {
  id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  trackingNumber: string | null;
  total: number;
  createdAt: string | Date;
  items: { name: string; quantity: number }[];
};

export function AdminOrdersClient({ orders }: { orders: Order[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-button border border-border-subtle bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border-subtle bg-neutral-50 text-xs uppercase tracking-wide text-foreground/60">
          <tr>
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {orders.map((o) => (
            <Fragment key={o.id}>
              <tr>
                <td className="px-4 py-3 font-medium text-foreground-strong">{o.orderNumber}</td>
                <td className="px-4 py-3 text-foreground">
                  {o.firstName} {o.lastName}
                </td>
                <td className="px-4 py-3 text-foreground">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3 text-foreground-strong">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-input bg-neutral-100 px-2 py-0.5 text-xs font-medium text-foreground-strong">{o.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button
                    className="text-xs font-medium text-foreground-strong underline"
                    onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                  >
                    {expanded === o.id ? "Close" : "Manage"}
                  </button>
                </td>
              </tr>
              {expanded === o.id && (
                <tr>
                  <td colSpan={6} className="bg-neutral-50 px-4 py-4">
                    <OrderManageForm order={o} />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p className="p-6 text-center text-sm text-foreground">No orders yet.</p>}
    </div>
  );
}

function OrderManageForm({ order }: { order: Order }) {
  const [status, setStatus] = useState(order.status);
  const [tracking, setTracking] = useState(order.trackingNumber ?? "");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3">
      <ul className="text-sm text-foreground">
        {order.items.map((item, i) => (
          <li key={i}>
            {item.name} × {item.quantity}
          </li>
        ))}
      </ul>
      <p className="text-xs text-foreground/60">Customer email: {order.email}</p>
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-foreground-strong">Status</label>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-44">
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-foreground-strong">Tracking number</label>
          <Input value={tracking} onChange={(e) => setTracking(e.target.value)} className="w-56" />
        </div>
        <Button
          type="button"
          size="sm"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await updateOrder(order.id, status as (typeof ORDER_STATUSES)[number], tracking);
              router.refresh();
            })
          }
        >
          Save
        </Button>
      </div>
    </div>
  );
}
