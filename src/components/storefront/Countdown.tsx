"use client";

import { useEffect, useState } from "react";

function getEndTime(hours: number) {
  const key = "toolvo_promo_ends_at";
  const stored = typeof window !== "undefined" ? window.sessionStorage.getItem(key) : null;
  if (stored) {
    const t = Number(stored);
    if (t > Date.now()) return t;
  }
  const end = Date.now() + hours * 60 * 60 * 1000;
  if (typeof window !== "undefined") window.sessionStorage.setItem(key, String(end));
  return end;
}

function splitDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function Countdown({ hours, className = "" }: { hours: number; className?: string }) {
  const [endTime] = useState(() => getEndTime(hours));
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    // Client-only tick: SSR renders nothing (now === null) to avoid a hydration
    // mismatch, so this first synchronous tick is what reveals the countdown.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    return () => clearInterval(id);
  }, []);

  if (now === null) return null;

  const { hours: h, minutes: m, seconds: s } = splitDuration(endTime - now);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className={`flex items-center gap-2 font-mono text-sm font-semibold tabular-nums ${className}`}>
      <span className="rounded-input bg-brand-black px-2 py-1 text-white">{pad(h)}</span>:
      <span className="rounded-input bg-brand-black px-2 py-1 text-white">{pad(m)}</span>:
      <span className="rounded-input bg-brand-black px-2 py-1 text-white">{pad(s)}</span>
    </div>
  );
}
