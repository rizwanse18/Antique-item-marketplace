import "server-only";
import { connection } from "next/server";
import { prisma } from "./prisma";
import { createNotification } from "./notifications";

export async function closeExpiredAuctions(): Promise<number> {
  await connection();
  const now = new Date();
  const expired = await prisma.product.findMany({
    where: {
      saleType: { in: ["auction", "both"] },
      endsAt: { lte: now },
      closedAt: null,
    },
    include: {
      bids: {
        orderBy: { amount: "desc" },
        take: 1,
        include: { user: { select: { id: true, name: true } } },
      },
    },
  });

  for (const product of expired) {
    const winner = product.bids[0];
    await prisma.product.update({
      where: { id: product.id },
      data: { closedAt: now },
    });

    if (winner) {
      await createNotification({
        userId: winner.userId,
        type: "auction_won",
        title: "You won an auction",
        body: `Congratulations! You won "${product.title}" for $${winner.amount.toLocaleString()}. Complete payment to receive your item.`,
        linkUrl: `/checkout/${product.slug}`,
      });
      await createNotification({
        userId: product.sellerId,
        type: "auction_sold",
        title: "Your auction sold",
        body: `"${product.title}" sold for $${winner.amount.toLocaleString()} to ${winner.user.name}.`,
        linkUrl: `/seller/orders`,
      });
    } else {
      await createNotification({
        userId: product.sellerId,
        type: "auction_unsold",
        title: "Your auction ended without a winner",
        body: `"${product.title}" ended without any bids.`,
        linkUrl: `/seller/listings`,
      });
    }
  }
  return expired.length;
}