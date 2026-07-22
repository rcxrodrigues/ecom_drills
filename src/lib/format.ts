export function formatPrice(amount: number | string): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export function discountPercentage(price: number | string, salePrice: number | string): number {
  const p = typeof price === "string" ? Number(price) : price;
  const s = typeof salePrice === "string" ? Number(salePrice) : salePrice;
  if (!p || p <= 0 || s >= p) return 0;
  return Math.round(((p - s) / p) * 100);
}
