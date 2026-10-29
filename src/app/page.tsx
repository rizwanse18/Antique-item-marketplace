import { closeExpiredAuctions } from "@/lib/auctions";
import {
  Hero,
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

export const instant = false;

export default async function HomePage() {
  await closeExpiredAuctions();
  const [live, buyNow, recent, favoritedIds] = await Promise.all([
    getLiveAuctionItems(),
    getBuyNowItems(),
    getRecentlyAdded(4),
    getMyFavoritedIds(),
  ]);

  return (
    <>
      <Hero featured={live[0] ?? null} />
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