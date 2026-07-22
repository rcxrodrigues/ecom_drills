import { searchProducts } from "@/lib/queries";
import { ProductCard } from "@/components/storefront/ProductCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const products = q ? await searchProducts(q) : [];

  return (
    <div className="page-container py-10">
      <h1 className="mb-8 text-2xl font-semibold text-foreground-strong">
        {q ? `Search results for "${q}"` : "Search"}
      </h1>
      {q && products.length === 0 && <p className="text-sm text-foreground">No products found. Try another search term.</p>}
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
