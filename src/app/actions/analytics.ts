"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getLivePresenceBreakdown } from "@/lib/queries";
import { getAdminSession } from "@/lib/auth";

export async function recordVisit(path: string, hasCartItems = false) {
  const store = await cookies();
  const visitorId = store.get("toolvo_visitor_id")?.value;
  if (!visitorId) return;

  await prisma.visit.create({ data: { sessionId: visitorId, path, hasCartItems } }).catch(() => {});
}

export async function fetchLivePresence() {
  const session = await getAdminSession();
  if (!session) return { browsing: 0, cart: 0, checkout: 0, total: 0 };
  return getLivePresenceBreakdown();
}
