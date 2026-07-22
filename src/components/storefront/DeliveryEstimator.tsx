"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Result = { area: string; standard: string; express: string } | { error: string };

const REMOTE_REGIONS = ["Highland", "Na h-Eileanan", "Shetland", "Orkney", "Isle of Wight", "Isles of Scilly"];

async function lookupPostcode(postcode: string): Promise<Result> {
  const clean = postcode.trim().toUpperCase();
  try {
    const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(clean)}`);
    if (!res.ok) return { error: "We couldn't find that postcode — please check and try again." };
    const data = await res.json();
    const region: string = data.result?.region || data.result?.country || "";
    const district: string = data.result?.admin_district || "";
    const remote = REMOTE_REGIONS.some((r) => region.includes(r) || district.includes(r));
    if (remote) return { area: district || region, standard: "3–5 working days", express: "Not available" };
    if (region === "London") return { area: "London", standard: "1–2 working days", express: "Next working day" };
    return { area: district || region || "UK", standard: "2–4 working days", express: "1–2 working days" };
  } catch {
    return { error: "Couldn't check delivery right now — please try again shortly." };
  }
}

export function DeliveryEstimator() {
  const [postcode, setPostcode] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!postcode.trim()) return;
    setLoading(true);
    setResult(await lookupPostcode(postcode));
    setLoading(false);
  }

  return (
    <div className="rounded-button border border-border-subtle p-4">
      <p className="mb-3 text-sm font-semibold text-foreground-strong">Check delivery to your postcode</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="e.g. SW1A 1AA"
          className="h-10 flex-1 rounded-input border border-border-subtle px-3 text-sm uppercase focus:outline-none focus:border-brand-black"
        />
        <Button type="submit" variant="secondary" size="sm" disabled={loading}>
          {loading ? "Checking…" : "Check"}
        </Button>
      </form>
      {result && "error" in result && <p className="mt-3 text-xs text-red-600">{result.error}</p>}
      {result && "area" in result && (
        <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-foreground">
          <div>
            <dt className="text-foreground/60">Standard delivery</dt>
            <dd className="font-medium text-foreground-strong">{result.standard}</dd>
          </div>
          <div>
            <dt className="text-foreground/60">Express delivery</dt>
            <dd className="font-medium text-foreground-strong">{result.express}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
