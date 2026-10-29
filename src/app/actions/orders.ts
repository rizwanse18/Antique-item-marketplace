"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { createNotification } from "@/lib/notifications";

export interface OrderState { error?: string }

async function resolvePurchasablePrice(productId: string, userId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      bids: { orderBy: { amount: "desc" }, take: 1 },
      orderItems: { select: { id: true } },
    },
  });
  if (!product) return { error: "This lot does not exist." } as const;
  if (product.orderItems.length > 0) return { error: "This lot has already been purchased." } as const;

  const now = Date.now();

  if (product.saleType === "buynow") {
    return { price: product.buyNowPrice ?? product.currentBid, product } as const;
  }

  const endsAt = product.endsAt.getTime();
  if (endsAt > now) {
    return { error: "This auction is still live. You cannot purchase it yet." } as const;
  }
  const winner = product.bids[0];
  if (!winner) return { error: "This auction ended without a winning bid." } as const;
  if (winner.userId !== userId) return { error: "You did not win this auction." } as const;
  return { price: winner.amount, product } as const;
}

export async function createOrderAction(
  _prev: OrderState,
  formData: FormData
): Promise<OrderState> {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/checkout");

  const productId = String(formData.get("productId") || "");
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const address = String(formData.get("address") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const zip = String(formData.get("zip") || "").trim();
  const country = String(formData.get("country") || "").trim();

  if (!name || !email || !address || !city || !zip || !country)
    return { error: "Please fill in all shipping fields." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { error: "Please enter a valid email address." };

  const resolved = await resolvePurchasablePrice(productId, user.id);
  if ("error" in resolved) return { error: resolved.error };
  const { price, product } = resolved;

  const shippingFee = Math.max(50, Math.round(price * 0.02));
  const total = price + shippingFee;

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: "paid",
      totalAmount: total,
      shippingName: name,
      shippingEmail: email,
      shippingAddress: address,
      shippingCity: city,
      shippingZip: zip,
      shippingCountry: country,
      paymentRef: "mock_" + Math.random().toString(36).slice(2, 12),
      paidAt: new Date(),
      items: {
        create: {
          productId: product.id,
          title: product.title,
          price: price,
          sellerId: product.sellerId,
        },
      },
    },
  });

  await createNotification({
    userId: user.id,
    type: "order_placed",
    title: "Order confirmed",
    body: `Your purchase of "${product.title}" is confirmed. Total: $${total.toLocaleString()}.`,
    linkUrl: "/dashboard/orders",
  });
  await createNotification({
    userId: product.sellerId,
    type: "order_received",
    title: "New order received",
    body: `You sold "${product.title}" for $${price.toLocaleString()}.`,
    linkUrl: "/seller/orders",
  });

  revalidatePath("/dashboard/orders");
  revalidatePath("/seller/orders");
  revalidatePath("/discover");
  revalidatePath("/auctions");
  revalidatePath("/");
  redirect("/dashboard/orders?success=" + order.id);
}

export async function markOrderDeliveredAction(orderId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not signed in." };

  const items = await prisma.orderItem.findMany({
    where: { orderId, sellerId: user.id },
    select: { id: true },
  });
  if (!items.length) return { error: "Not authorized." };

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "delivered" },
  });
  revalidatePath("/seller/orders");
  revalidatePath("/dashboard/orders");
  return { ok: true };
}