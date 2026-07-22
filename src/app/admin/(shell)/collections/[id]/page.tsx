import { notFound } from "next/navigation";
import { getCollectionForAdmin, getAllProductsForAdmin } from "@/lib/queries";
import { CollectionForm } from "@/components/admin/CollectionForm";

export default async function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [collection, allProducts] = await Promise.all([getCollectionForAdmin(id), getAllProductsForAdmin()]);
  if (!collection) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-foreground-strong">Edit collection</h1>
      <CollectionForm
        initial={{
          id: collection.id,
          handle: collection.handle,
          name: collection.name,
          description: collection.description,
          coverImage: collection.coverImage,
          showOnHomepage: collection.showOnHomepage,
          autoIncludeDays: collection.autoIncludeDays,
        }}
        assignedProducts={collection.products}
        allProducts={allProducts.map((p) => ({ id: p.id, name: p.name }))}
      />
    </div>
  );
}
