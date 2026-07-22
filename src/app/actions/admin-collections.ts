"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const collectionSchema = z.object({
  id: z.string().optional(),
  handle: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Handle may only contain lowercase letters, numbers and hyphens."),
  name: z.string().min(1),
  description: z.string().default(""),
  coverImage: z.string().default(""),
  showOnHomepage: z.boolean().default(true),
  autoIncludeDays: z.number().int().min(0).nullable(),
});

export type CollectionInput = z.infer<typeof collectionSchema>;

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function saveCollection(input: CollectionInput) {
  await requireAdmin();
  const parsed = collectionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid collection data." };
  }
  const data = parsed.data;

  try {
    let id = data.id;
    if (data.id) {
      await prisma.collection.update({
        where: { id: data.id },
        data: {
          handle: data.handle,
          name: data.name,
          description: data.description,
          coverImage: data.coverImage,
          showOnHomepage: data.showOnHomepage,
          autoIncludeDays: data.autoIncludeDays,
        },
      });
    } else {
      const maxPosition = await prisma.collection.aggregate({ _max: { position: true } });
      const created = await prisma.collection.create({
        data: {
          handle: data.handle,
          name: data.name,
          description: data.description,
          coverImage: data.coverImage,
          showOnHomepage: data.showOnHomepage,
          autoIncludeDays: data.autoIncludeDays,
          position: (maxPosition._max.position ?? -1) + 1,
        },
      });
      id = created.id;
    }
    revalidatePath("/admin/collections");
    revalidatePath("/");
    return { ok: true as const, id: id! };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save collection.";
    return { ok: false as const, error: message.includes("Unique constraint") ? "That handle is already in use." : message };
  }
}

export async function deleteCollection(id: string) {
  await requireAdmin();
  await prisma.collection.delete({ where: { id } });
  revalidatePath("/admin/collections");
  revalidatePath("/");
}

export async function reorderCollections(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(orderedIds.map((id, i) => prisma.collection.update({ where: { id }, data: { position: i } })));
  revalidatePath("/admin/collections");
  revalidatePath("/");
}

export async function updateCollectionProducts(collectionId: string, orderedProductIds: string[]) {
  await requireAdmin();
  await prisma.$transaction([
    prisma.collectionProduct.deleteMany({ where: { collectionId } }),
    prisma.collectionProduct.createMany({
      data: orderedProductIds.map((productId, i) => ({ collectionId, productId, position: i })),
    }),
  ]);
  revalidatePath("/admin/collections");
  revalidatePath("/");
}
