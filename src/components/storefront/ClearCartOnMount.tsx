"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";

export function ClearCartOnMount() {
  const cart = useCart();
  useEffect(() => {
    cart.clear();
    // Only ever needs to run once, when this page mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
