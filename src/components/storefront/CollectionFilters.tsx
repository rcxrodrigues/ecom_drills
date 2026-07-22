"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select } from "@/components/ui/Input";

export function CollectionFilters({
  voltages,
  batteryTypes,
  brands,
}: {
  voltages: string[];
  batteryTypes: string[];
  brands: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function toggleValue(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(key);
    params.delete(key);
    if (current.includes(value)) {
      current.filter((v) => v !== value).forEach((v) => params.append(key, v));
    } else {
      [...current, value].forEach((v) => params.append(key, v));
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("sort", value);
    else params.delete("sort");
    router.push(`${pathname}?${params.toString()}`);
  }

  function setPrice(key: "minPrice" | "maxPrice", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  const activeVoltages = searchParams.getAll("voltage");
  const activeBatteryTypes = searchParams.getAll("batteryType");
  const activeBrands = searchParams.getAll("brand");

  return (
    <aside className="flex flex-col gap-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground-strong">Sort by</h3>
        <Select defaultValue={searchParams.get("sort") ?? ""} onChange={(e) => setSort(e.target.value)}>
          <option value="">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </Select>
      </div>

      {voltages.length > 0 && (
        <FilterGroup title="Voltage" options={voltages} active={activeVoltages} onToggle={(v) => toggleValue("voltage", v)} />
      )}
      {batteryTypes.length > 0 && (
        <FilterGroup
          title="Battery type"
          options={batteryTypes}
          active={activeBatteryTypes}
          onToggle={(v) => toggleValue("batteryType", v)}
        />
      )}
      {brands.length > 0 && (
        <FilterGroup title="Brand" options={brands} active={activeBrands} onToggle={(v) => toggleValue("brand", v)} />
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground-strong">Price</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("minPrice") ?? ""}
            onBlur={(e) => setPrice("minPrice", e.target.value)}
            className="h-10 w-full rounded-input border border-border-subtle px-2.5 text-sm focus:outline-none focus:border-brand-black"
          />
          <span className="text-foreground/50">–</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("maxPrice") ?? ""}
            onBlur={(e) => setPrice("maxPrice", e.target.value)}
            className="h-10 w-full rounded-input border border-border-subtle px-2.5 text-sm focus:outline-none focus:border-brand-black"
          />
        </div>
      </div>
    </aside>
  );
}

function FilterGroup({
  title,
  options,
  active,
  onToggle,
}: {
  title: string;
  options: string[];
  active: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-foreground-strong">{title}</h3>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={active.includes(opt)}
              onChange={() => onToggle(opt)}
              className="h-4 w-4 rounded-[3px] border-border-subtle accent-brand-black"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
