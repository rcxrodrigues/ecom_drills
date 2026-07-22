"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/app/actions/admin-products";
import { DeleteButton } from "@/components/admin/DeleteButton";

export function ProductRowActions({ id }: { id: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3">
      <Link href={`/admin/products/${id}`} className="text-xs font-medium text-foreground-strong underline">
        Edit
      </Link>
      <DeleteButton
        onDelete={async () => {
          await deleteProduct(id);
          router.refresh();
        }}
      />
    </div>
  );
}
