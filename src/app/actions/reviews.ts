"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { createNotification } from "@/lib/notifications";
import { canReviewOrder } from "@/lib/reviews";

export interface ReviewState {
  error?: string;
  success?: boolean;
}

export async function createReviewAction(
  _prev: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const me = await getCurrentUser();
  if (!me) return { error: "You must be signed in." };

  const orderId = String(formData.get("orderId") || "");
  const sellerId = String(formData.get("sellerId") || "");
  const rating = Number(formData.get("rating") || 0);
  const body = String(formData.get("body") || "").trim();

  if (!orderId || !sellerId) return { error: "Missing order information." };
  if (rating < 1 || rating > 5) return { error: "Please select a rating from 1 to 5 stars." };
  if (body.length > 2000) return { error: "Review must be under 2000 characters." };

  const allowed = await canReviewOrder(orderId, sellerId);
  if (!allowed) return { error: "You cannot review this order." };

  await prisma.$transaction(async (tx) => {
    await tx.review.create({
      data: {
        orderId,
        sellerId,
        reviewerId: me.id,
        rating,
        body: body || null,
      },
    });

    const allReviews = await tx.review.findMany({ where: { sellerId } });
    const avg =
      allReviews.length > 0
        ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
        : 0;

    await tx.sellerProfile.updateMany({
      where: { userId: sellerId },
      data: { rating: Math.round(avg * 10) / 10, sales: { increment: 1 } },
    });
  });

  await createNotification({
    userId: sellerId,
    type: "bid_placed",
    title: "New review received",
    body: `${me.name} left you a ${rating}-star review.`,
    linkUrl: "/seller",
  });

  revalidatePath(`/sellers/${sellerId}`);
  revalidatePath("/dashboard/orders");
  revalidatePath("/seller");
  return { success: true, error: undefined };
}