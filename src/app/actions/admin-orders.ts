"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import type { ORDER_STATUSES } from "@/lib/constants";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
}

export async function updateOrder(id: string, status: (typeof ORDER_STATUSES)[number], trackingNumber: string) {
  await requireAdmin();
  await prisma.order.update({
    where: { id },
    data: { status, trackingNumber: trackingNumber || null },
  });
  revalidatePath("/admin/orders");
  revalidatePath("/account");
}
