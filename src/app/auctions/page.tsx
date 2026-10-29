import { closeExpiredAuctions } from "@/lib/auctions";
import { connection } from "next/server";
import { Container } from "@/components/ui/Container";
import { ItemCard } from "@/components/marketplace/ItemCard";
import { getLiveAuctionItems } from "@/lib/products";
import { getMyFavoritedIds } from "@/lib/favorites";

export const metadata = { title: "Live Auctions" };
export const instant = false;

export default async function AuctionsPage() {
  await closeExpiredAuctions();
  await connection();
  const [items, favoritedIds] = await Promise.all([
    getLiveAuctionItems(),
    getMyFavoritedIds(),
  ]);
  const fav = new Set(favoritedIds);
  const now = Date.now();
  const totalBids = items.reduce((s, i) => s + i.bidsCount, 0);
  const top = items.reduce((m, i) => Math.max(m, i.currentBid || 0), 0);
  const soon = items.filter((i) => new Date(i.endsAt).getTime() - now < 3600 * 1000).length;

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-11">
        <Container>
          <p className="eyebrow flex items-center gap-2">
            <span className="live-dot" /> Live Saleroom
          </p>
          <h1 className="mt-2.5 text-4xl md:text-5xl">Live Auctions</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Real-time bidding on lots closing now.
          </p>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Live Lots", value: items.length },
              { label: "Total Bids", value: totalBids },
              { label: "Highest Bid", value: top ? "$" + top.toLocaleString() : "-" },
              { label: "Ending < 1h", value: soon },
            ].map((s) => (
              <div key={s.label} className="rounded-md border border-line bg-paper p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-2">{s.label}</p>
                <p className="mt-2 font-display text-3xl font-bold leading-none">{s.value}</p>
              </div>
            ))}
          </div>

          {items.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} isFavorited={fav.has(item.id)} />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-line-2 bg-paper/60 py-20 text-center">
              <p className="font-display text-2xl">No live auctions right now</p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}