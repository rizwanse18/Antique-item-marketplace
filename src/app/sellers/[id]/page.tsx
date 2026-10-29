import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { BadgeCheck, MapPin, Star, Calendar, Package } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ItemCard } from "@/components/marketplace/ItemCard";
import { FollowButton } from "@/components/seller/FollowButton";
import { ReviewList } from "@/components/reviews/ReviewList";
import { getSellerById, getSellerLots } from "@/lib/sellers";
import { getSellerReviews } from "@/lib/reviews";
import { getMyFavoritedIds } from "@/lib/favorites";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const seller = await getSellerById(id);
  if (!seller) return { title: "Seller not found" };
  return {
    title: seller.name,
    description: seller.bio || `Browse lots from ${seller.name} on ANTIQUA.`,
    alternates: { canonical: `/sellers/${seller.id}` },
    openGraph: {
      type: "profile",
      title: seller.name,
      description: seller.bio || `Browse lots from ${seller.name} on ANTIQUA.`,
      url: `/sellers/${seller.id}`,
    },
  };
}

export default async function SellerStorefront({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seller = await getSellerById(id);
  if (!seller) notFound();

  const [lots, favoritedIds, reviews] = await Promise.all([
    getSellerLots(seller.id),
    getMyFavoritedIds(),
    getSellerReviews(seller.id, 10),
  ]);
  const fav = new Set(favoritedIds);

  const liveLots = lots.filter((l) => new Date(l.endsAt).getTime() > Date.now());
  const endedLots = lots.filter((l) => new Date(l.endsAt).getTime() <= Date.now());

  const sellerJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seller.name,
    description: seller.bio,
    address: seller.location
      ? { "@type": "PostalAddress", addressLocality: seller.location }
      : undefined,
    url: `${SITE_URL}/sellers/${seller.id}`,
    aggregateRating:
      reviews.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: seller.rating.toFixed(1),
            reviewCount: reviews.length,
            bestRating: "5",
            worstRating: "1",
          }
        : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sellerJsonLd) }}
      />

      <section className="relative overflow-hidden bg-ink py-14 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_400px_at_20%_20%,rgba(110,31,43,.5),transparent_60%),radial-gradient(600px_400px_at_85%_80%,rgba(200,164,92,.2),transparent_65%)]" />
        <Container className="relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-[.24em] text-gold">
            Seller Storefront
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold-lt to-gold font-display text-2xl font-bold text-ink">
              {seller.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl md:text-4xl">{seller.name}</h1>
                {seller.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gold-lt">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-white/60">
                {seller.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {seller.location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Member since {seller.memberSince}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 fill-gold text-gold" />
                  {seller.rating.toFixed(1)} ({reviews.length} review{reviews.length === 1 ? "" : "s"})
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <FollowButton
                sellerId={seller.id}
                initialFollowing={seller.isFollowing}
                initialCount={seller.followersCount}
                isSelf={seller.isSelf}
              />
            </div>
          </div>

          {seller.bio && (
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/70">{seller.bio}</p>
          )}

          <div className="mt-8 flex flex-wrap gap-6 border-t border-white/10 pt-5 text-xs">
            <div>
              <p className="font-display text-2xl font-semibold text-gold-lt">{seller.activeListings}</p>
              <p className="mt-0.5 uppercase tracking-widest text-white/45">Active lots</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-gold-lt">{seller.sales}</p>
              <p className="mt-0.5 uppercase tracking-widest text-white/45">Sales</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-gold-lt">{seller.followersCount}</p>
              <p className="mt-0.5 uppercase tracking-widest text-white/45">Followers</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-gold-lt">{seller.totalBids}</p>
              <p className="mt-0.5 uppercase tracking-widest text-white/45">Bids received</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          {liveLots.length > 0 && (
            <>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <p className="eyebrow flex items-center gap-2">
                    <span className="live-dot" /> Live &amp; Upcoming
                  </p>
                  <h2 className="mt-2 font-display text-2xl md:text-3xl">Active lots</h2>
                </div>
                <Badge tone="gold">{liveLots.length} lot{liveLots.length === 1 ? "" : "s"}</Badge>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {liveLots.map((item) => (
                  <ItemCard key={item.id} item={item} isFavorited={fav.has(item.id)} />
                ))}
              </div>
            </>
          )}

          {liveLots.length === 0 && endedLots.length === 0 && (
            <div className="mx-auto max-w-md rounded-md border border-dashed border-line-2 bg-paper/60 px-6 py-16 text-center">
              <Package className="mx-auto h-10 w-10 text-line-2" />
              <p className="mt-5 font-display text-2xl">No lots yet</p>
              <p className="mt-2 text-sm text-muted">This seller has not listed anything on ANTIQUA yet.</p>
              <div className="mt-6">
                <Link href="/discover"><Button variant="outline">Browse other lots</Button></Link>
              </div>
            </div>
          )}

          {endedLots.length > 0 && (
            <div className="mt-14">
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <p className="eyebrow">Past lots</p>
                  <h2 className="mt-2 font-display text-2xl md:text-3xl">Ended auctions</h2>
                </div>
                <Badge tone="muted">{endedLots.length} lot{endedLots.length === 1 ? "" : "s"}</Badge>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {endedLots.map((item) => (
                  <ItemCard key={item.id} item={item} isFavorited={fav.has(item.id)} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 border-t border-line pt-10">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="eyebrow">Buyer feedback</p>
                <h2 className="mt-2 font-display text-2xl md:text-3xl">Reviews</h2>
              </div>
              {reviews.length > 0 && (
                <Badge tone="gold">{reviews.length} review{reviews.length === 1 ? "" : "s"}</Badge>
              )}
            </div>
            <ReviewList reviews={reviews} />
          </div>
        </Container>
      </section>
    </>
  );
}