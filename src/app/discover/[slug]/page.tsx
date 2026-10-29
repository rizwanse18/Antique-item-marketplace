import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Gallery, BidPanel, SellerPanel, ItemTabs, RelatedItems } from "@/components/item";
import { getItemBySlug } from "@/lib/products";
import { getMyFavoritedIds } from "@/lib/favorites";
import { getBidHistory } from "@/lib/bids";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) return { title: "Lot not found" };

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { orderBy: [{ isPrimary: "desc" }, { order: "asc" }], take: 1 } },
  });
  const imageUrl = product?.images[0]?.url;

  return {
    title: item.title,
    description: item.description.slice(0, 160),
    alternates: { canonical: `/discover/${item.slug}` },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.description.slice(0, 200),
      url: `/discover/${item.slug}`,
      images: imageUrl ? [{ url: imageUrl, alt: item.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.description.slice(0, 200),
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

function BidPanelSkeleton() {
  return <div className="h-72 animate-pulse rounded-md border border-line-2 bg-[#f3ece0]" />;
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) notFound();

  const [favoritedIds, bidHistory, user, productRow] = await Promise.all([
    getMyFavoritedIds(),
    getBidHistory(item.id, 25),
    getCurrentUser(),
    prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: [{ isPrimary: "desc" }, { order: "asc" }], take: 3 },
        seller: { select: { name: true } },
        category: true,
      },
    }),
  ]);

  const isFav = favoritedIds.includes(item.id);
  const itemWithBids = { ...item, bidHistory };

  const imageUrls = (productRow?.images ?? []).map(
    (img) => `${SITE_URL}${img.url}`
  );

  const isEnded = new Date(item.endsAt).getTime() <= Date.now();
  const availability = isEnded ? "https://schema.org/SoldOut" : "https://schema.org/InStock";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title,
    description: item.description,
    image: imageUrls.length ? imageUrls : undefined,
    sku: item.id,
    category: item.category,
    brand: item.maker ? { "@type": "Brand", name: item.maker } : undefined,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/discover/${item.slug}`,
      priceCurrency: "USD",
      price: item.currentBid,
      availability,
      seller: { "@type": "Person", name: productRow?.seller.name ?? "ANTIQUA Seller" },
      validFrom: new Date(Date.now() - 86400000).toISOString(),
    },
    ...(item.bidsCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5",
            reviewCount: String(item.bidsCount),
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Discover", item: `${SITE_URL}/discover` },
      { "@type": "ListItem", position: 3, name: item.category, item: `${SITE_URL}/discover?category=${item.categorySlug}` },
      { "@type": "ListItem", position: 4, name: item.title, item: `${SITE_URL}/discover/${item.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="border-b border-line bg-cream">
        <Container className="flex flex-wrap items-center gap-2 py-4 text-xs text-muted">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="text-muted-2">/</span>
          <Link href="/discover" className="hover:text-ink">Discover</Link>
          <span className="text-muted-2">/</span>
          <Link href={`/discover?category=${item.categorySlug}`} className="hover:text-ink">{item.category}</Link>
          <span className="text-muted-2">/</span>
          <span className="truncate text-ink/80">{item.title}</span>
        </Container>
      </div>

      <section className="py-10">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <Gallery item={item} />
              <div className="mt-10 hidden lg:block"><ItemTabs item={itemWithBids} /></div>
            </div>
            <div>
              <p className="eyebrow">{item.category} / {item.era}</p>
              <h1 className="mt-2.5 text-3xl leading-tight md:text-4xl">{item.title}</h1>
              <p className="mt-3 text-sm text-muted">{item.origin}{item.maker ? ` / ${item.maker}` : ""}</p>
              <div className="mt-6">
                <Suspense fallback={<BidPanelSkeleton />}>
                  <BidPanel item={item} isFavorited={isFav} currentUserId={user?.id ?? null} />
                </Suspense>
              </div>
              <div className="mt-6"><SellerPanel item={item} /></div>
            </div>
          </div>
          <div className="mt-10 lg:hidden"><ItemTabs item={itemWithBids} /></div>
        </Container>
      </section>

      <Suspense fallback={<div className="h-64" />}>
        <RelatedItems item={item} />
      </Suspense>
    </>
  );
}