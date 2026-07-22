import Link from "next/link";
import { getAllProductsForAdmin } from "@/lib/queries";
import { formatPrice } from "@/lib/format";
import { ProductPicture } from "@/components/ui/ProductPicture";
import { ProductRowActions } from "@/components/admin/ProductRowActions";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground-strong">Products</h1>
        <Link href="/admin/products/new" className="rounded-button bg-brand-black px-4 py-2.5 text-sm font-medium text-white">
          Add product
        </Link>
      </div>

      <div className="overflow-hidden rounded-button border border-border-subtle bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-subtle bg-neutral-50 text-xs uppercase tracking-wide text-foreground/60">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-input border border-border-subtle">
                      <ProductPicture src={p.image} alt={p.name} className="h-full w-full" />
                    </div>
                    <Link href={`/admin/products/${p.id}`} className="font-medium text-foreground-strong hover:underline">
                      {p.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground">{p.category}</td>
                <td className="px-4 py-3 text-foreground-strong">
                  {p.salePrice ? (
                    <>
                      {formatPrice(p.salePrice)} <span className="text-foreground/50 line-through">{formatPrice(p.price)}</span>
                    </>
                  ) : (
                    formatPrice(p.price)
                  )}
                </td>
                <td className="px-4 py-3 text-foreground">{p.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-input px-2 py-0.5 text-xs font-medium ${
                      p.published ? "bg-neutral-100 text-foreground-strong" : "bg-neutral-100 text-foreground/50"
                    }`}
                  >
                    {p.published ? "Published" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ProductRowActions id={p.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-6 text-center text-sm text-foreground">No products yet.</p>}
      </div>
    </div>
  );
}
