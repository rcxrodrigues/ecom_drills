"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordVisit } from "@/app/actions/analytics";

const HEARTBEAT_MS = 30_000;

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    recordVisit(pathname);
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") recordVisit(pathname);
    }, HEARTBEAT_MS);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
