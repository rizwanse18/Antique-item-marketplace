import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { SellerRowActions } from "@/components/admin/SellerRowActions";
import { prisma } from "@/lib/prisma";

export const instant = false;

export default async function AdminSellersPage() {
  const sellers = await prisma.user.findMany({
    where: { sellerProfile: { isNot: null } },
    include: {
      sellerProfile: true,
      _count: { select: { products: true, followers: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-display text-2xl">Sellers</h2>
        <p className="mt-1 text-xs text-muted">
          {sellers.length} seller{sellers.length === 1 ? "" : "s"} · toggle verified badge
        </p>
      </div>

      {sellers.length === 0 ? (
        <div className="rounded-md border border-dashed border-line-2 bg-paper/60 px-6 py-12 text-center">
          <p className="font-display text-lg">No sellers yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-line bg-paper">
          <table className="w-full">
            <thead className="bg-cream">
              <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-muted-2">
                <th className="p-3">Seller</th>
                <th className="p-3">Stats</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Verify</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((s) => (
                <tr key={s.id} className="border-t border-line">
                  <td className="p-3">
                    <div className="flex items-start gap-2">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-lt to-gold font-display text-[11px] font-bold text-ink">
                        {s.sellerProfile?.initials ?? s.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/sellers/${s.id}`} className="text-sm font-medium text-ink hover:text-burgundy">
                          {s.name}
                        </Link>
                        <p className="text-[11px] text-muted-2">{s.sellerProfile?.location ?? "-"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 align-top text-[11px] text-muted">
                    {s._count.products} listings · {s._count.followers} followers · {s.sellerProfile?.rating.toFixed(1) ?? "0.0"} ★
                  </td>
                  <td className="p-3 align-top">
                    {s.sellerProfile?.verified ? (
                      <Badge tone="gold">Verified</Badge>
                    ) : (
                      <Badge tone="muted">Unverified</Badge>
                    )}
                  </td>
                  <td className="p-3 align-top text-right">
                    <SellerRowActions sellerId={s.id} verified={s.sellerProfile?.verified ?? false} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}