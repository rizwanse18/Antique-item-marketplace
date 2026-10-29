"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { getMyNotifications } from "@/lib/notifications";

export async function fetchMyNotifications() {
  return getMyNotifications(20);
}

export async function markAllReadAction() {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/");
  return { ok: true };
}

export async function markOneReadAction(id: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  await prisma.notification.updateMany({
    where: { id, userId: user.id },
    data: { read: true },
  });
  return { ok: true };
}