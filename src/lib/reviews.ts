import "server-only";
import { connection } from "next/server";
import { prisma } from "./prisma";
import { getCurrentUser } from "./current-user";

export interface ReviewView {
  id: string;
  reviewerName: string;
  rating: number;
  body: string;
  createdAt: number;
}

export async function getSellerReviews(sellerId: string, limit = 20): Promise<ReviewView[]> {
  await connection();
  const rows = await prisma.review.findMany({
    where: { sellerId },
    include: { reviewer: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map((r) => ({
    id: r.id,
    reviewerName: r.reviewer.name,
    rating: r.rating,
    body: r.body ?? "",
    createdAt: r.createdAt.getTime(),
  }));
}

export interface ReviewableOrder {
  orderId: string;
  sellerId: string;
  sellerName: string;
  itemsSummary: string;
  orderStatus: string;
  alreadyReviewed: boolean;
}

export async function getMyReviewableOrders(): Promise<ReviewableOrder[]> {
  await connection();
  const me = await getCurrentUser();
  if (!me) return [];

  const orders = await prisma.order.findMany({
    where: { userId: me.id, status: { in: ["paid", "delivered"] } },
    include: {
      items: true,
      reviews: { select: { sellerId: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const out: ReviewableOrder[] = [];
  const seenSellers = new Set<string>();

  for (const o of orders) {
    for (const item of o.items) {
      const key = o.id + ":" + item.sellerId;
      if (seenSellers.has(key)) continue;
      seenSellers.add(key);

      const seller = await prisma.user.findUnique({
        where: { id: item.sellerId },
        select: { name: true },
      });

      out.push({
        orderId: o.id,
        sellerId: item.sellerId,
        sellerName: seller?.name ?? "Seller",
        itemsSummary: item.title,
        orderStatus: o.status,
        alreadyReviewed: o.reviews.some((r) => r.sellerId === item.sellerId),
      });
    }
  }
  return out;
}

export async function canReviewOrder(orderId: string, sellerId: string): Promise<boolean> {
  await connection();
  const me = await getCurrentUser();
  if (!me) return false;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, reviews: true },
  });
  if (!order) return false;
  if (order.userId !== me.id) return false;
  if (!["paid", "delivered"].includes(order.status)) return false;
  if (!order.items.some((i) => i.sellerId === sellerId)) return false;
  if (order.reviews.some((r) => r.sellerId === sellerId)) return false;
  if (me.id === sellerId) return false;

  return true;
}