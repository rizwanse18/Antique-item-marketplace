"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { createNotification } from "@/lib/notifications";
import {
  getUnreadMessageCount,
  getConversationThread,
} from "@/lib/messages";

export async function fetchUnreadCountAction(): Promise<number> {
  return getUnreadMessageCount();
}

export async function fetchThreadAction(id: string) {
  return getConversationThread(id);
}

export async function startConversationAction(sellerId: string, productId: string | null) {
  const me = await getCurrentUser();
  if (!me) redirect("/sign-in?next=/messages");
  if (me.id === sellerId) return { error: "You cannot message yourself." };

  let convo = await prisma.conversation.findFirst({
    where: { buyerId: me.id, sellerId, productId },
  });

  if (!convo) {
    convo = await prisma.conversation.create({
      data: { buyerId: me.id, sellerId, productId, lastMessageAt: new Date() },
    });
  }

  redirect(`/messages/${convo.id}`);
}

export interface SendMessageResult {
  ok: boolean;
  error?: string;
}

export async function sendMessageAction(conversationId: string, body: string): Promise<SendMessageResult> {
  const me = await getCurrentUser();
  if (!me) return { ok: false, error: "not-signed-in" };

  const trimmed = body.trim();
  if (!trimmed) return { ok: false, error: "Message cannot be empty." };
  if (trimmed.length > 5000) return { ok: false, error: "Message must be under 5000 characters." };

  const convo = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!convo) return { ok: false, error: "Conversation not found." };
  if (convo.buyerId !== me.id && convo.sellerId !== me.id) {
    return { ok: false, error: "You are not a participant in this conversation." };
  }

  const otherId = convo.buyerId === me.id ? convo.sellerId : convo.buyerId;

  await prisma.$transaction([
    prisma.message.create({
      data: { conversationId, senderId: me.id, body: trimmed },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    }),
  ]);

  await createNotification({
    userId: otherId,
    type: "bid_placed",
    title: "New message",
    body: `${me.name}: ${trimmed.slice(0, 80)}${trimmed.length > 80 ? "..." : ""}`,
    linkUrl: `/messages/${conversationId}`,
  });

  revalidatePath(`/messages/${conversationId}`);
  revalidatePath("/messages");
  return { ok: true };
}