import "server-only";
import { prisma } from "./prisma";
import { sendEmailToUser, type EmailTemplate } from "./email";

export type NotificationType =
  | "bid_placed" | "outbid" | "auction_won" | "auction_sold"
  | "auction_unsold" | "order_placed" | "order_received";

// Which notification types also trigger an email
const EMAIL_TYPES = new Set<NotificationType>([
  "outbid",
  "auction_won",
  "auction_sold",
  "order_placed",
  "order_received",
]);

export async function createNotification(input: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  linkUrl?: string;
}): Promise<void> {
  if (!input.userId) return;

  await prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      linkUrl: input.linkUrl ?? null,
    },
  });

  // Fire email in the background so notification creation is never blocked
  if (EMAIL_TYPES.has(input.type)) {
    const body = input.linkUrl
      ? `${input.body}\n\nView: https://antiqua.example.com${input.linkUrl}`
      : input.body;

    sendEmailToUser(
      input.userId,
      input.title,
      body,
      input.type as EmailTemplate
    ).catch((e) => console.error("[notify] email dispatch error:", e));
  }
}

export async function getMyNotifications(limit = 30) {
  const { getCurrentUser } = await import("./current-user");
  const user = await getCurrentUser();
  if (!user) return { items: [], unread: 0 };
  const items = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  const unread = await prisma.notification.count({
    where: { userId: user.id, read: false },
  });
  return {
    items: items.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      linkUrl: n.linkUrl,
      read: n.read,
      createdAt: n.createdAt.getTime(),
    })),
    unread,
  };
}