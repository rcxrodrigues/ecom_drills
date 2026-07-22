import Link from "next/link";
import { getProductCardsByCollection } from "@/lib/queries";
import { ProductCard } from "@/components/storefront/ProductCard";

export type CollectionCarouselConfig = {
  collectionHandle: string;
  heading?: string;
};

export async function CollectionCarousel({ config }: { config: CollectionCarouselConfig }) {
  const { collection, products } = await getProductCardsByCollection(config.collectionHandle);
  if (!collection || products.length === 0) return null;

  return (
    <section className="py-10 lg:py-14">
      <div className="page-container">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-semibold text-foreground-strong sm:text-2xl">{config.heading ?? collection.name}</h2>
          <Link href={`/collections/${collection.handle}`} className="text-sm font-medium text-foreground-strong underline underline-offset-4">
            View all
          </Link>
        </div>
        <div className="scrollbar-hidden -mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} className="w-44 shrink-0 snap-start sm:w-56" />
          ))}
        </div>
      </div>
    </section>
  );
}
