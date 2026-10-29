import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ProductRowActions } from "@/components/admin/ProductRowActions";
import { prisma } from "@/lib/prisma";

export const instant = false;

function fmtMoney(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      seller: { select: { id: true, name: true } },
      category: true,
      images: { take: 1 },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl">Products</h2>
          <p className="mt-1 text-xs text-muted">
            {products.length} product{products.length === 1 ? "" : "s"} · feature to show on homepage, hide to remove from public listings
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-md border border-dashed border-line-2 bg-paper/60 px-6 py-12 text-center">
          <p className="font-display text-lg">No products yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-line bg-paper">
          <table className="w-full">
            <thead className="bg-cream">
              <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-muted-2">
                <th className="p-3">Product</th>
                <th className="p-3">Seller</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const live = p.endsAt.getTime() > Date.now();
                return (
                  <tr key={p.id} className="border-t border-line">
                    <td className="p-3 align-top">
                      <div className="flex items-start gap-2">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-sm">
                          {p.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div
                              className="h-full w-full"
                              style={{ background: `radial-gradient(120% 100% at 30% 15%, ${p.plateTo}, ${p.plateFrom} 70%)` }}
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link href={`/discover/${p.slug}`} className="line-clamp-1 text-sm font-medium text-ink hover:text-burgundy">
                            {p.title}
                          </Link>
                          <p className="text-[11px] text-muted-2">{p.category.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 align-top text-xs text-ink">{p.seller.name}</td>
                    <td className="p-3 align-top text-xs font-semibold">
                      {fmtMoney(p.currentBid)}
                    </td>
                    <td className="p-3 align-top">
                      <div className="flex flex-wrap gap-1">
                        {p.hidden ? (
                          <Badge tone="muted">Hidden</Badge>
                        ) : live ? (
                          <Badge tone="live">Live</Badge>
                        ) : (
                          <Badge tone="muted">Ended</Badge>
                        )}
                        {p.featured && <Badge tone="gold">Featured</Badge>}
                      </div>
                    </td>
                    <td className="p-3 align-top text-right">
                      <ProductRowActions
                        productId={p.id}
                        featured={p.featured}
                        hidden={p.hidden}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}