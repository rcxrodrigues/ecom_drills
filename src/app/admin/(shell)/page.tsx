import Link from "next/link";
import { getDashboardStats, getAnalyticsForRange, getLiveVisitorCount, type AnalyticsRange } from "@/lib/queries";
import { formatPrice } from "@/lib/format";
import { StatCard } from "@/components/admin/StatCard";
import { LiveVisitorsCard } from "@/components/admin/LiveVisitorsCard";

const RANGE_LABELS: Record<AnalyticsRange, string> = {
  D1: "Last 24 hours",
  D7: "Last 7 days",
  D30: "Last 30 days",
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rangeParam } = await searchParams;
  const range: AnalyticsRange = rangeParam === "D1" || rangeParam === "D7" || rangeParam === "D30" ? rangeParam : "D7";

  const [stats, analytics, liveCount] = await Promise.all([
    getDashboardStats(),
    getAnalyticsForRange(range),
    getLiveVisitorCount(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-foreground-strong">Dashboard</h1>

      <LiveVisitorsCard initialCount={liveCount} />

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground-strong">Store performance</h2>
        <div className="flex gap-1 rounded-button border border-border-subtle bg-white p-1">
          {(Object.keys(RANGE_LABELS) as AnalyticsRange[]).map((r) => (
            <Link
              key={r}
              href={`/admin?range=${r}`}
              className={`rounded-input px-3 py-1.5 text-xs font-medium ${
                range === r ? "bg-brand-black text-white" : "text-foreground-strong hover:bg-neutral-100"
              }`}
            >
              {r === "D1" ? "D-1" : r === "D7" ? "D-7" : "D-30"}
            </Link>
          ))}
        </div>
      </div>
      <p className="mb-4 text-xs text-foreground/60">{RANGE_LABELS[range]}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Visits" value={String(analytics.visitCount)} sublabel="unique sessions" />
        <StatCard label="Orders" value={String(analytics.orderCount)} sublabel={`${analytics.paidOrderCount} paid`} />
        <StatCard label="Sales" value={formatPrice(analytics.sales)} sublabel="paid orders only" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
