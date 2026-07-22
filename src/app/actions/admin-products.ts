"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const variantSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  voltage: z.string().default(""),
  colour: z.string().default(""),
  kit: z.string().default(""),
  sku: z.string().min(1),
  priceDelta: z.number().default(0),
  stock: z.number().int().min(0),
});

const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().default(""),
});

const specSchema = z.object({ key: z.string().min(1), value: z.string().min(1) });

const productSchema = z.object({
  id: z.string().optional(),
  handle: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Handle may only contain lowercase letters, numbers and hyphens."),
  name: z.string().min(1),
  description: z.string().default(""),
  brand: z.string().default("Toolvo"),
  category: z.string().default(""),
  price: z.number().min(0),
  salePrice: z.number().min(0).nullable(),
  sku: z.string().min(1),
  stock: z.number().int().min(0),
  power: z.string().default(""),
  voltage: z.string().default(""),
  batteryType: z.string().default(""),
  torque: z.string().default(""),
  weight: z.string().default(""),
  includedItems: z.string().default(""),
  published: z.boolean().default(true),
  specs: z.array(specSchema).default([]),
  images: z.array(imageSchema).min(1, "Add at least one image."),
  variants: z.array(variantSchema).min(1, "Add at least one variant."),
  collectionIds: z.array(z.string()).default([]),
});

export type ProductInput = z.infer<typeof productSchema>;

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function saveProduct(input: ProductInput) {
  await requireAdmin();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid product data." };
  }
  const data = parsed.data;
  const specsObject = Object.fromEntries(data.specs.map((s) => [s.key, s.value]));

  try {
    const product = await prisma.$transaction(async (tx) => {
      const saved = data.id
        ? await tx.product.update({
            where: { id: data.id },
            data: {
              handle: data.handle,
              name: data.name,
              description: data.description,
              brand: data.brand,
              category: data.category,
              price: data.price,
              salePrice: data.salePrice,
              sku: data.sku,
              stock: data.stock,
              power: data.power,
              voltage: data.voltage,
              batteryType: data.batteryType,
              torque: data.torque,
              weight: data.weight,
              includedItems: data.includedItems,
              published: data.published,
              specs: specsObject,
            },
          })
        : await tx.product.create({
            data: {
              handle: data.handle,
              name: data.name,
              description: data.description,
              brand: data.brand,
              category: data.category,
              price: data.price,
              salePrice: data.salePrice,
              sku: data.sku,
              stock: data.stock,
              power: data.power,
              voltage: data.voltage,
              batteryType: data.batteryType,
              torque: data.torque,
              weight: data.weight,
              includedItems: data.includedItems,
              published: data.published,
              specs: specsObject,
            },
          });

      await tx.productImage.deleteMany({ where: { productId: saved.id } });
      await tx.productImage.createMany({
        data: data.images.map((img, i) => ({ productId: saved.id, url: img.url, alt: img.alt, position: i })),
      });

      await tx.productVariant.deleteMany({ where: { productId: saved.id } });
      await tx.productVariant.createMany({
        data: data.variants.map((v, i) => ({
          productId: saved.id,
          title: v.title,
          voltage: v.voltage,
          colour: v.colour,
          kit: v.kit,
          sku: v.sku,
          priceDelta: v.priceDelta,
          stock: v.stock,
          position: i,
        })),
      });

      await tx.collectionProduct.deleteMany({ where: { productId: saved.id } });
      await tx.collectionProduct.createMany({
        data: data.collectionIds.map((collectionId, i) => ({ collectionId, productId: saved.id, position: i })),
      });

      return saved;
    });

    revalidatePath("/admin/products");
    revalidatePath(`/products/${product.handle}`);
    revalidatePath("/");
    return { ok: true as const, id: product.id, handle: product.handle };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save product.";
    const friendly = message.includes("Unique constraint") ? "That handle or SKU is already in use." : message;
    return { ok: false as const, error: friendly };
  }
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function toggleProductPublished(id: string, published: boolean) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { published } });
  revalidatePath("/admin/products");
}
