"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { createNotification } from "@/lib/notifications";

export async function toggleFollowAction(sellerId: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "not-signed-in", following: false };
  if (user.id === sellerId) return { ok: false, error: "You cannot follow yourself.", following: false };

  const existing = await prisma.follow.findUnique({
    where: { userId_sellerId: { userId: user.id, sellerId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    revalidatePath(`/sellers/${sellerId}`);
    revalidatePath("/sellers");
    return { ok: true, following: false, error: null };
  }

  await prisma.follow.create({ data: { userId: user.id, sellerId } });

  await createNotification({
    userId: sellerId,
    type: "bid_placed",
    title: "New follower",
    body: `${user.name} started following your storefront.`,
    linkUrl: "/seller",
  });

  revalidatePath(`/sellers/${sellerId}`);
  revalidatePath("/sellers");
  return { ok: true, following: true, error: null };
}