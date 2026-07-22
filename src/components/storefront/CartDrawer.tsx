"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { ProductPicture } from "@/components/ui/ProductPicture";
import { Button, ButtonLink } from "@/components/ui/Button";
import { checkDiscountCode } from "@/app/actions/discount";

export function CartDrawer() {
  const cart = useCart();
  const [code, setCode] = useState(cart.discount?.code ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!cart.isOpen) return null;

  function applyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await checkDiscountCode(code);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      cart.setDiscount(result.discount);
    });
  }

  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="Close basket" className="absolute inset-0 bg-black/40 animate-fade-in" onClick={cart.close} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md animate-slide-in flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <h2 className="text-base font-semibold text-foreground-strong">Your Basket ({cart.count})</h2>
          <button aria-label="Close basket" onClick={cart.close} className="flex h-9 w-9 items-center justify-center rounded-input hover:bg-neutral-100">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="#121212" strokeWidth={1.6}>
              <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
            <p className="text-sm text-foreground">Your basket is empty.</p>
            <Button onClick={cart.close}>Continue shopping</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-4">
                {cart.items.map((item) => (
                  <li key={item.variantId} className="flex gap-3">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-input border border-border-subtle">
                      <ProductPicture src={item.image} alt={item.name} className="h-full w-full" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <Link href={`/products/${item.handle}`} onClick={cart.close} className="text-sm font-medium text-foreground-strong hover:underline">
                        {item.name}
                      </Link>
                      {item.variantTitle && <p className="text-xs text-foreground">{item.variantTitle}</p>}
                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center rounded-input border border-border-subtle">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            className="h-7 w-7 text-sm"
                            onClick={() => cart.updateQuantity(item.variantId, item.quantity - 1)}
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            className="h-7 w-7 text-sm"
                            onClick={() => cart.updateQuantity(item.variantId, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-medium text-foreground-strong">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => cart.removeItem(item.variantId)}
                      className="self-start text-foreground/50 hover:text-foreground-strong"
                    >
                      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.4}>
                        <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border-subtle px-5 py-4">
              <form onSubmit={applyCode} className="mb-4 flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Discount code"
                  className="h-10 flex-1 rounded-input border border-border-subtle px-3 text-sm focus:outline-none focus:border-brand-black"
                />
                <Button type="submit" variant="secondary" size="sm" disabled={pending}>
                  Apply
                </Button>
              </form>
              {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
              {cart.discount && (
                <div className="mb-2 flex items-center justify-between text-xs text-foreground">
                  <span>Code {cart.discount.code} applied</span>
                  <button type="button" className="underline" onClick={() => cart.setDiscount(null)}>
                    Remove
                  </button>
                </div>
              )}
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-foreground">Subtotal</span>
                <span className="font-medium text-foreground-strong">{formatPrice(cart.subtotal)}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-foreground">Discount</span>
                  <span className="font-medium text-foreground-strong">−{formatPrice(cart.discountAmount)}</span>
                </div>
              )}
              <ButtonLink href="/checkout" onClick={cart.close} className="w-full">
                Checkout — {formatPrice(cart.total)}
              </ButtonLink>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
