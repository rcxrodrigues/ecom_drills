import { notFound } from "next/navigation";
import { getAllCollections, getProductForAdmin } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [collections, product] = await Promise.all([getAllCollections(), getProductForAdmin(id)]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-foreground-strong">Edit product</h1>
      <ProductForm
        collections={collections.map((c) => ({ id: c.id, name: c.name }))}
        initial={{
          id: product.id,
          handle: product.handle,
          name: product.name,
          description: product.description,
          brand: product.brand,
          category: product.category,
          price: product.price,
          salePrice: product.salePrice,
          sku: product.sku,
          stock: product.stock,
          power: product.power,
          voltage: product.voltage,
          batteryType: product.batteryType,
          torque: product.torque,
          weight: product.weight,
          includedItems: product.includedItems,
          published: product.published,
          specs: Object.entries(product.specs as Record<string, string>).map(([key, value]) => ({ key, value })),
          images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
          variants: product.variants.map((v) => ({
            id: v.id,
            title: v.title,
            voltage: v.voltage,
            colour: v.colour,
            kit: v.kit,
            sku: v.sku,
            priceDelta: v.priceDelta,
            stock: v.stock,
          })),
          collectionIds: product.collectionIds,
        }}
      />
    </div>
  );
}
