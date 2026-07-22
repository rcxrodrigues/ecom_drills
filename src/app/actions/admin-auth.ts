"use server";

import { prisma } from "@/lib/prisma";
import { verifyPassword, createAdminSession, destroyAdminSession } from "@/lib/auth";

export async function loginAdmin(input: { email: string; password: string }) {
  const admin = await prisma.adminUser.findUnique({ where: { email: input.email.trim().toLowerCase() } });
  if (!admin || !(await verifyPassword(input.password, admin.passwordHash))) {
    return { ok: false as const, error: "Incorrect email or password." };
  }
  await createAdminSession(admin.id);
  return { ok: true as const };
}

export async function logoutAdmin() {
  await destroyAdminSession();
}
