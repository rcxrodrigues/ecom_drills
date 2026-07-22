"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { ProductPicture } from "@/components/ui/ProductPicture";
import { formatPrice } from "@/lib/format";

type Item = {
  id: string;
  handle: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
  variantId: string;
};

export function CompleteYourKit({ items }: { items: Item[] }) {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-border-subtle py-10">
      <h2 className="mb-5 text-lg font-semibold text-foreground-strong">Complete your kit</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <QuickAddCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function QuickAddCard({ item }: { item: Item }) {
  const cart = useCart();
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-col gap-2 rounded-button border border-border-subtle p-3">
      <Link href={`/products/${item.handle}`} className="relative aspect-square w-full overflow-hidden rounded-input">
        <ProductPicture src={item.image} alt={item.name} className="h-full w-full" />
      </Link>
      <Link href={`/products/${item.handle}`} className="text-xs font-medium text-foreground-strong line-clamp-2">
        {item.name}
      </Link>
      <span className="text-xs font-semibold text-foreground-strong">{formatPrice(item.salePrice ?? item.price)}</span>
      <button
        type="button"
        onClick={() => {
          cart.addItem({
            productId: item.id,
            variantId: item.variantId,
            handle: item.handle,
            name: item.name,
            variantTitle: "",
            image: item.image,
            price: item.salePrice ?? item.price,
          });
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="mt-1 h-8 rounded-button border border-brand-black text-xs font-medium text-foreground-strong hover:bg-brand-black hover:text-white"
      >
        {added ? "Added ✓" : "+ Add"}
      </button>
    </div>
  );
}
