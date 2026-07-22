"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { DragList } from "@/components/admin/DragList";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { reorderCollections, deleteCollection } from "@/app/actions/admin-collections";

type CollectionRow = { id: string; handle: string; name: string; showOnHomepage: boolean; productCount: number };

export function CollectionListClient({ collections }: { collections: CollectionRow[] }) {
  const [items, setItems] = useState(collections);
  const [, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DragList
      items={items}
      getKey={(c) => c.id}
      onReorder={(next) => {
        setItems(next);
        startTransition(() => reorderCollections(next.map((c) => c.id)));
      }}
      renderItem={(c) => (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground-strong">{c.name}</p>
            <p className="text-xs text-foreground/60">
              /collections/{c.handle} · {c.productCount} product{c.productCount === 1 ? "" : "s"}
              {c.showOnHomepage && " · on homepage"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/admin/collections/${c.id}`} className="text-xs font-medium text-foreground-strong underline">
              Edit
            </Link>
            <DeleteButton
              onDelete={async () => {
                await deleteCollection(c.id);
                setItems((prev) => prev.filter((i) => i.id !== c.id));
                router.refresh();
              }}
            />
          </div>
        </div>
      )}
    />
  );
}
