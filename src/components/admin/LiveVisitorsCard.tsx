"use client";

import { useEffect, useState } from "react";
import { fetchLivePresence } from "@/app/actions/analytics";

const POLL_MS = 15_000;

type Presence = { browsing: number; cart: number; checkout: number; total: number };

export function LiveVisitorsCard({ initial }: { initial: Presence }) {
  const [presence, setPresence] = useState(initial);

  useEffect(() => {
    const tick = () => {
      fetchLivePresence().then(setPresence).catch(() => {});
    };
    const interval = setInterval(tick, POLL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-button border border-border-subtle bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>
        <div>
          <p className="text-2xl font-bold text-foreground-strong">{presence.total}</p>
          <p className="text-xs text-foreground/60">{presence.total === 1 ? "person" : "people"} on your store right now</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border-subtle pt-4">
        <div>
          <p className="text-lg font-semibold text-foreground-strong">{presence.browsing}</p>
          <p className="text-xs text-foreground/60">Online</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground-strong">{presence.cart}</p>
          <p className="text-xs text-foreground/60">In basket</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground-strong">{presence.checkout}</p>
          <p className="text-xs text-foreground/60">Checking out</p>
        </div>
      </div>
    </div>
  );
}
