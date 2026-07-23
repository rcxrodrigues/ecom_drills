"use client";

import { useEffect, useState } from "react";
import { fetchLiveVisitorCount } from "@/app/actions/analytics";

const POLL_MS = 15_000;

export function LiveVisitorsCard({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const tick = () => {
      fetchLiveVisitorCount().then(setCount).catch(() => {});
    };
    const interval = setInterval(tick, POLL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 rounded-button border border-border-subtle bg-white p-5">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
      </span>
      <div>
        <p className="text-2xl font-bold text-foreground-strong">{count}</p>
        <p className="text-xs text-foreground/60">{count === 1 ? "person" : "people"} on your store right now</p>
      </div>
    </div>
  );
}
