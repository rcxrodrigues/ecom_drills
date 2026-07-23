import Link from "next/link";
import { ProductPicture } from "@/components/ui/ProductPicture";
import { DiscountBadge } from "@/components/ui/DiscountBadge";
import { formatPrice, discountPercentage } from "@/lib/format";

export type ProductCardData = {
  handle: string;
  name: string;
  price: number;
  salePrice?: number | null;
  image: string;
  isNew?: boolean;
};

export function ProductCard({ product, className = "" }: { product: ProductCardData; className?: string }) {
  const pct = product.salePrice ? discountPercentage(product.price, product.salePrice) : 0;
  return (
    <Link href={`/products/${product.handle}`} className={`group flex flex-col ${className}`}>
      <div className="relative aspect-square w-full overflow-hidden rounded-button border border-border-subtle">
        <ProductPicture src={product.image} alt={product.name} className="h-full w-full transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {pct > 0 && <DiscountBadge percentage={pct} />}
          {product.isNew && (
            <span className="inline-flex items-center rounded-button border border-brand-black bg-white px-2 py-1 text-xs font-semibold text-foreground-strong">
              New
            </span>
          )}
        </div>
      </div>
      <div className="mt-3 text-center">
        <h3 className="text-sm font-medium text-foreground-strong">{product.name}</h3>
        <div className="mt-1 flex items-center justify-center gap-2">
          {product.salePrice ? (
            <>
              <span className="text-sm font-semibold text-foreground-strong">{formatPrice(product.salePrice)}</span>
              <span className="text-sm text-foreground/50 line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-sm font-semibold text-foreground-strong">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
