"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { createNotification } from "@/lib/notifications";

export interface CartProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  imageUrl: string | null;
  plateFrom: string;
  plateTo: string;
  category: string;
  sellerName: string;
  available: boolean;
  reason: string | null;
}

export async function fetchCartProducts(ids: string[]): Promise<CartProduct[]> {
  if (!ids.length) return [];
  const me = await getCurrentUser();

  const rows = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: {
      category: true,
      seller: { select: { id: true, name: true } },
      images: { orderBy: [{ isPrimary: "desc" }, { order: "asc" }], take: 1 },
      orderItems: { select: { id: true } },
    },
  });

  return ids
    .map((id) => {
      const p = rows.find((r) => r.id === id);
      if (!p) return null;

      let available = true;
      let reason: string | null = null;

      if (p.saleType === "auction") {
        available = false;
        reason = "This is an auction-only lot. Bid on it instead.";
      } else if (p.orderItems.length > 0) {
        available = false;
        reason = "This lot has already been purchased.";
      } else if (me && me.id === p.seller.id) {
        available = false;
        reason = "You cannot buy your own listing.";
      } else if (!me) {
        available = false;
        reason = "Sign in to purchase.";
      }

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        price: p.saleType === "buynow" ? (p.buyNowPrice ?? p.currentBid) : p.currentBid,
        imageUrl: p.images[0]?.url ?? null,
        plateFrom: p.plateFrom,
        plateTo: p.plateTo,
        category: p.category.name,
        sellerName: p.seller.name,
        available,
        reason,
      };
    })
    .filter((p): p is CartProduct => p !== null);
}

export interface MultiOrderState {
  error?: string;
}

export async function createMultiOrderAction(
  _prev: MultiOrderState,
  formData: FormData
): Promise<MultiOrderState> {
  const me = await getCurrentUser();
  if (!me) redirect("/sign-in?next=/checkout");

  const productIdsRaw = String(formData.get("productIds") || "[]");
  let productIds: string[] = [];
  try {
    productIds = JSON.parse(productIdsRaw);
  } catch {
    return { error: "Invalid cart data." };
  }
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return { error: "Your cart is empty." };
  }
  if (productIds.length > 20) return { error: "Too many items in cart." };

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

  const rows = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { orderItems: { select: { id: true } } },
  });

  if (rows.length !== productIds.length)
    return { error: "One or more items in your cart no longer exist." };

  const purchasable: { id: string; title: string; price: number; sellerId: string }[] = [];

  for (const p of rows) {
    if (p.saleType === "auction") return { error: `"${p.title}" is auction-only and cannot be purchased directly.` };
    if (p.orderItems.length > 0) return { error: `"${p.title}" has already been purchased.` };
    if (p.seller.id === me.id) return { error: `You cannot purchase your own listing "${p.title}".` };

    const price = p.saleType === "buynow" ? (p.buyNowPrice ?? p.currentBid) : p.currentBid;
    purchasable.push({ id: p.id, title: p.title, price, sellerId: p.seller.id });
  }

  const subtotal = purchasable.reduce((s, p) => s + p.price, 0);
  const shippingTotal = purchasable.reduce((s, p) => s + Math.max(50, Math.round(p.price * 0.02)), 0);
  const total = subtotal + shippingTotal;

  const order = await prisma.order.create({
    data: {
      userId: me.id,
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
        create: purchasable.map((p) => ({
          productId: p.id,
          title: p.title,
          price: p.price,
          sellerId: p.sellerId,
        })),
      },
    },
  });

  await createNotification({
    userId: me.id,
    type: "order_placed",
    title: "Order confirmed",
    body: `Your order of ${purchasable.length} item${purchasable.length === 1 ? "" : "s"} is confirmed. Total: $${total.toLocaleString()}.`,
    linkUrl: "/dashboard/orders",
  });

  const sellerIds = Array.from(new Set(purchasable.map((p) => p.sellerId)));
  for (const sellerId of sellerIds) {
    const sellerItems = purchasable.filter((p) => p.sellerId === sellerId);
    await createNotification({
      userId: sellerId,
      type: "order_received",
      title: "New order received",
      body: `${me.name} purchased ${sellerItems.length} item${sellerItems.length === 1 ? "" : "s"} totaling $${sellerItems.reduce((s, i) => s + i.price, 0).toLocaleString()}.`,
      linkUrl: "/seller/orders",
    });
  }

  revalidatePath("/dashboard/orders");
  revalidatePath("/seller/orders");
  revalidatePath("/discover");
  revalidatePath("/auctions");
  revalidatePath("/");
  redirect("/dashboard/orders?success=" + order.id);
}