"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import type { Prisma } from "@/generated/prisma/client";
import { SECTION_TYPES } from "@/lib/constants";

const DEFAULT_CONFIG: Record<(typeof SECTION_TYPES)[number], Record<string, unknown>> = {
  HERO: {
    heading: "New heading",
    subheading: "",
    buttonText: "Shop now",
    buttonLink: "/collections/best-sellers",
    image: "illustration:cordless-drill",
  },
  COUNTDOWN_BAR: { text: "Limited-time offer", endsInHours: 48, buttonText: "Shop now", buttonLink: "/" },
  COLLECTION_CAROUSEL: { collectionHandle: "best-sellers", heading: "" },
  TESTIMONIALS: { heading: "What our customers say" },
  IMAGE_TEXT: {
    heading: "New section",
    body: "",
    image: "illustration:hammer-drill",
    buttonText: "",
    buttonLink: "",
    imagePosition: "left",
  },
  FAQ: { heading: "Frequently asked questions", items: [] },
  NEWSLETTER: { heading: "Sign up for offers", subheading: "" },
};

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function createSection(type: (typeof SECTION_TYPES)[number], page = "home") {
  await requireAdmin();
  const maxPosition = await prisma.section.aggregate({ where: { page }, _max: { position: true } });
  const section = await prisma.section.create({
    data: {
      page,
      type,
      position: (maxPosition._max.position ?? -1) + 1,
      enabled: true,
      config: DEFAULT_CONFIG[type] as Prisma.InputJsonValue,
    },
  });
  revalidatePath("/admin/sections");
  revalidatePath("/");
  return { id: section.id };
}

export async function saveSectionConfig(id: string, config: Record<string, unknown>) {
  await requireAdmin();
  await prisma.section.update({ where: { id }, data: { config: config as Prisma.InputJsonValue } });
  revalidatePath("/admin/sections");
  revalidatePath("/");
  return { ok: true as const };
}

export async function deleteSection(id: string) {
  await requireAdmin();
  await prisma.section.delete({ where: { id } });
  revalidatePath("/admin/sections");
  revalidatePath("/");
}

export async function toggleSectionEnabled(id: string, enabled: boolean) {
  await requireAdmin();
  await prisma.section.update({ where: { id }, data: { enabled } });
  revalidatePath("/admin/sections");
  revalidatePath("/");
}

export async function reorderSections(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(orderedIds.map((id, i) => prisma.section.update({ where: { id }, data: { position: i } })));
  revalidatePath("/admin/sections");
  revalidatePath("/");
}
