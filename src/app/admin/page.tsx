import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { getAdminStats } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const instant = false;

function fmtMoney(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default async function AdminOverview() {
  const stats = await getAdminStats();
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } }, items: true },
  });
  const recentProducts = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { seller: { select: { name: true } }, category: true },
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Users", value: stats.totalUsers, href: "/admin/users" },
          { label: "Sellers", value: stats.totalSellers, href: "/admin/sellers" },
          { label: "Products", value: stats.totalProducts, href: "/admin/products" },
          { label: "Live Auctions", value: stats.liveAuctions, href: "/admin/products" },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-md border border-line bg-paper p-5 transition-colors hover:border-line-2"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-2">
              {s.label}
            </p>
            <p className="mt-2 font-display text-3xl font-bold leading-none">
              {s.value.toLocaleString()}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-line bg-paper p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-2">
            Total Revenue
          </p>
          <p className="mt-2 font-display text-3xl font-bold leading-none">
            {fmtMoney(stats.revenue)}
          </p>
        </div>
        <div className="rounded-md border border-line bg-paper p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-2">
            Orders
          </p>
          <p className="mt-2 font-display text-3xl font-bold leading-none">
            {stats.orders.toLocaleString()}
          </p>
        </div>
        <Link
          href="/admin/reports"
          className="rounded-md border border-line bg-paper p-5 transition-colors hover:border-line-2"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-2">
            Pending Reports
          </p>
          <p className="mt-2 font-display text-3xl font-bold leading-none">
            {stats.pendingReports}
          </p>
          {stats.suspendedUsers > 0 && (
            <p className="mt-1 text-[11px] text-danger">
              {stats.suspendedUsers} suspended users
            </p>
          )}
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-line bg-paper p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent orders</h2>
            <Link href="/admin/users" className="text-xs text-gold-dk hover:underline">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted">No orders yet.</p>
          ) : (
            <div className="divide-y divide-line">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-medium text-ink">{o.user.name}</p>
                    <p className="text-[11px] text-muted-2">
                      {o.items.length} item{o.items.length === 1 ? "" : "s"} · {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-sm font-bold">{fmtMoney(o.totalAmount)}</p>
                    <Badge tone="success">{o.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-md border border-line bg-paper p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent products</h2>
            <Link href="/admin/products" className="text-xs text-gold-dk hover:underline">
              View all
            </Link>
          </div>
          {recentProducts.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted">No products yet.</p>
          ) : (
            <div className="divide-y divide-line">
              {recentProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{p.title}</p>
                    <p className="text-[11px] text-muted-2">
                      {p.seller.name} · {p.category.name}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    {p.hidden ? (
                      <Badge tone="muted">Hidden</Badge>
                    ) : p.featured ? (
                      <Badge tone="gold">Featured</Badge>
                    ) : (
                      <Badge tone="success">Active</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}