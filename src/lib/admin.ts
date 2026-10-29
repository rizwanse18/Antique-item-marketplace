import "server-only";
import { connection } from "next/server";
import { prisma } from "./prisma";
import { getCurrentUser } from "./current-user";

export async function requireAdmin() {
  await connection();
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") return null;
  return me;
}

export async function getAdminStats() {
  await connection();
  const [
    totalUsers,
    totalSellers,
    totalProducts,
    liveAuctions,
    closedAuctions,
    orders,
    revenue,
    pendingReports,
    suspendedUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "seller" } }),
    prisma.product.count(),
    prisma.product.count({ where: { endsAt: { gt: new Date() }, closedAt: null } }),
    prisma.product.count({ where: { closedAt: { not: null } } }),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.report.count({ where: { status: "open" } }),
    prisma.user.count({ where: { suspended: true } }),
  ]);

  return {
    totalUsers,
    totalSellers,
    totalProducts,
    liveAuctions,
    closedAuctions,
    orders,
    revenue: revenue._sum.totalAmount ?? 0,
    pendingReports,
    suspendedUsers,
  };
}