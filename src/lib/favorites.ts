import "server-only";
import { connection } from "next/server";
import { prisma } from "./prisma";
import { getCurrentUser } from "./current-user";
import { toItem } from "./products";
import type { Item } from "@/types";

export async function getMyFavoritedIds(): Promise<string[]> {
  await connection();
  const user = await getCurrentUser();
  if (!user) return [];
  const favs = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: { productId: true },
  });
  return favs.map((f) => f.productId);
}

export async function getMyFavoriteItems(): Promise<Item[]> {
  await connection();
  const user = await getCurrentUser();
  if (!user) return [];
  const favs = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          category: true,
          seller: true,
          images: { orderBy: [{ isPrimary: "desc" }, { order: "asc" }] },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return favs.map((f) => toItem(f.product));
}

export async function getMyFavoriteCount(): Promise<number> {
  await connection();
  const user = await getCurrentUser();
  if (!user) return 0;
  return prisma.favorite.count({ where: { userId: user.id } });
}