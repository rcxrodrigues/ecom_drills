"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getLiveVisitorCount } from "@/lib/queries";
import { getAdminSession } from "@/lib/auth";

export async function recordVisit(path: string) {
  const store = await cookies();
  const visitorId = store.get("toolvo_visitor_id")?.value;
  if (!visitorId) return;

  await prisma.visit.create({ data: { sessionId: visitorId, path } }).catch(() => {});
}

export async function fetchLiveVisitorCount() {
  const session = await getAdminSession();
  if (!session) return 0;
  return getLiveVisitorCount();
}
