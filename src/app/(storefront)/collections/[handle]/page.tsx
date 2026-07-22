import { notFound } from "next/navigation";
import { getFilteredCollectionProducts, type ProductFilters } from "@/lib/queries";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CollectionFilters } from "@/components/storefront/CollectionFilters";

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toNumberParam(value: string | string[] | undefined): number | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  const n = v ? Number(v) : undefined;
  return typeof n === "number" && !Number.isNaN(n) ? n : undefined;
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { handle } = await params;
  const sp = await searchParams;

  const filters: ProductFilters = {
    voltage: toArray(sp.voltage),
    batteryType: toArray(sp.batteryType),
    brand: toArray(sp.brand),
    minPrice: toNumberParam(sp.minPrice),
    maxPrice: toNumberParam(sp.maxPrice),
    sort: (Array.isArray(sp.sort) ? sp.sort[0] : sp.sort) as ProductFilters["sort"],
  };

  const { collection, products, facets } = await getFilteredCollectionProducts(handle, filters);
  if (!collection) notFound();

  return (
    <div className="page-container py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground-strong sm:text-3xl">{collection.name}</h1>
        {collection.description && <p className="mt-2 max-w-2xl text-sm text-foreground">{collection.description}</p>}
      </div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <CollectionFilters voltages={facets.voltages} batteryTypes={facets.batteryTypes} brands={facets.brands} />
        <div>
          {products.length === 0 ? (
            <p className="text-sm text-foreground">No products match these filters.</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
