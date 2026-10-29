import "server-only";
import { connection } from "next/server";
import { prisma } from "./prisma";
import { getCurrentUser } from "./current-user";
import { toItem } from "./products";
import type { Item } from "@/types";

export async function getSellerProfileForCurrentUser() {
  await connection();
  const user = await getCurrentUser();
  if (!user) return null;
  return prisma.sellerProfile.findUnique({ where: { userId: user.id } });
}

export async function getMyListings(): Promise<Item[]> {
  await connection();
  const user = await getCurrentUser();
  if (!user) return [];
  const rows = await prisma.product.findMany({
    where: { sellerId: user.id },
    include: { category: true, seller: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toItem);
}

export async function getSellerStats(userId: string) {
  await connection();
  const [total, live] = await Promise.all([
    prisma.product.count({ where: { sellerId: userId } }),
    prisma.product.count({ where: { sellerId: userId, endsAt: { gt: new Date() } } }),
  ]);
  const products = await prisma.product.findMany({
    where: { sellerId: userId },
    select: { bidsCount: true, currentBid: true, watchers: true },
  });
  const totalBids = products.reduce((s,p)=>s+p.bidsCount,0);
  const totalViews = products.reduce((s,p)=>s+p.watchers,0);
  const highestBid = products.reduce((m,p)=>Math.max(m,p.currentBid),0);
  const revenueEstimate = products.reduce((s,p)=>s+p.currentBid,0);
  return { total, live, totalBids, totalViews, highestBid, revenueEstimate };
}