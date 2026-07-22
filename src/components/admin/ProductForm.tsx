"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { saveProduct, type ProductInput } from "@/app/actions/admin-products";

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

type FormProduct = ProductInput;

export function ProductForm({
  collections,
  initial,
}: {
  collections: { id: string; name: string }[];
  initial?: FormProduct;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [handleEdited, setHandleEdited] = useState(Boolean(initial));

  const [form, setForm] = useState<FormProduct>(
    initial ?? {
      handle: "",
      name: "",
      description: "",
      brand: "Toolvo",
      category: "",
      price: 0,
      salePrice: null,
      sku: "",
      stock: 0,
      power: "",
      voltage: "",
      batteryType: "",
      torque: "",
      weight: "",
      includedItems: "",
      published: true,
      specs: [],
      images: [{ url: "illustration:cordless-drill", alt: "" }],
      variants: [{ title: "Standard", voltage: "", colour: "", kit: "", sku: "", priceDelta: 0, stock: 0 }],
      collectionIds: [],
    }
  );

  const datalistId = useMemo(() => "illustration-options", []);

  function update<K extends keyof FormProduct>(key: K, value: FormProduct[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveProduct(form);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-16">
      <section className="rounded-button border border-border-subtle bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground-strong">Basic details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Product name</Label>
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
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" required value={form.sku} onChange={(e) => update("sku", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" value={form.brand} onChange={(e) => update("brand", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={form.category} onChange={(e) => update("category", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground-strong sm:col-span-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => update("published", e.target.checked)}
              className="h-4 w-4 accent-brand-black"
            />
            Published (visible on the storefront)
          </label>
        </div>
      </section>

      <section className="rounded-button border border-border-subtle bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground-strong">Pricing & stock</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="price">Regular price (£)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min={0}
              required
              value={form.price}
              onChange={(e) => update("price", Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="salePrice">Sale price (£, optional)</Label>
            <Input
              id="salePrice"
              type="number"
              step="0.01"
              min={0}
              value={form.salePrice ?? ""}
              onChange={(e) => update("salePrice", e.target.value ? Number(e.target.value) : null)}
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              min={0}
              required
              value={form.stock}
              onChange={(e) => update("stock", Number(e.target.value))}
            />
          </div>
        </div>
      </section>

      <section className="rounded-button border border-border-subtle bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground-strong">Technical specifications</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="power">Power</Label>
            <Input id="power" value={form.power} onChange={(e) => update("power", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="voltage">Voltage</Label>
            <Input id="voltage" value={form.voltage} onChange={(e) => update("voltage", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="batteryType">Battery type</Label>
            <Input id="batteryType" value={form.batteryType} onChange={(e) => update("batteryType", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="torque">Torque</Label>
            <Input id="torque" value={form.torque} onChange={(e) => update("torque", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="weight">Weight</Label>
            <Input id="weight" value={form.weight} onChange={(e) => update("weight", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="includedItems">Included accessories</Label>
            <Input id="includedItems" value={form.includedItems} onChange={(e) => update("includedItems", e.target.value)} />
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-strong">Additional specs</p>
          {form.specs.map((spec, i) => (
            <div key={i} className="mb-2 flex gap-2">
              <Input
                placeholder="Label"
                value={spec.key}
                onChange={(e) =>
                  update(
                    "specs",
                    form.specs.map((s, si) => (si === i ? { ...s, key: e.target.value } : s))
                  )
                }
              />
              <Input
                placeholder="Value"
                value={spec.value}
                onChange={(e) =>
                  update(
                    "specs",
                    form.specs.map((s, si) => (si === i ? { ...s, value: e.target.value } : s))
                  )
                }
              />
              <button
                type="button"
                onClick={() => update("specs", form.specs.filter((_, si) => si !== i))}
                className="shrink-0 px-2 text-sm text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => update("specs", [...form.specs, { key: "", value: "" }])}
            className="text-xs font-medium text-foreground-strong underline"
          >
            + Add spec
          </button>
        </div>
      </section>

      <section className="rounded-button border border-border-subtle bg-white p-5">
        <h2 className="mb-1 text-sm font-semibold text-foreground-strong">Images</h2>
        <p className="mb-4 text-xs text-foreground/60">
          Paste an image URL, or type one of the built-in placeholder illustrations (e.g. illustration:hammer-drill).
        </p>
        <datalist id={datalistId}>
          {ILLUSTRATION_OPTIONS.map((o) => (
            <option key={o} value={o} />
          ))}
        </datalist>
        {form.images.map((img, i) => (
          <div key={i} className="mb-2 flex gap-2">
            <Input
              list={datalistId}
              placeholder="Image URL or illustration:variant"
              value={img.url}
              onChange={(e) =>
                update(
                  "images",
                  form.images.map((im, ii) => (ii === i ? { ...im, url: e.target.value } : im))
                )
              }
            />
            <Input
              placeholder="Alt text"
              value={img.alt}
              onChange={(e) =>
                update(
                  "images",
                  form.images.map((im, ii) => (ii === i ? { ...im, alt: e.target.value } : im))
                )
              }
            />
            <button
              type="button"
              onClick={() => update("images", form.images.filter((_, ii) => ii !== i))}
              className="shrink-0 px-2 text-sm text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => update("images", [...form.images, { url: "illustration:cordless-drill", alt: "" }])}
          className="text-xs font-medium text-foreground-strong underline"
        >
          + Add image
        </button>
      </section>

      <section className="rounded-button border border-border-subtle bg-white p-5">
        <h2 className="mb-1 text-sm font-semibold text-foreground-strong">Variants</h2>
        <p className="mb-4 text-xs text-foreground/60">
          Add one row per purchasable variant (e.g. voltage, colour or kit). Price delta is added to the base price.
        </p>
        {form.variants.map((v, i) => (
          <div key={i} className="mb-3 grid grid-cols-2 gap-2 rounded-input border border-border-subtle p-3 sm:grid-cols-7">
            <Input
              placeholder="Title"
              className="sm:col-span-2"
              value={v.title}
              onChange={(e) =>
                update(
                  "variants",
                  form.variants.map((vv, vi) => (vi === i ? { ...vv, title: e.target.value } : vv))
                )
              }
            />
            <Input
              placeholder="Voltage"
              value={v.voltage}
              onChange={(e) =>
                update(
                  "variants",
                  form.variants.map((vv, vi) => (vi === i ? { ...vv, voltage: e.target.value } : vv))
                )
              }
            />
            <Input
              placeholder="Colour"
              value={v.colour}
              onChange={(e) =>
                update(
                  "variants",
                  form.variants.map((vv, vi) => (vi === i ? { ...vv, colour: e.target.value } : vv))
                )
              }
            />
            <Input
              placeholder="Kit"
              value={v.kit}
              onChange={(e) =>
                update(
                  "variants",
                  form.variants.map((vv, vi) => (vi === i ? { ...vv, kit: e.target.value } : vv))
                )
              }
            />
            <Input
              placeholder="SKU"
              value={v.sku}
              onChange={(e) =>
                update(
                  "variants",
                  form.variants.map((vv, vi) => (vi === i ? { ...vv, sku: e.target.value } : vv))
                )
              }
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Price delta"
              value={v.priceDelta}
              onChange={(e) =>
                update(
                  "variants",
                  form.variants.map((vv, vi) => (vi === i ? { ...vv, priceDelta: Number(e.target.value) } : vv))
                )
              }
            />
            <Input
              type="number"
              placeholder="Stock"
              value={v.stock}
              onChange={(e) =>
                update(
                  "variants",
                  form.variants.map((vv, vi) => (vi === i ? { ...vv, stock: Number(e.target.value) } : vv))
                )
              }
            />
            <button
              type="button"
              onClick={() => update("variants", form.variants.filter((_, vi) => vi !== i))}
              className="col-span-2 text-left text-xs text-red-600 sm:col-span-7"
            >
              Remove variant
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            update("variants", [
              ...form.variants,
              { title: "", voltage: "", colour: "", kit: "", sku: "", priceDelta: 0, stock: 0 },
            ])
          }
          className="text-xs font-medium text-foreground-strong underline"
        >
          + Add variant
        </button>
      </section>

      <section className="rounded-button border border-border-subtle bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground-strong">Collections</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {collections.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm text-foreground-strong">
              <input
                type="checkbox"
                checked={form.collectionIds.includes(c.id)}
                onChange={(e) =>
                  update(
                    "collectionIds",
                    e.target.checked ? [...form.collectionIds, c.id] : form.collectionIds.filter((id) => id !== c.id)
                  )
                }
                className="h-4 w-4 accent-brand-black"
              />
              {c.name}
            </label>
          ))}
        </div>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save product"}
        </Button>
      </div>
    </form>
  );
}
