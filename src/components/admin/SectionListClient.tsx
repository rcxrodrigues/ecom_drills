"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { DragList } from "@/components/admin/DragList";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { reorderSections, deleteSection, toggleSectionEnabled, createSection } from "@/app/actions/admin-sections";
import { SECTION_TYPES } from "@/lib/constants";

type SectionRow = { id: string; type: string; enabled: boolean; position: number };

const TYPE_LABELS: Record<string, string> = {
  HERO: "Hero banner",
  COUNTDOWN_BAR: "Countdown promo bar",
  COLLECTION_CAROUSEL: "Collection carousel",
  TESTIMONIALS: "Testimonials carousel",
  IMAGE_TEXT: "Image + text banner",
  FAQ: "FAQ accordion",
  NEWSLETTER: "Newsletter signup",
};

export function SectionListClient({ sections }: { sections: SectionRow[] }) {
  const [items, setItems] = useState(sections);
  const [newType, setNewType] = useState<string>(SECTION_TYPES[0]);
  const [, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <Select value={newType} onChange={(e) => setNewType(e.target.value)} className="max-w-xs">
          {SECTION_TYPES.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </Select>
        <Button
          type="button"
          onClick={async () => {
            const { id } = await createSection(newType as (typeof SECTION_TYPES)[number]);
            router.push(`/admin/sections/${id}`);
          }}
        >
          Add section
        </Button>
      </div>

      <DragList
        items={items}
        getKey={(s) => s.id}
        onReorder={(next) => {
          setItems(next);
          startTransition(() => reorderSections(next.map((s) => s.id)));
        }}
        renderItem={(s) => (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground-strong">{TYPE_LABELS[s.type] ?? s.type}</span>
              {!s.enabled && <span className="rounded-input bg-neutral-100 px-2 py-0.5 text-xs text-foreground/60">Hidden</span>}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-xs font-medium text-foreground-strong underline"
                onClick={() => {
                  const enabled = !s.enabled;
                  setItems((prev) => prev.map((i) => (i.id === s.id ? { ...i, enabled } : i)));
                  startTransition(() => toggleSectionEnabled(s.id, enabled));
                }}
              >
                {s.enabled ? "Hide" : "Show"}
              </button>
              <Link href={`/admin/sections/${s.id}`} className="text-xs font-medium text-foreground-strong underline">
                Edit
              </Link>
              <DeleteButton
                onDelete={async () => {
                  await deleteSection(s.id);
                  setItems((prev) => prev.filter((i) => i.id !== s.id));
                  router.refresh();
                }}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
