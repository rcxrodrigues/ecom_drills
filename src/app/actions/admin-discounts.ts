"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const discountSchema = z.object({
  id: z.string().optional(),
  code: z
    .string()
    .min(2)
    .transform((v) => v.trim().toUpperCase()),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().min(0),
  expiresAt: z.string().optional().nullable(),
  usageLimit: z.number().int().min(0).nullable(),
  active: z.boolean(),
});

export type DiscountInput = z.infer<typeof discountSchema>;

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
}

export async function saveDiscount(input: DiscountInput) {
  await requireAdmin();
  const parsed = discountSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid discount code." };
  }
  const data = parsed.data;
  const expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;

  try {
    if (data.id) {
      await prisma.discountCode.update({
        where: { id: data.id },
        data: { code: data.code, type: data.type, value: data.value, expiresAt, usageLimit: data.usageLimit, active: data.active },
      });
    } else {
      await prisma.discountCode.create({
        data: { code: data.code, type: data.type, value: data.value, expiresAt, usageLimit: data.usageLimit, active: data.active },
      });
    }
    revalidatePath("/admin/discounts");
    return { ok: true as const };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save discount code.";
    return { ok: false as const, error: message.includes("Unique constraint") ? "That code already exists." : message };
  }
}

export async function deleteDiscount(id: string) {
  await requireAdmin();
  await prisma.discountCode.delete({ where: { id } });
  revalidatePath("/admin/discounts");
}
