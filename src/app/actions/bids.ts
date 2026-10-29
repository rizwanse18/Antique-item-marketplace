"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { createNotification } from "@/lib/notifications";

export interface BidResult { ok: boolean; error?: string; newBid?: number; newEndsAt?: string }
function minIncrement(bid: number) { return Math.max(10, Math.round(bid * 0.05)); }

export async function placeBidAction(productId: string, amount: number): Promise<BidResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "not-signed-in" };
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, error: "Please enter a valid bid amount." };
  const bidAmount = Math.floor(amount);

  let outbidUserId: string | null = null;
  let outbidOldAmount = 0;
  let sellerId = "";
  let productTitle = "";
  let newEndsIso = "";

  try {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error("This lot does not exist.");
      if (product.saleType === "buynow") throw new Error("This lot is fixed-price.");
      if (product.sellerId === user.id) throw new Error("You cannot bid on your own listing.");

      const now = Date.now();
      const endsAt = product.endsAt.getTime();
      if (endsAt <= now) throw new Error("This auction has already closed.");

      const topBid = await tx.bid.findFirst({ where: { productId }, orderBy: { amount: "desc" } });
      const leaderId = topBid?.userId ?? null;
      const currentPrice = topBid?.amount ?? product.startingBid;
      const minNext = currentPrice + minIncrement(currentPrice);

      if (bidAmount < minNext) throw new Error(`Bid must be at least $${minNext.toLocaleString()}.`);
      if (leaderId === user.id) throw new Error("You are already the highest bidder on this lot.");

      if (leaderId && topBid) {
        outbidUserId = leaderId;
        outbidOldAmount = topBid.amount;
      }
      sellerId = product.sellerId;
      productTitle = product.title;

      await tx.bid.create({ data: { productId, userId: user.id, amount: bidAmount } });

      let newEndsAt = product.endsAt;
      if (endsAt - now < 60_000) newEndsAt = new Date(now + 60_000);
      newEndsIso = newEndsAt.toISOString();

      await tx.product.update({
        where: { id: productId },
        data: { currentBid: bidAmount, bidsCount: { increment: 1 }, endsAt: newEndsAt },
      });

      return { newBid: bidAmount, newEndsAt: newEndsAt.toISOString() };
    });

    if (outbidUserId && outbidUserId !== user.id) {
      await createNotification({
        userId: outbidUserId,
        type: "outbid",
        title: "You've been outbid",
        body: `Someone placed a higher bid on "${productTitle}". New bid: $${result.newBid.toLocaleString()}.`,
        linkUrl: `/discover/${productId}`,
      });
    }
    if (sellerId) {
      await createNotification({
        userId: sellerId,
        type: "bid_placed",
        title: "New bid on your lot",
        body: `${user.name} bid $${result.newBid.toLocaleString()} on "${productTitle}".`,
        linkUrl: `/seller/listings`,
      });
    }

    revalidatePath("/");
    revalidatePath("/discover");
    revalidatePath("/auctions");
    revalidatePath("/dashboard");
    return { ok: true, newBid: result.newBid, newEndsAt: result.newEndsAt };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Bid failed." };
  }
}

export interface StatusResult {
  currentBid: number; bidsCount: number; endsAt: string;
  leadingUserId: string | null; isEnded: boolean;
}

export async function getAuctionStatus(productId: string): Promise<StatusResult | null> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { currentBid: true, bidsCount: true, endsAt: true, startingBid: true },
  });
  if (!product) return null;
  const top = await prisma.bid.findFirst({ where: { productId }, orderBy: { amount: "desc" }, select: { userId: true } });
  const base = product.bidsCount > 0 ? product.currentBid : product.startingBid;
  return {
    currentBid: base,
    bidsCount: product.bidsCount,
    endsAt: product.endsAt.toISOString(),
    leadingUserId: top?.userId ?? null,
    isEnded: product.endsAt.getTime() <= Date.now(),
  };
}