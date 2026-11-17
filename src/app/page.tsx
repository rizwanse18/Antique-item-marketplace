import { closeExpiredAuctions } from "@/lib/auctions";
import {
  Hero,
  PromoBanners,
  TrustBar,
  CategoryStrip,
  LiveAuctionsSection,
  EndingSoonSection,
  FeaturedItems,
  RecentlyAdded,
  FeaturedSellers,
  WhyChooseUs,
  HowItWorksSection,
  Testimonials,
  Newsletter,
} from "@/components/home";
import { getLiveAuctionItems, getBuyNowItems, getRecentlyAdded } from "@/lib/products";
import { getMyFavoritedIds } from "@/lib/favorites";
import { ITEMS as MOCK_ITEMS } from "@/lib/mock-data";

export const instant = false;

export default async function HomePage() {
  await closeExpiredAuctions();
  
  const [dbLive, dbBuyNow, dbRecent, favoritedIds] = await Promise.all([
    getLiveAuctionItems(),
    getBuyNowItems(),
    getRecentlyAdded(4),
    getMyFavoritedIds(),
  ]);

  // FALLBACKS: If DB is empty, use mock data so the homepage always looks full
  const live = dbLive.length > 0 ? dbLive : MOCK_ITEMS.filter((i: any) => i.saleType !== "buynow").slice(0, 8);
  const buyNow = dbBuyNow.length > 0 ? dbBuyNow : MOCK_ITEMS.filter((i: any) => i.saleType !== "auction").slice(0, 4);
  const recent = dbRecent.length > 0 ? dbRecent : MOCK_ITEMS.slice(0, 4);

  return (
    <>
      <Hero featured={live[0] ?? null} />
      <PromoBanners />
      <TrustBar />
      <CategoryStrip />
      <LiveAuctionsSection items={live.slice(0, 4)} favoritedIds={favoritedIds} />
      <EndingSoonSection items={live.slice(0, 3)} favoritedIds={favoritedIds} />
      <FeaturedItems items={buyNow.slice(0, 4)} favoritedIds={favoritedIds} />
      <RecentlyAdded items={recent} favoritedIds={favoritedIds} />
      <FeaturedSellers />
      <WhyChooseUs />
      <HowItWorksSection />
      <Testimonials />
      <Newsletter />
    </>
  );
}