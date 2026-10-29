"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

async function requireAdminAction() {
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") return null;
  return me;
}

// -------- Products --------
export async function adminToggleFeatured(productId: string) {
  if (!(await requireAdminAction())) return { error: "Not authorized." };
  const p = await prisma.product.findUnique({ where: { id: productId } });
  if (!p) return { error: "Not found." };
  await prisma.product.update({
    where: { id: productId },
    data: { featured: !p.featured },
  });
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { ok: true, featured: !p.featured };
}

export async function adminToggleHidden(productId: string) {
  if (!(await requireAdminAction())) return { error: "Not authorized." };
  const p = await prisma.product.findUnique({ where: { id: productId } });
  if (!p) return { error: "Not found." };
  await prisma.product.update({
    where: { id: productId },
    data: { hidden: !p.hidden },
  });
  revalidatePath("/admin/products");
  revalidatePath("/discover");
  revalidatePath("/");
  revalidatePath("/auctions");
  return { ok: true, hidden: !p.hidden };
}

export async function adminDeleteProduct(productId: string) {
  if (!(await requireAdminAction())) return { error: "Not authorized." };
  const p = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });
  if (!p) return { error: "Not found." };

  const { deleteUploadedImage } = await import("@/lib/upload");
  for (const img of p.images) await deleteUploadedImage(img.url);

  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/products");
  revalidatePath("/discover");
  revalidatePath("/auctions");
  revalidatePath("/");
  return { ok: true };
}

// -------- Users --------
export async function adminChangeRole(userId: string, role: "buyer" | "seller" | "admin") {
  if (!(await requireAdminAction())) return { error: "Not authorized." };
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function adminToggleSuspend(userId: string) {
  if (!(await requireAdminAction())) return { error: "Not authorized." };
  const u = await prisma.user.findUnique({ where: { id: userId } });
  if (!u) return { error: "Not found." };
  await prisma.user.update({
    where: { id: userId },
    data: { suspended: !u.suspended },
  });
  revalidatePath("/admin/users");
  return { ok: true, suspended: !u.suspended };
}

// -------- Seller verification --------
export async function adminToggleVerify(sellerId: string) {
  if (!(await requireAdminAction())) return { error: "Not authorized." };
  const profile = await prisma.sellerProfile.findUnique({ where: { userId: sellerId } });
  if (!profile) return { error: "Not found." };
  await prisma.sellerProfile.update({
    where: { userId: sellerId },
    data: { verified: !profile.verified },
  });
  revalidatePath("/admin/sellers");
  revalidatePath(`/sellers/${sellerId}`);
  return { ok: true, verified: !profile.verified };
}

// -------- Reports --------
export async function adminResolveReport(reportId: string, resolution: string) {
  const me = await requireAdminAction();
  if (!me) return { error: "Not authorized." };
  await prisma.report.update({
    where: { id: reportId },
    data: {
      status: "resolved",
      resolution,
      resolvedById: me.id,
      resolvedAt: new Date(),
    },
  });
  revalidatePath("/admin/reports");
  return { ok: true };
}

export async function adminDismissReport(reportId: string) {
  const me = await requireAdminAction();
  if (!me) return { error: "Not authorized." };
  await prisma.report.update({
    where: { id: reportId },
    data: {
      status: "dismissed",
      resolvedById: me.id,
      resolvedAt: new Date(),
    },
  });
  revalidatePath("/admin/reports");
  return { ok: true };
}