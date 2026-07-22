"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, createCustomerSession, destroyCustomerSession } from "@/lib/auth";

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function registerCustomer(input: z.infer<typeof registerSchema>) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }
  const existing = await prisma.customer.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { ok: false as const, error: "An account with that email already exists." };
  }
  const customer = await prisma.customer.create({
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
    },
  });
  await createCustomerSession(customer.id);
  return { ok: true as const };
}

export async function loginCustomer(input: { email: string; password: string }) {
  const customer = await prisma.customer.findUnique({ where: { email: input.email } });
  if (!customer || !(await verifyPassword(input.password, customer.passwordHash))) {
    return { ok: false as const, error: "Incorrect email or password." };
  }
  await createCustomerSession(customer.id);
  return { ok: true as const };
}

export async function logoutCustomer() {
  await destroyCustomerSession();
}
