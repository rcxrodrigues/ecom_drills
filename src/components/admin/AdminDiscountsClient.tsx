"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatDate, formatPrice } from "@/lib/format";
import { Label, Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { saveDiscount, deleteDiscount, type DiscountInput } from "@/app/actions/admin-discounts";

type Discount = {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  expiresAt: string | Date | null;
  usageLimit: number | null;
  usedCount: number;
  active: boolean;
};

const empty: DiscountInput = { code: "", type: "PERCENTAGE", value: 10, expiresAt: null, usageLimit: null, active: true };

export function AdminDiscountsClient({ discounts }: { discounts: Discount[] }) {
  const [form, setForm] = useState<DiscountInput>(empty);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveDiscount(form);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setForm(empty);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={submit} className="rounded-button border border-border-subtle bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground-strong">
          {form.id ? "Edit discount code" : "Create discount code"}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="code">Code</Label>
            <Input id="code" required value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              id="type"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "PERCENTAGE" | "FIXED" }))}
            >
              <option value="PERCENTAGE">Percentage off</option>
              <option value="FIXED">Fixed amount off (£)</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              type="number"
              min={0}
              step="0.01"
              required
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="expiresAt">Expiry date (optional)</Label>
            <Input
              id="expiresAt"
              type="date"
              value={form.expiresAt ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value || null }))}
            />
          </div>
          <div>
            <Label htmlFor="usageLimit">Usage limit (optional)</Label>
            <Input
              id="usageLimit"
              type="number"
              min={0}
              value={form.usageLimit ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value ? Number(e.target.value) : null }))}
            />
          </div>
          <label className="flex items-center gap-2 self-end text-sm text-foreground-strong">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              className="h-4 w-4 accent-brand-black"
            />
            Active
          </label>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-4 flex gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : form.id ? "Update code" : "Create code"}
          </Button>
          {form.id && (
            <Button type="button" variant="secondary" onClick={() => setForm(empty)}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-button border border-border-subtle bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-subtle bg-neutral-50 text-xs uppercase tracking-wide text-foreground/60">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Value</th>
              <th className="px-4 py-3 font-medium">Expires</th>
              <th className="px-4 py-3 font-medium">Used</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {discounts.map((d) => (
              <tr key={d.id}>
                <td className="px-4 py-3 font-medium text-foreground-strong">{d.code}</td>
                <td className="px-4 py-3 text-foreground">{d.type === "PERCENTAGE" ? `${d.value}%` : formatPrice(d.value)}</td>
                <td className="px-4 py-3 text-foreground">{d.expiresAt ? formatDate(d.expiresAt) : "No expiry"}</td>
                <td className="px-4 py-3 text-foreground">
                  {d.usedCount}
                  {d.usageLimit ? ` / ${d.usageLimit}` : ""}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-input bg-neutral-100 px-2 py-0.5 text-xs font-medium text-foreground-strong">
                    {d.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      className="text-xs font-medium text-foreground-strong underline"
                      onClick={() =>
                        setForm({
                          id: d.id,
                          code: d.code,
                          type: d.type,
                          value: d.value,
                          expiresAt: d.expiresAt ? new Date(d.expiresAt).toISOString().slice(0, 10) : null,
                          usageLimit: d.usageLimit,
                          active: d.active,
                        })
                      }
                    >
                      Edit
                    </button>
                    <DeleteButton
                      onDelete={async () => {
                        await deleteDiscount(d.id);
                        router.refresh();
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {discounts.length === 0 && <p className="p-6 text-center text-sm text-foreground">No discount codes yet.</p>}
      </div>
    </div>
  );
}
