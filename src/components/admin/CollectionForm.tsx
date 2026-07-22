"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { saveCollection, updateCollectionProducts, type CollectionInput } from "@/app/actions/admin-collections";
import { DragList } from "@/components/admin/DragList";
import { ProductPicture } from "@/components/ui/ProductPicture";

const ILLUSTRATION_OPTIONS = [
  "illustration:cordless-drill",
  "illustration:impact-driver",
  "illustration:hammer-drill",
  "illustration:bench-drill",
  "illustration:screwdriver",
  "illustration:battery",
  "illustration:drill-bits",
  "illustration:case",
  "illustration:charger",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CollectionForm({
  initial,
  assignedProducts,
  allProducts,
}: {
  initial?: CollectionInput;
  assignedProducts?: { id: string; name: string; image: string }[];
  allProducts?: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [handleEdited, setHandleEdited] = useState(Boolean(initial));

  const [form, setForm] = useState<CollectionInput>(
    initial ?? {
      handle: "",
      name: "",
      description: "",
      coverImage: "illustration:cordless-drill",
      showOnHomepage: true,
      autoIncludeDays: null,
    }
  );

  const [products, setProducts] = useState(assignedProducts ?? []);
  const [addProductId, setAddProductId] = useState("");
  const [productsSaving, startProductsTransition] = useTransition();

  function update<K extends keyof CollectionInput>(key: K, value: CollectionInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveCollection(form);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/admin/collections/${result.id}`);
      router.refresh();
    });
  }

  function persistProducts(next: { id: string; name: string; image: string }[]) {
    setProducts(next);
    if (form.id) {
      startProductsTransition(() => updateCollectionProducts(form.id!, next.map((p) => p.id)));
    }
  }

  const availableToAdd = (allProducts ?? []).filter((p) => !products.some((existing) => existing.id === p.id));

  return (
    <div className="flex flex-col gap-8 pb-16">
      <form onSubmit={handleSubmit} className="rounded-button border border-border-subtle bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground-strong">Collection details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => {
                update("name", e.target.value);
                if (!handleEdited) update("handle", slugify(e.target.value));
              }}
            />
          </div>
          <div>
            <Label htmlFor="handle">URL handle</Label>
            <Input
              id="handle"
              required
              value={form.handle}
              onChange={(e) => {
                setHandleEdited(true);
                update("handle", slugify(e.target.value));
              }}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="coverImage">Cover image</Label>
            <Select id="coverImage" value={form.coverImage} onChange={(e) => update("coverImage", e.target.value)}>
              {ILLUSTRATION_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o.replace("illustration:", "")}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="autoIncludeDays">Auto-include products for N days after creation (optional)</Label>
            <Input
              id="autoIncludeDays"
              type="number"
              min={0}
              value={form.autoIncludeDays ?? ""}
              onChange={(e) => update("autoIncludeDays", e.target.value ? Number(e.target.value) : null)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground-strong sm:col-span-2">
            <input
              type="checkbox"
              checked={form.showOnHomepage}
              onChange={(e) => update("showOnHomepage", e.target.checked)}
              className="h-4 w-4 accent-brand-black"
            />
            Show on homepage
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={pending} className="mt-5">
          {pending ? "Saving…" : "Save collection"}
        </Button>
      </form>

      {form.id && (
        <section className="rounded-button border border-border-subtle bg-white p-5">
          <h2 className="mb-1 text-sm font-semibold text-foreground-strong">Products in this collection</h2>
          <p className="mb-4 text-xs text-foreground/60">Drag to reorder how products appear in this collection.</p>

          <div className="mb-4 flex gap-2">
            <Select value={addProductId} onChange={(e) => setAddProductId(e.target.value)}>
              <option value="">Select a product to add…</option>
              {availableToAdd.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
            <Button
              type="button"
              variant="secondary"
              disabled={!addProductId}
              onClick={() => {
                const product = availableToAdd.find((p) => p.id === addProductId);
                if (!product) return;
                persistProducts([...products, { id: product.id, name: product.name, image: "illustration:cordless-drill" }]);
                setAddProductId("");
              }}
            >
              Add
            </Button>
          </div>

          {products.length === 0 ? (
            <p className="text-sm text-foreground">No products assigned yet.</p>
          ) : (
            <DragList
              items={products}
              getKey={(p) => p.id}
              onReorder={persistProducts}
              renderItem={(p) => (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 overflow-hidden rounded-input border border-border-subtle">
                      <ProductPicture src={p.image} alt={p.name} className="h-full w-full" />
                    </div>
                    <span className="text-sm font-medium text-foreground-strong">{p.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => persistProducts(products.filter((existing) => existing.id !== p.id))}
                    className="text-xs font-medium text-red-600 underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            />
          )}
          {productsSaving && <p className="mt-2 text-xs text-foreground/50">Saving order…</p>}
        </section>
      )}
    </div>
  );
}
