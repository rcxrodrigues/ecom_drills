"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getCustomerSession } from "@/lib/auth";

const checkoutSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional().default(""),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional().default(""),
  city: z.string().min(1),
  postcode: z.string().min(1),
  deliveryMethod: z.enum(["STANDARD", "EXPRESS", "NEXT_DAY"]),
  discountCode: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string(),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1),
});

const SHIPPING_RATES: Record<string, number> = {
  STANDARD: 4.99,
  EXPRESS: 7.99,
  NEXT_DAY: 12.99,
};

function generateOrderNumber() {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `TD-${time}-${rand}`;
}

export async function placeOrder(input: z.infer<typeof checkoutSchema>) {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Please check the details you've entered." };
  }
  const data = parsed.data;

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: data.items.map((i) => i.variantId) } },
    include: { product: true },
  });

  if (variants.length !== data.items.length) {
    return { ok: false as const, error: "Some items in your basket are no longer available." };
  }

  for (const item of data.items) {
    const variant = variants.find((v) => v.id === item.variantId);
    if (!variant || variant.stock < item.quantity) {
      return { ok: false as const, error: `Not enough stock for ${variant?.product.name ?? "an item"}.` };
    }
  }

  let subtotal = 0;
  const orderItemsData = data.items.map((item) => {
    const variant = variants.find((v) => v.id === item.variantId)!;
    const unitPrice = Number(variant.product.salePrice ?? variant.product.price) + Number(variant.priceDelta);
    subtotal += unitPrice * item.quantity;
    return {
      productId: variant.product.id,
      variantId: variant.id,
      name: variant.product.name,
      variantTitle: variant.title,
      price: unitPrice,
      quantity: item.quantity,
    };
  });

  let discountAmount = 0;
  let discountCodeId: string | null = null;
  if (data.discountCode) {
    const discount = await prisma.discountCode.findUnique({ where: { code: data.discountCode.toUpperCase() } });
    if (discount && discount.active && (!discount.expiresAt || discount.expiresAt > new Date())) {
      if (discount.usageLimit == null || discount.usedCount < discount.usageLimit) {
        discountAmount =
          discount.type === "PERCENTAGE" ? (subtotal * Number(discount.value)) / 100 : Number(discount.value);
        discountAmount = Math.min(discountAmount, subtotal);
        discountCodeId = discount.id;
      }
    }
  }

  const shippingCost = subtotal - discountAmount >= 50 && data.deliveryMethod === "STANDARD" ? 0 : SHIPPING_RATES[data.deliveryMethod];
  const total = subtotal - discountAmount + shippingCost;

  const session = await getCustomerSession();
  const customer = session
    ? await prisma.customer.findUnique({ where: { id: session.customerId }, select: { id: true } })
    : null;

  // Stock and discount usage are only applied once payment is confirmed
  // (see confirmOrderPayment), so an abandoned/failed payment doesn't
  // reserve stock or burn a discount use.
  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerId: customer?.id ?? null,
      email: data.email.trim().toLowerCase(),
      phone: data.phone,
      firstName: data.firstName,
      lastName: data.lastName,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      postcode: data.postcode,
      deliveryMethod: data.deliveryMethod,
      subtotal,
      discountCodeId,
      discountAmount,
      shippingCost,
      total,
      items: { create: orderItemsData },
    },
  });

  return { ok: true as const, orderId: order.id, orderNumber: order.orderNumber, total };
}

export async function createPaymentIntent(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false as const, error: "Order not found." };
  if (order.status === "PAID") return { ok: false as const, error: "This order has already been paid." };

  const amountInPence = Math.round(Number(order.total) * 100);

  if (order.stripePaymentIntentId) {
    const existing = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
    if (existing.status !== "canceled" && existing.amount === amountInPence) {
      return { ok: true as const, clientSecret: existing.client_secret };
    }
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInPence,
    currency: "gbp",
    automatic_payment_methods: { enabled: true },
    metadata: { orderId: order.id, orderNumber: order.orderNumber },
    receipt_email: order.email,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripePaymentIntentId: paymentIntent.id },
  });

  return { ok: true as const, clientSecret: paymentIntent.client_secret };
}

export async function confirmOrderPayment(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) return { ok: false as const, error: "Order not found." };
  if (order.status === "PAID") return { ok: true as const, orderNumber: order.orderNumber };
  if (!order.stripePaymentIntentId) return { ok: false as const, error: "No payment found for this order." };

  const paymentIntent = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
  if (paymentIntent.status !== "succeeded") {
    return { ok: false as const, error: "Payment has not completed yet." };
  }

  await prisma.$transaction(async (tx) => {
    const fresh = await tx.order.findUnique({ where: { id: order.id } });
    if (fresh?.status === "PAID") return;

    for (const item of order.items) {
      if (!item.variantId) continue;
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    if (order.discountCodeId) {
      await tx.discountCode.update({ where: { id: order.discountCodeId }, data: { usedCount: { increment: 1 } } });
    }

    await tx.order.update({ where: { id: order.id }, data: { status: "PAID" } });
  });

  return { ok: true as const, orderNumber: order.orderNumber };
}
