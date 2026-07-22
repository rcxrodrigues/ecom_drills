"use server";

import { prisma } from "@/lib/prisma";

export async function trackOrder(orderNumber: string, email: string) {
  const order = await prisma.order.findFirst({
    where: { orderNumber: orderNumber.trim().toUpperCase(), email: email.trim().toLowerCase() },
    include: { items: true },
  });
  if (!order) return { ok: false as const, error: "We couldn't find an order with those details." };
  return {
    ok: true as const,
    order: {
      orderNumber: order.orderNumber,
      status: order.status,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((i) => ({ name: i.name, quantity: i.quantity })),
    },
  };
}
