import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/current-user";
import { getSellerProfileForCurrentUser, getSellerStats } from "@/lib/seller";
import { getMyFavoriteCount } from "@/lib/favorites";
import { getMyBuyerOrders } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { signOutAction } from "@/app/actions/auth";

export const metadata = { title: "Dashboard" };
export const instant = false;

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/dashboard");

  const profile = await getSellerProfileForCurrentUser();
  const isSeller = user.role === "seller" || user.role === "admin";
  const stats = isSeller ? await getSellerStats(user.id) : { total: 0, live: 0, totalBids: 0 };
  const favCount = await getMyFavoriteCount();
  const orders = await getMyBuyerOrders();

  // ---- Real "Active Bids" count ----
  // Distinct live lots where this user has bid AND is currently the top bidder
  const activeBidRows = await prisma.bid.findMany({
    where: {
      userId: user.id,
      product: {
        endsAt: { gt: new Date() },
        closedAt: null,
        saleType: { in: ["auction", "both"] },
      },
    },
    select: {
      productId: true,
      amount: true,
      product: {
        select: {
          id: true,
          currentBid: true,
          slug: true,
          title: true,
        },
      },
    },
  });

  // Group by productId, keep the highest bid per product, and mark as "leading" if this matches currentBid
  const byProduct = new Map<
    string,
    { title: string; slug: string; myAmount: number; leading: boolean }
  >();
  for (const b of activeBidRows) {
    const prev = byProduct.get(b.productId);
    const isLeading = b.amount === b.product.currentBid;
    if (!prev) {
      byProduct.set(b.productId, {
        title: b.product.title,
        slug: b.product.slug,
        myAmount: b.amount,
        leading: isLeading,
      });
    } else {
      if (b.amount > prev.myAmount) {
        prev.myAmount = b.amount;
        prev.leading = isLeading;
      }
    }
  }
  const activeBids = Array.from(byProduct.values());
  const activeBidCount = activeBids.filter((b) => b.leading).length;

  // ---- Real "Won Auctions" count ----
  // Lots whose auction closed with this user as top bidder AND not yet purchased
  const closedLots = await prisma.product.findMany({
    where: {
      closedAt: { not: null },
      saleType: { in: ["auction", "both"] },
      orderItems: { none: {} }, // not yet purchased
    },
    select: {
      id: true,
      slug: true,
      title: true,
      currentBid: true,
      bids: {
        orderBy: { amount: "desc" },
        take: 1,
        select: { userId: true, amount: true },
      },
    },
  });
  const wonAuctions = closedLots.filter((p) => p.bids[0]?.userId === user.id);

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-11">
        <Container className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="eyebrow">Your Account</p>
            <h1 className="mt-2.5 text-4xl md:text-5xl">
              Hello, {user.name.split(" ")[0]}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {user.email} / {isSeller ? "Seller" : "Buyer"}
            </p>
          </div>
          <form action={signOutAction}>
            <Button type="submit" variant="outline">Sign Out</Button>
          </form>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/favorites" className="rounded-md border border-line bg-paper p-6 transition-colors hover:border-line-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-2">Watchlist</p>
              <p className="mt-2 font-display text-4xl font-bold leading-none">{favCount}</p>
              <p className="mt-2 text-xs text-muted">Lots you are tracking</p>
            </Link>
            <Link href="/dashboard/orders" className="rounded-md border border-line bg-paper p-6 transition-colors hover:border-line-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-2">Orders</p>
              <p className="mt-2 font-display text-4xl font-bold leading-none">{orders.length}</p>
              <p className="mt-2 text-xs text-muted">Purchases completed</p>
            </Link>
            <div className="rounded-md border border-line bg-paper p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-2">Active Bids</p>
              <p className="mt-2 font-display text-4xl font-bold leading-none">{activeBidCount}</p>
              <p className="mt-2 text-xs text-muted">Lots where you lead</p>
            </div>
            <div className="rounded-md border border-line bg-paper p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-2">Won Auctions</p>
              <p className="mt-2 font-display text-4xl font-bold leading-none">{wonAuctions.length}</p>
              <p className="mt-2 text-xs text-muted">
                {wonAuctions.length > 0 ? "Awaiting payment" : "None yet"}
              </p>
            </div>
          </div>

          {/* Active bids detail — only if any */}
          {activeBids.length > 0 && (
            <div className="mt-8 rounded-md border border-line bg-paper p-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Your active bids</h2>
                <Link href="/auctions" className="text-xs font-semibold text-gold-dk hover:underline">
                  View live auctions →
                </Link>
              </div>
              <div className="divide-y divide-line">
                {activeBids.slice(0, 5).map((b) => (
                  <div key={b.slug} className="flex items-center justify-between py-2.5">
                    <Link href={`/discover/${b.slug}`} className="min-w-0 flex-1 truncate text-sm text-ink hover:text-burgundy">
                      {b.title}
                    </Link>
                    <div className="ml-3 flex items-center gap-3 text-xs">
                      <span className="font-display font-semibold">${b.myAmount.toLocaleString()}</span>
                      {b.leading ? (
                        <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-success">
                          Leading
                        </span>
                      ) : (
                        <span className="rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-danger">
                          Outbid
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Won auctions requiring payment */}
          {wonAuctions.length > 0 && (
            <div className="mt-6 rounded-md border border-gold/40 bg-gold/5 p-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">You won!</h2>
                <span className="text-xs text-gold-dk">
                  {wonAuctions.length} awaiting payment
                </span>
              </div>
              <div className="divide-y divide-line">
                {wonAuctions.slice(0, 5).map((w) => (
                  <div key={w.id} className="flex items-center justify-between py-2.5">
                    <Link href={`/discover/${w.slug}`} className="min-w-0 flex-1 truncate text-sm text-ink hover:text-burgundy">
                      {w.title}
                    </Link>
                    <div className="ml-3 flex items-center gap-3">
                      <span className="font-display text-sm font-bold">${w.currentBid.toLocaleString()}</span>
                      <Link
                        href={`/checkout/${w.slug}`}
                        className="rounded-sm bg-gradient-to-br from-[#e3cb94] to-[#c8a45c] px-3 py-1 text-[11px] font-semibold text-ink hover:brightness-105"
                      >
                        Pay now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isSeller && profile ? (
            <div className="mt-10 rounded-md border border-gold/30 bg-gold/5 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">Seller console</p>
                  <h2 className="mt-1.5 font-display text-2xl">You are a verified seller</h2>
                  <p className="mt-1 text-sm text-muted">
                    {stats.total} listing{stats.total === 1 ? "" : "s"} / {stats.live} live /{" "}
                    {stats.totalBids} bid{stats.totalBids === 1 ? "" : "s"} received
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link href="/seller"><Button variant="gold">Seller Dashboard</Button></Link>
                  <Link href="/seller/orders"><Button variant="outline">Orders Received</Button></Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-md border border-line bg-paper p-6">
                <h2 className="font-display text-2xl">Start bidding</h2>
                <p className="mt-2 text-sm text-muted">
                  Explore live auctions and place your first bid on a rare lot.
                </p>
                <div className="mt-4 flex gap-3">
                  <Link href="/auctions"><Button variant="gold">Live Auctions</Button></Link>
                  <Link href="/discover"><Button variant="outline">Browse catalogue</Button></Link>
                </div>
              </div>
              <div className="rounded-md border border-line bg-paper p-6">
                <h2 className="font-display text-2xl">Become a seller</h2>
                <p className="mt-2 text-sm text-muted">
                  Consign antiques, run auctions and reach collectors worldwide.
                </p>
                <div className="mt-4 flex gap-3">
                  <Link href="/seller/onboarding"><Button variant="wine">Become a Seller</Button></Link>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}