"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function toggleFavoriteAction(productId: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "not-signed-in", favorited: false };

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({ data: { userId: user.id, productId } });
  }

  revalidatePath("/");
  revalidatePath("/discover");
  revalidatePath("/auctions");
  revalidatePath("/favorites");
  revalidatePath("/dashboard");

  return { ok: true, favorited: !existing, error: null };
}

export async function getFavoritedIdsForUser(userId: string): Promise<string[]> {
  const favs = await prisma.favorite.findMany({
    where: { userId },
    select: { productId: true },
  });
  return favs.map((f) => f.productId);
}