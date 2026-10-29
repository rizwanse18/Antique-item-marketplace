import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/current-user";
import { getSellerProfileForCurrentUser, getSellerStats } from "@/lib/seller";
import { signOutAction } from "@/app/actions/auth";

export const metadata = { title: "Seller Dashboard" };
export const instant = false;

export default async function SellerDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/seller");
  const profile = await getSellerProfileForCurrentUser();
  if (!profile) redirect("/seller/onboarding");
  const stats = await getSellerStats(user.id);
  const { prisma } = await import("@/lib/prisma");
  const reviewCount = await prisma.review.count({ where: { sellerId: user.id } });
  const avgReview = await prisma.review.aggregate({
    where: { sellerId: user.id },
    _avg: { rating: true },
  });

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-11">
        <Container className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="eyebrow">Seller Dashboard</p>
            <h1 className="mt-2.5 text-4xl md:text-5xl">{user.name}</h1>
            <p className="mt-2 text-sm text-muted">
              {profile.location} / {profile.verified ? "Verified seller" : "Pending verification"}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/seller/listings/new"><Button variant="gold">New Listing</Button></Link>
            <form action={signOutAction}><Button type="submit" variant="outline">Sign Out</Button></form>
          </div>
        </Container>
      </section>
      <section className="py-10">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Listings", value: stats.total },
              { label: "Live Lots", value: stats.live },
              { label: "Total Bids", value: stats.totalBids },
              { label: "Watchers", value: stats.totalViews },
            ].map((s) => (
              <div key={s.label} className="rounded-md border border-line bg-paper p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-2">{s.label}</p>
                <p className="mt-2 font-display text-4xl font-bold leading-none">{s.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-md border border-gold/30 bg-gold/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-2">Seller reputation</p>
                <p className="mt-1.5 font-display text-2xl font-bold">
                  {(avgReview._avg.rating ?? profile.rating).toFixed(1)} <span className="text-sm font-normal text-muted">/ 5</span>
                </p>
                <p className="mt-1 text-xs text-muted">
                  {reviewCount} review{reviewCount === 1 ? "" : "s"} received
                </p>
              </div>
              <Link href={`/sellers/${user.id}`}><Button variant="outline" size="sm">View public storefront</Button></Link>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/seller/listings"><Button variant="outline">Manage Listings</Button></Link>
            <Link href="/discover"><Button variant="ghost">View public catalogue</Button></Link>
          </div>
        </Container>
      </section>
    </>
  );
}