import "server-only";
import { connection } from "next/server";
import { prisma } from "./prisma";
import { getCurrentUser } from "./current-user";

export interface ConversationListItem {
  id: string;
  otherId: string;
  otherName: string;
  productTitle: string | null;
  productSlug: string | null;
  lastMessage: string | null;
  lastMessageAt: number;
  lastFromMe: boolean;
  unreadCount: number;
}

export interface ConversationThread {
  id: string;
  meId: string;
  otherId: string;
  otherName: string;
  productTitle: string | null;
  productSlug: string | null;
  messages: {
    id: string;
    fromMe: boolean;
    senderName: string;
    body: string;
    createdAt: number;
  }[];
}

export async function getMyConversations(): Promise<ConversationListItem[]> {
  await connection();
  const me = await getCurrentUser();
  if (!me) return [];

  const convos = await prisma.conversation.findMany({
    where: { OR: [{ buyerId: me.id }, { sellerId: me.id }] },
    include: {
      buyer: { select: { id: true, name: true } },
      seller: { select: { id: true, name: true } },
      product: { select: { slug: true, title: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { lastMessageAt: "desc" },
  });

  const out: ConversationListItem[] = [];
  for (const c of convos) {
    const isBuyer = c.buyerId === me.id;
    const other = isBuyer ? c.seller : c.buyer;
    const lastMsg = c.messages[0] ?? null;
    const unreadCount = await prisma.message.count({
      where: {
        conversationId: c.id,
        senderId: { not: me.id },
        readAt: null,
      },
    });
    out.push({
      id: c.id,
      otherId: other.id,
      otherName: other.name,
      productTitle: c.product?.title ?? null,
      productSlug: c.product?.slug ?? null,
      lastMessage: lastMsg?.body ?? null,
      lastMessageAt: (lastMsg?.createdAt ?? c.lastMessageAt).getTime(),
      lastFromMe: lastMsg ? lastMsg.senderId === me.id : false,
      unreadCount,
    });
  }
  return out;
}

export async function getConversationThread(id: string): Promise<ConversationThread | null> {
  await connection();
  const me = await getCurrentUser();
  if (!me) return null;

  const convo = await prisma.conversation.findUnique({
    where: { id },
    include: {
      buyer: { select: { id: true, name: true } },
      seller: { select: { id: true, name: true } },
      product: { select: { slug: true, title: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { name: true } } },
      },
    },
  });

  if (!convo) return null;
  if (convo.buyerId !== me.id && convo.sellerId !== me.id) return null;

  // Mark other person's messages as read
  await prisma.message.updateMany({
    where: {
      conversationId: id,
      senderId: { not: me.id },
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  const other = convo.buyerId === me.id ? convo.seller : convo.buyer;

  return {
    id: convo.id,
    meId: me.id,
    otherId: other.id,
    otherName: other.name,
    productTitle: convo.product?.title ?? null,
    productSlug: convo.product?.slug ?? null,
    messages: convo.messages.map((m) => ({
      id: m.id,
      fromMe: m.senderId === me.id,
      senderName: m.sender.name,
      body: m.body,
      createdAt: m.createdAt.getTime(),
    })),
  };
}

export async function getUnreadMessageCount(): Promise<number> {
  await connection();
  const me = await getCurrentUser();
  if (!me) return 0;
  return prisma.message.count({
    where: {
      readAt: null,
      senderId: { not: me.id },
      conversation: { OR: [{ buyerId: me.id }, { sellerId: me.id }] },
    },
  });
}