import "server-only";
import { connection } from "next/server";
import { prisma } from "./prisma";
import type { Item, SaleType } from "@/types";

const include = {
  category: true,
  seller: true,
  images: { orderBy: [{ isPrimary: "desc" }, { order: "asc" }] },
} as const;

type ProductRow = Awaited<ReturnType<typeof prisma.product.findFirst<{ include: typeof include }>>>;

export function toItem(row: NonNullable<ProductRow>): Item {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category?.name ?? "",
    categorySlug: row.category?.slug ?? "",
    era: row.era ?? "",
    origin: row.origin ?? "",
    description: row.description,
    saleType: row.saleType as SaleType,
    startingBid: row.startingBid,
    currentBid: row.currentBid,
    buyNowPrice: row.buyNowPrice ?? undefined,
    bidsCount: row.bidsCount,
    endsAt: row.endsAt.toISOString(),
    sellerId: row.sellerId,
    watchers: row.watchers,
    plate: { from: row.plateFrom, to: row.plateTo },
    images: (row.images ?? []).map((img) => ({
      url: img.url,
      isPrimary: img.isPrimary,
      order: img.order,
    })),
    historicalBackground: row.historicalBackground ?? undefined,
    conditionReport: row.conditionReport ?? undefined,
    material: row.material ?? undefined,
    dims: row.dims ?? undefined,
    weight: row.weight ?? undefined,
    maker: row.maker ?? undefined,
    provenance: row.provenance ?? undefined,
    certificate: row.certificate ?? undefined,
    authenticity: row.authenticity ?? undefined,
    shippingFrom: row.shippingFrom ?? undefined,
    shippingTo: row.shippingTo ?? undefined,
    shippingCost: row.shippingCost ?? undefined,
    returnPolicy: row.returnPolicy ?? undefined,
    bidHistory: [],
  };
}

export async function getAllItems(): Promise<Item[]> {
  await connection();
  const rows = await prisma.product.findMany({ include, orderBy: { createdAt: "desc" } });
  return rows.map(toItem);
}

export async function getItemBySlug(slug: string): Promise<Item | null> {
  await connection();
  const row = await prisma.product.findUnique({ where: { slug }, include });
  return row ? toItem(row) : null;
}

export async function getLiveAuctionItems(): Promise<Item[]> {
  await connection();
  const now = new Date();
  const rows = await prisma.product.findMany({
    where: { saleType: { in: ["auction", "both"] }, endsAt: { gt: now } },
    include,
    orderBy: { endsAt: "asc" },
  });
  return rows.map(toItem);
}

export async function getBuyNowItems(): Promise<Item[]> {
  await connection();
  const rows = await prisma.product.findMany({
    where: { saleType: "buynow" },
    include,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toItem);
}

export async function getRecentlyAdded(limit = 4): Promise<Item[]> {
  await connection();
  const rows = await prisma.product.findMany({
    include,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toItem);
}

export async function getRelatedItems(item: Item, limit = 3): Promise<Item[]> {
  await connection();
  const cat = await prisma.category.findUnique({ where: { slug: item.categorySlug } });
  const rows = await prisma.product.findMany({
    where: {
      id: { not: item.id },
      OR: [{ categoryId: cat?.id ?? "" }, { origin: item.origin }],
    },
    include,
    take: limit,
  });
  return rows.map(toItem);
}