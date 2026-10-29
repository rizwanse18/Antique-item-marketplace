import { redirect } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getCurrentUser } from "@/lib/current-user";
import { getSellerProfileForCurrentUser } from "@/lib/seller";
import { getMySellerOrders } from "@/lib/orders";

export const metadata = { title: "Orders Received" };
export const instant = false;

function formatMoney(n: number) { return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); }
function fmtDate(ts: number) { return new Date(ts).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }

export default async function SellerOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/seller/orders");
  const profile = await getSellerProfileForCurrentUser();
  if (!profile) redirect("/seller/onboarding");
  const orders = await getMySellerOrders();

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-11">
        <Container className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="eyebrow">Seller Dashboard</p>
            <h1 className="mt-2.5 text-4xl md:text-5xl">Orders Received</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted">Purchases of your lots across the marketplace.</p>
          </div>
          <Link href="/seller"><Button variant="outline">Back to dashboard</Button></Link>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          {orders.length === 0 ? (
            <div className="mx-auto max-w-md rounded-md border border-dashed border-line-2 bg-paper/60 px-6 py-16 text-center">
              <p className="font-display text-2xl">No orders yet</p>
              <p className="mt-2 text-sm text-muted">You will see incoming purchases here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.orderId} className="rounded-md border border-line bg-paper p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted">#{o.orderId.slice(-8)}</span>
                        <Badge tone="success">{o.status}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        Buyer: <span className="text-ink">{o.buyerName}</span> ({o.buyerEmail}) · {fmtDate(o.createdAt)}
                      </p>
                    </div>
                    <p className="font-display text-xl font-bold">{formatMoney(o.totalForSeller)}</p>
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
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}