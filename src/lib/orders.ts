import "server-only";
import { connection } from "next/server";
import { prisma } from "./prisma";
import { getCurrentUser } from "./current-user";
import type { Item } from "@/types";

export interface BuyerOrder {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: number;
  paidAt: number | null;
  items: { id: string; title: string; price: number; slug?: string }[];
}

export interface SellerOrder {
  orderId: string;
  status: string;
  buyerName: string;
  buyerEmail: string;
  createdAt: number;
  paidAt: number | null;
  items: { id: string; title: string; price: number; slug?: string }[];
  totalForSeller: number;
}

export async function getCheckoutInfo(slug: string) {
  await connection();
  const user = await getCurrentUser();
  if (!user) return null;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      bids: { orderBy: { amount: "desc" }, take: 1, include: { user: { select: { id: true } } } },
      orderItems: { select: { id: true } },
      category: true,
      seller: true,
    },
  });
  if (!product) return { product: null, canBuy: false, reason: "Lot not found.", price: 0, user };

  if (product.orderItems.length > 0) {
    return { product, canBuy: false, reason: "This lot has already been purchased.", price: 0, user };
  }

  const now = Date.now();

  if (product.saleType === "buynow") {
    return { product, canBuy: true, reason: null, price: product.buyNowPrice ?? product.currentBid, user };
  }

  const endsAt = product.endsAt.getTime();
  if (endsAt > now) {
    return { product, canBuy: false, reason: "This auction is still live.", price: 0, user };
  }

  const winner = product.bids[0];
  if (!winner) {
    return { product, canBuy: false, reason: "This auction ended without a winning bid.", price: 0, user };
  }
  if (winner.user.id !== user.id) {
    return { product, canBuy: false, reason: "You did not win this auction.", price: 0, user };
  }
  return { product, canBuy: true, reason: null, price: winner.amount, user };
}

export async function getMyBuyerOrders(): Promise<BuyerOrder[]> {
  await connection();
  const user = await getCurrentUser();
  if (!user) return [];
  const rows = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: { select: { slug: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((o) => ({
    id: o.id,
    status: o.status,
    totalAmount: o.totalAmount,
    createdAt: o.createdAt.getTime(),
    paidAt: o.paidAt?.getTime() ?? null,
    items: o.items.map((it) => ({
      id: it.id,
      title: it.title,
      price: it.price,
      slug: it.product?.slug,
    })),
  }));
}

export async function getMySellerOrders(): Promise<SellerOrder[]> {
  await connection();
  const user = await getCurrentUser();
  if (!user) return [];
  const items = await prisma.orderItem.findMany({
    where: { sellerId: user.id },
    include: {
      product: { select: { slug: true } },
      order: { include: { user: { select: { name: true, email: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const map = new Map<string, SellerOrder>();
  for (const it of items) {
    const o = it.order;
    if (!map.has(o.id)) {
      map.set(o.id, {
        orderId: o.id,
        status: o.status,
        buyerName: o.user.name,
        buyerEmail: o.user.email,
        createdAt: o.createdAt.getTime(),
        paidAt: o.paidAt?.getTime() ?? null,
        items: [],
        totalForSeller: 0,
      });
    }
    const entry = map.get(o.id)!;
    entry.items.push({ id: it.id, title: it.title, price: it.price, slug: it.product?.slug });
    entry.totalForSeller += it.price;
  }
  return Array.from(map.values());
}