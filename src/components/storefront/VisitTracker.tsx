"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordVisit } from "@/app/actions/analytics";
import { useCart } from "@/lib/cart-context";

const HEARTBEAT_MS = 30_000;

export function VisitTracker() {
  const pathname = usePathname();
  const cart = useCart();
  const hasCartItems = cart.items.length > 0;

  useEffect(() => {
    recordVisit(pathname, hasCartItems);
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") recordVisit(pathname, hasCartItems);
    }, HEARTBEAT_MS);
    return () => clearInterval(interval);
  }, [pathname, hasCartItems]);

  return null;
}
