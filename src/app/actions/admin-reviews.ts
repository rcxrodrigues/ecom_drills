"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
}

export async function setReviewStatus(id: string, status: "APPROVED" | "REJECTED" | "PENDING") {
  await requireAdmin();
  await prisma.review.update({ where: { id }, data: { status } });
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export async function setReviewFeatured(id: string, featured: boolean) {
  await requireAdmin();
  await prisma.review.update({ where: { id }, data: { featured } });
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export async function replyToReview(id: string, adminReply: string) {
  await requireAdmin();
  await prisma.review.update({ where: { id }, data: { adminReply: adminReply || null } });
  revalidatePath("/admin/reviews");
}

export async function deleteReview(id: string) {
  await requireAdmin();
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}
