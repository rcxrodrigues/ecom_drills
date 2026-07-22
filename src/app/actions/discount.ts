"use server";

import { validateDiscountCode } from "@/lib/queries";

export async function checkDiscountCode(code: string) {
  if (!code.trim()) return { ok: false as const, error: "Enter a discount code." };
  const discount = await validateDiscountCode(code);
  if (!discount) return { ok: false as const, error: "That code is invalid or has expired." };
  return {
    ok: true as const,
    discount: { code: discount.code, type: discount.type, value: discount.value },
  };
}
