import Link from "next/link";
import { getAllCollectionsForAdmin } from "@/lib/queries";
import { CollectionListClient } from "@/components/admin/CollectionListClient";

export default async function AdminCollectionsPage() {
  const collections = await getAllCollectionsForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground-strong">Collections</h1>
          <p className="mt-1 text-sm text-foreground">Drag to reorder how collections appear on the homepage and in menus.</p>
        </div>
        <Link href="/admin/collections/new" className="rounded-button bg-brand-black px-4 py-2.5 text-sm font-medium text-white">
          Add collection
        </Link>
      </div>
      <CollectionListClient collections={collections} />
    </div>
  );
}
