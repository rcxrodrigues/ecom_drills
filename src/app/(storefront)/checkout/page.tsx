"use client";

import { useState, useTransition } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { Label, Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProductPicture } from "@/components/ui/ProductPicture";
import { CheckoutPaymentForm } from "@/components/storefront/CheckoutPaymentForm";
import { placeOrder, createPaymentIntent } from "@/app/actions/checkout";
import { checkDiscountCode } from "@/app/actions/discount";
import Link from "next/link";

const DELIVERY_OPTIONS = [
  { value: "STANDARD", label: "Standard delivery", detail: "2–4 working days", price: 4.99 },
  { value: "EXPRESS", label: "Express delivery", detail: "1–2 working days", price: 7.99 },
  { value: "NEXT_DAY", label: "Next-day delivery", detail: "Order before 2pm", price: 12.99 },
] as const;

export default function CheckoutPage() {
  const cart = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState<(typeof DELIVERY_OPTIONS)[number]["value"]>("STANDARD");
  const [code, setCode] = useState(cart.discount?.code ?? "");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [payment, setPayment] = useState<{ orderId: string; orderNumber: string; clientSecret: string; total: number } | null>(null);

  const freeStandard = deliveryMethod === "STANDARD" && cart.total >= 50;
  const shipping = freeStandard ? 0 : DELIVERY_OPTIONS.find((d) => d.value === deliveryMethod)!.price;
  const grandTotal = cart.total + shipping;

  function applyCode() {
    setCodeError(null);
    startTransition(async () => {
      const result = await checkDiscountCode(code);
      if (!result.ok) {
        setCodeError(result.error);
        return;
      }
      cart.setDiscount(result.discount);
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      firstName: String(form.get("firstName") ?? ""),
      lastName: String(form.get("lastName") ?? ""),
      addressLine1: String(form.get("addressLine1") ?? ""),
      addressLine2: String(form.get("addressLine2") ?? ""),
      city: String(form.get("city") ?? ""),
      postcode: String(form.get("postcode") ?? ""),
      deliveryMethod,
      discountCode: cart.discount?.code,
      items: cart.items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
    };

    startTransition(async () => {
      const result = await placeOrder(payload);
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      const intent = await createPaymentIntent(result.orderId);
      if (!intent.ok || !intent.clientSecret) {
        setFormError(intent.ok ? "Could not start payment." : intent.error);
        return;
      }
      setPayment({ orderId: result.orderId, orderNumber: result.orderNumber, clientSecret: intent.clientSecret, total: result.total });
    });
  }

  if (cart.items.length === 0 && !payment) {
    return (
      <div className="page-container flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-sm text-foreground">Your basket is empty.</p>
        <Link href="/" className="text-sm font-medium text-foreground-strong underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (payment) {
    return (
      <div className="page-container max-w-lg py-10">
        <h1 className="mb-2 text-2xl font-semibold text-foreground-strong">Payment</h1>
        <p className="mb-8 text-sm text-foreground">Order {payment.orderNumber} — enter your card details to complete your purchase.</p>
        <CheckoutPaymentForm
          clientSecret={payment.clientSecret}
          orderId={payment.orderId}
          orderNumber={payment.orderNumber}
          total={payment.total}
        />
      </div>
    );
  }

  return (
    <div className="page-container py-10">
      <h1 className="mb-8 text-2xl font-semibold text-foreground-strong">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="mb-4 text-base font-semibold text-foreground-strong">Contact details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="phone">Phone number (optional)</Label>
                <Input id="phone" name="phone" type="tel" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-base font-semibold text-foreground-strong">Delivery address</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" name="firstName" required />
              </div>
              <div>
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" name="lastName" required />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="addressLine1">Address line 1</Label>
                <Input id="addressLine1" name="addressLine1" required />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="addressLine2">Address line 2 (optional)</Label>
                <Input id="addressLine2" name="addressLine2" />
              </div>
              <div>
                <Label htmlFor="city">Town / City</Label>
                <Input id="city" name="city" required />
              </div>
              <div>
                <Label htmlFor="postcode">Postcode</Label>
                <Input id="postcode" name="postcode" required className="uppercase" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-base font-semibold text-foreground-strong">Delivery method</h2>
            <div className="flex flex-col gap-2">
              {DELIVERY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center justify-between rounded-button border p-3.5 text-sm ${
                    deliveryMethod === opt.value ? "border-brand-black" : "border-border-subtle"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliveryMethodRadio"
                      checked={deliveryMethod === opt.value}
                      onChange={() => setDeliveryMethod(opt.value)}
                      className="h-4 w-4 accent-brand-black"
                    />
                    <span>
                      <span className="block font-medium text-foreground-strong">{opt.label}</span>
                      <span className="block text-xs text-foreground/70">{opt.detail}</span>
                    </span>
                  </span>
                  <span className="font-medium text-foreground-strong">
                    {opt.value === "STANDARD" && freeStandard ? "Free" : formatPrice(opt.price)}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <Button type="submit" size="lg" disabled={pending} className="w-full lg:hidden">
            {pending ? "Please wait…" : `Continue to payment — ${formatPrice(grandTotal)}`}
          </Button>
        </div>

        <aside className="h-fit rounded-button border border-border-subtle p-5 lg:sticky lg:top-24">
          <h2 className="mb-4 text-base font-semibold text-foreground-strong">Order summary</h2>
          <ul className="flex flex-col gap-3">
            {cart.items.map((item) => (
              <li key={item.variantId} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-input border border-border-subtle">
                  <ProductPicture src={item.image} alt={item.name} className="h-full w-full" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-black text-[10px] font-semibold text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex flex-1 flex-col text-sm">
                  <span className="font-medium text-foreground-strong">{item.name}</span>
                  {item.variantTitle && <span className="text-xs text-foreground/70">{item.variantTitle}</span>}
                </div>
                <span className="text-sm font-medium text-foreground-strong">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex gap-2 border-t border-border-subtle pt-4">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyCode();
                }
              }}
              placeholder="Discount code"
              className="h-10 flex-1 rounded-input border border-border-subtle px-3 text-sm focus:outline-none focus:border-brand-black"
            />
            <Button type="button" variant="secondary" size="sm" disabled={pending} onClick={applyCode}>
              Apply
            </Button>
          </div>
          {codeError && <p className="mt-1 text-xs text-red-600">{codeError}</p>}

          <div className="mt-4 flex flex-col gap-1.5 border-t border-border-subtle pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground">Subtotal</span>
              <span className="font-medium text-foreground-strong">{formatPrice(cart.subtotal)}</span>
            </div>
            {cart.discountAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-foreground">Discount</span>
                <span className="font-medium text-foreground-strong">−{formatPrice(cart.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-foreground">Delivery</span>
              <span className="font-medium text-foreground-strong">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-border-subtle pt-2 text-base">
              <span className="font-semibold text-foreground-strong">Total</span>
              <span className="font-semibold text-foreground-strong">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <Button type="submit" size="lg" disabled={pending} className="mt-5 hidden w-full lg:flex">
            {pending ? "Please wait…" : "Continue to payment"}
          </Button>
        </aside>
      </form>
    </div>
  );
}
