import { getAllOrdersForAdmin } from "@/lib/queries";
import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersForAdmin();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-foreground-strong">Orders</h1>
      <AdminOrdersClient orders={orders} />
    </div>
  );
}
