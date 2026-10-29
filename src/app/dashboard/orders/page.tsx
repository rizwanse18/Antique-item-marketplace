import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { getCurrentUser } from "@/lib/current-user";
import { getMyBuyerOrders } from "@/lib/orders";
import { getMyReviewableOrders } from "@/lib/reviews";

export const metadata = { title: "My Orders" };
export const instant = false;

function formatMoney(n: number) { return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); }
function fmtDate(ts: number) { return new Date(ts).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }

function statusTone(status: string): "success" | "gold" | "muted" | "live" {
  if (status === "paid") return "gold";
  if (status === "delivered") return "success";
  return "muted";
}

export default async function BuyerOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/dashboard/orders");
  const sp = await searchParams;
  const [orders, reviewables] = await Promise.all([
    getMyBuyerOrders(),
    getMyReviewableOrders(),
  ]);

  const reviewBySeller = new Map<string, { alreadyReviewed: boolean; sellerName: string }>();
  for (const r of reviewables) {
    reviewBySeller.set(`${r.orderId}:${r.sellerId}`, {
      alreadyReviewed: r.alreadyReviewed,
      sellerName: r.sellerName,
    });
  }

  // Get seller IDs for each item via order items
  // we need to fetch them from order items - simple approach: load orderItems again
  const { prisma } = await import("@/lib/prisma");
  const ordersWithSeller = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { select: { productId: true, sellerId: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });
  const sellersByOrder = new Map<string, { sellerId: string; sellerName: string }[]>();
  for (const o of ordersWithSeller) {
    sellersByOrder.set(
      o.id,
      o.items.map((it) => ({
        sellerId: it.sellerId,
        sellerName: reviewBySeller.get(`${o.id}:${it.sellerId}`)?.sellerName ?? "Seller",
      }))
    );
  }

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-11">
        <Container>
          <p className="eyebrow">Your Account</p>
          <h1 className="mt-2.5 text-4xl md:text-5xl">My Orders</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">Purchases you have completed through ANTIQUA.</p>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          {sp.success && (
            <div className="mb-6 rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              Payment successful. Thank you — your order is confirmed.
            </div>
          )}

          {orders.length === 0 ? (
            <div className="mx-auto max-w-md rounded-md border border-dashed border-line-2 bg-paper/60 px-6 py-16 text-center">
              <p className="font-display text-2xl">No orders yet</p>
              <p className="mt-2 text-sm text-muted">Purchase a lot from the catalogue to see it here.</p>
              <div className="mt-6"><Link href="/discover"><Button variant="gold">Browse lots</Button></Link></div>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => {
                const sellers = sellersByOrder.get(o.id) ?? [];
                return (
                  <div key={o.id} className="rounded-md border border-line bg-paper p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted">#{o.id.slice(-8)}</span>
                          <Badge tone={statusTone(o.status)}>{o.status}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted">Placed {fmtDate(o.createdAt)}</p>
                      </div>
                      <p className="font-display text-xl font-bold">{formatMoney(o.totalAmount)}</p>
                    </div>
                    <div className="mt-3 divide-y divide-line border-t border-line">
                      {o.items.map((it) => (
                        <div key={it.id} className="flex items-center justify-between py-2 text-sm">
                          <span>
                            {it.slug ? (
                              <Link href={`/discover/${it.slug}`} className="text-ink hover:text-burgundy">{it.title}</Link>
                            ) : (
                              <span className="text-ink">{it.title}</span>
                            )}
                          </span>
                          <span className="font-semibold">{formatMoney(it.price)}</span>
                        </div>
                      ))}
                    </div>

                    {sellers.length > 0 && (
                      <div className="mt-4 border-t border-line pt-3">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-2">
                          Rate this seller
                        </p>
                        <div className="space-y-2">
                          {sellers.map((s) => {
                            const info = reviewBySeller.get(`${o.id}:${s.sellerId}`);
                            if (info?.alreadyReviewed) {
                              return (
                                <p key={s.sellerId} className="text-xs text-muted">
                                  ✓ You reviewed {s.sellerName}
                                </p>
                              );
                            }
                            return (
                              <ReviewForm
                                key={s.sellerId}
                                orderId={o.id}
                                sellerId={s.sellerId}
                                sellerName={s.sellerName}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}