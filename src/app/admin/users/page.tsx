import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { UserRowActions } from "@/components/admin/UserRowActions";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export const instant = false;

export default async function AdminUsersPage() {
  const me = await getCurrentUser();
  const users = await prisma.user.findMany({
    include: {
      _count: { select: { products: true, orders: true, bids: true } },
      sellerProfile: true,
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-display text-2xl">Users</h2>
        <p className="mt-1 text-xs text-muted">
          {users.length} account{users.length === 1 ? "" : "s"} · change roles, suspend bad actors
        </p>
      </div>

      <div className="overflow-hidden rounded-md border border-line bg-paper">
        <table className="w-full">
          <thead className="bg-cream">
            <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-muted-2">
              <th className="p-3">User</th>
              <th className="p-3">Role</th>
              <th className="p-3">Activity</th>
              <th className="p-3 text-right">Manage</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-line">
                <td className="p-3">
                  <div className="flex items-start gap-2">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-lt to-gold font-display text-[11px] font-bold text-ink">
                      {u.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{u.name}</p>
                      <p className="truncate text-[11px] text-muted-2">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 align-top">
                  <div className="flex flex-wrap items-center gap-1">
                    <Badge tone={u.role === "admin" ? "gold" : u.role === "seller" ? "success" : "muted"}>
                      {u.role}
                    </Badge>
                    {u.suspended && <Badge tone="live">Suspended</Badge>}
                    {u.sellerProfile?.verified && <Badge tone="gold">Verified</Badge>}
                  </div>
                </td>
                <td className="p-3 align-top text-[11px] text-muted">
                  {u._count.products} listings · {u._count.orders} orders · {u._count.bids} bids
                </td>
                <td className="p-3 align-top text-right">
                  {me && u.id !== me.id ? (
                    <UserRowActions userId={u.id} role={u.role} suspended={u.suspended} />
                  ) : (
                    <span className="text-[11px] text-muted-2">You</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}