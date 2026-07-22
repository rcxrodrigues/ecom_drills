import { getAllCollections } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const collections = await getAllCollections();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-foreground-strong">Add product</h1>
      <ProductForm collections={collections.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}
