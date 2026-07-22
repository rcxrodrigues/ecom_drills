import Link from "next/link";
import { getDashboardStats } from "@/lib/queries";
import { formatPrice } from "@/lib/format";
import { StatCard } from "@/components/admin/StatCard";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-foreground-strong">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total sales" value={formatPrice(stats.totalSales)} sublabel={`${stats.orderCount} orders`} />
        <StatCard
          label="Sales (last 30 days)"
          value={formatPrice(stats.salesLast30Days)}
          sublabel={`${stats.ordersLast30Days} orders`}
        />
        <StatCard label="Average rating" value={stats.avgRating.toFixed(1)} sublabel={`${stats.reviewCount} approved reviews`} />
        <StatCard label="Products" value={String(stats.productCount)} sublabel={`${stats.pendingReviews} reviews awaiting moderation`} />
      </div>

      <div className="mt-8 rounded-button border border-border-subtle bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-foreground-strong">Most-viewed products</h2>
        {stats.mostViewed.length === 0 ? (
          <p className="text-sm text-foreground">No product views recorded yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border-subtle">
            {stats.mostViewed.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-foreground-strong">
                  {i + 1}. {p.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-foreground/60">{p.views} views</span>
                  <Link href={`/products/${p.handle}`} target="_blank" className="text-xs font-medium text-foreground-strong underline">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/products/new" className="rounded-button bg-brand-black px-4 py-2.5 text-sm font-medium text-white">
          Add product
        </Link>
        <Link href="/admin/collections" className="rounded-button border border-brand-black px-4 py-2.5 text-sm font-medium text-foreground-strong">
          Manage collections
        </Link>
        <Link href="/admin/sections" className="rounded-button border border-brand-black px-4 py-2.5 text-sm font-medium text-foreground-strong">
          Edit homepage
        </Link>
      </div>
    </div>
  );
}
