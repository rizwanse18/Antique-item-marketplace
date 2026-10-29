import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DeleteListingButton } from "@/components/seller/DeleteListingButton";
import { getCurrentUser } from "@/lib/current-user";
import { getSellerProfileForCurrentUser, getMyListings } from "@/lib/seller";
import { formatMoney } from "@/lib/mock-data";

export const metadata = { title: "My Listings" };
export const instant = false;

export default async function ListingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/seller/listings");
  const profile = await getSellerProfileForCurrentUser();
  if (!profile) redirect("/seller/onboarding");
  const items = await getMyListings();

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-11">
        <Container className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="eyebrow">Seller Dashboard</p>
            <h1 className="mt-2.5 text-4xl md:text-5xl">My Listings</h1>
          </div>
          <Link href="/seller/listings/new"><Button variant="gold">New Listing</Button></Link>
        </Container>
      </section>
      <section className="py-10">
        <Container>
          {items.length === 0 ? (
            <div className="mx-auto max-w-md rounded-md border border-dashed border-line-2 bg-paper/60 px-6 py-16 text-center">
              <p className="font-display text-2xl">No listings yet</p>
              <p className="mt-2 text-sm text-muted">Create your first listing to reach collectors worldwide.</p>
              <div className="mt-6"><Link href="/seller/listings/new"><Button variant="gold">Create First Listing</Button></Link></div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => {
                const live = new Date(it.endsAt).getTime() > Date.now();
                return (
                  <div key={it.id} className="grid grid-cols-[64px_1fr] gap-4 rounded-md border border-line bg-paper p-4 sm:grid-cols-[64px_1fr_auto] sm:items-center">
                    <div className="h-16 w-16 rounded-sm" style={{ background: `radial-gradient(120% 100% at 30% 15%, ${it.plate.to}, ${it.plate.from} 70%)` }} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/discover/${it.slug}`} className="font-display text-lg font-semibold text-ink hover:text-burgundy">{it.title}</Link>
                        {live ? <Badge tone="live">Live</Badge> : <Badge tone="muted">Ended</Badge>}
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {it.category} / {it.era} / {formatMoney(it.currentBid)} / {it.bidsCount} bid{it.bidsCount===1?"":"s"} / {it.watchers} watching
                      </p>
                    </div>
                    <div className="col-span-2 flex gap-2 sm:col-span-1">
                      <Link href={`/discover/${it.slug}`}><Button variant="outline" size="sm">View</Button></Link>
                      <DeleteListingButton productId={it.id} />
                    </div>
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