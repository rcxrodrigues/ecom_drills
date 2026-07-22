"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice, discountPercentage } from "@/lib/format";
import { DiscountBadge } from "@/components/ui/DiscountBadge";
import { VerifiedRatingBadge } from "@/components/ui/VerifiedRatingBadge";
import { Button } from "@/components/ui/Button";

type Variant = {
  id: string;
  title: string;
  voltage: string;
  colour: string;
  kit: string;
  priceDelta: number;
  stock: number;
};

export function ProductPurchasePanel({
  productId,
  handle,
  name,
  price,
  salePrice,
  image,
  variants,
  avgRating,
  ratingCount,
}: {
  productId: string;
  handle: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
  variants: Variant[];
  avgRating: number;
  ratingCount: number;
}) {
  const cart = useCart();
  const [added, setAdded] = useState(false);

  const groups = useMemo(() => {
    const build = (key: "voltage" | "colour" | "kit", label: string) => {
      const values = Array.from(new Set(variants.map((v) => v[key]).filter(Boolean)));
      return values.length > 1 ? { key, label, values } : null;
    };
    return [build("voltage", "Voltage"), build("colour", "Colour"), build("kit", "Kit")].filter(
      (g): g is { key: "voltage" | "colour" | "kit"; label: string; values: string[] } => g !== null
    );
  }, [variants]);

  const [selection, setSelection] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const g of groups) initial[g.key] = variants[0]?.[g.key] ?? "";
    return initial;
  });

  const selectedVariant = useMemo(() => {
    return (
      variants.find((v) => groups.every((g) => v[g.key] === selection[g.key])) ?? variants[0]
    );
  }, [variants, groups, selection]);

  if (!selectedVariant) return null;

  const unitPrice = price + selectedVariant.priceDelta;
  const unitSalePrice = salePrice != null ? salePrice + selectedVariant.priceDelta : null;
  const pct = unitSalePrice ? discountPercentage(unitPrice, unitSalePrice) : 0;
  const outOfStock = selectedVariant.stock <= 0;

  function addToBasket() {
    cart.addItem({
      productId,
      variantId: selectedVariant!.id,
      handle,
      name,
      variantTitle: selectedVariant!.title,
      image,
      price: unitSalePrice ?? unitPrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground-strong sm:text-3xl">{name}</h1>
        {ratingCount > 0 && (
          <div className="mt-2">
            <VerifiedRatingBadge rating={avgRating} count={ratingCount} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {unitSalePrice ? (
          <>
            <span className="text-2xl font-semibold text-foreground-strong">{formatPrice(unitSalePrice)}</span>
            <span className="text-lg text-foreground/50 line-through">{formatPrice(unitPrice)}</span>
            <DiscountBadge percentage={pct} />
          </>
        ) : (
          <span className="text-2xl font-semibold text-foreground-strong">{formatPrice(unitPrice)}</span>
        )}
      </div>

      {groups.map((g) => (
        <div key={g.key}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-strong">{g.label}</p>
          <div className="flex flex-wrap gap-2">
            {g.values.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setSelection((s) => ({ ...s, [g.key]: v }))}
                className={`rounded-button border px-3.5 py-2 text-sm font-medium transition-colors ${
                  selection[g.key] === v
                    ? "border-brand-black bg-brand-black text-white"
                    : "border-border-subtle text-foreground-strong hover:border-brand-black"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      ))}

      <Button size="lg" className="w-full" disabled={outOfStock} onClick={addToBasket}>
        {outOfStock ? "Out of stock" : added ? "Added ✓" : "Add to Basket"}
      </Button>
    </div>
  );
}
