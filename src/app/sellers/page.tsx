import Link from "next/link";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { listAllSellers } from "@/lib/sellers";

export const metadata = { title: "Sellers" };
export const instant = false;

export default async function SellersListPage() {
  const sellers = await listAllSellers();

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-11">
        <Container>
          <p className="eyebrow">Consignors</p>
          <h1 className="mt-2.5 text-4xl md:text-5xl">Verified Sellers</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Trusted dealers, galleries and specialists from around the world.
          </p>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          {sellers.length === 0 ? (
            <div className="mx-auto max-w-md rounded-md border border-dashed border-line-2 bg-paper/60 px-6 py-16 text-center">
              <p className="font-display text-2xl">No sellers yet</p>
              <p className="mt-2 text-sm text-muted">Be the first to open a seller account on ANTIQUA.</p>
              <div className="mt-6">
                <Link
                  href="/seller/onboarding"
                  className="inline-flex items-center justify-center rounded-sm bg-gradient-to-br from-gold-lt to-gold px-6 py-3 text-sm font-semibold text-ink"
                >
                  Become a Seller
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sellers.map((s) => (
                <Link key={s.id} href={`/sellers/${s.id}`}>
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-lt to-gold font-display text-lg font-bold text-ink">
                        {s.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate font-display text-lg font-semibold">{s.name}</p>
                          {s.verified && <BadgeCheck className="h-4 w-4 flex-shrink-0 text-gold-dk" />}
                        </div>
                        {s.location && (
                          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted">
                            <MapPin className="h-3 w-3" />{s.location}
                          </p>
                        )}
                        <p className="mt-2 line-clamp-2 text-xs text-muted">{s.bio}</p>
                      </div>
                    </div>
                    <div className="mt-5 grid grid-cols-3 divide-x divide-line border-t border-line pt-4 text-center">
                      <div>
                        <p className="inline-flex items-center gap-1 font-display text-base font-bold">
                          <Star className="h-3 w-3 fill-gold text-gold" />{s.rating.toFixed(1)}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-muted-2">Rating</p>
                      </div>
                      <div>
                        <p className="font-display text-base font-bold">{s.activeListings}</p>
                        <p className="text-[10px] uppercase tracking-widest text-muted-2">Lots</p>
                      </div>
                      <div>
                        <p className="font-display text-base font-bold">{s.followersCount}</p>
                        <p className="text-[10px] uppercase tracking-widest text-muted-2">Followers</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}