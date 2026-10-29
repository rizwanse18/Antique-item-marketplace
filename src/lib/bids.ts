import "server-only";
import { prisma } from "./prisma";
import type { BidEntry } from "@/types";

export async function getBidHistory(productId: string, limit = 25): Promise<BidEntry[]> {
  const rows = await prisma.bid.findMany({
    where: { productId },
    include: { user: { select: { name: true } } },
    orderBy: { amount: "desc" },
    take: limit,
  });
  return rows.map((b) => ({ user: b.user.name, amount: b.amount, ts: b.createdAt.getTime() }));
}