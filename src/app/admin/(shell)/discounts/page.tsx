import { getAllDiscountsForAdmin } from "@/lib/queries";
import { AdminDiscountsClient } from "@/components/admin/AdminDiscountsClient";

export default async function AdminDiscountsPage() {
  const discounts = await getAllDiscountsForAdmin();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-foreground-strong">Discount Codes</h1>
      <AdminDiscountsClient discounts={discounts.map((d) => ({ ...d, expiresAt: d.expiresAt?.toISOString() ?? null }))} />
    </div>
  );
}
