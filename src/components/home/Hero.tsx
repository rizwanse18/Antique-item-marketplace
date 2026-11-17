import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/components/marketplace/Countdown";
import { formatMoney } from "@/lib/mock-data";
import type { Item } from "@/types";

export function Hero({ featured }: { featured: Item | null }) {
  const displayItem = featured || {
    title: "Rare 18th Century Giltwood Mirror",
    category: "Furniture",
    era: "French, c. 1780",
    currentBid: 4200,
    bidsCount: 14,
    watchers: 89,
    endsAt: new Date(Date.now() + 86400000).toISOString(),
    slug: "rare-18th-century-giltwood-mirror",
  };

  return (
    /* Removed overflow-hidden from section so the badge doesn't get cut off */
    <section className="relative bg-ink text-white">
      {/* Moved overflow-hidden here for the background gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_78%_18%,rgba(110,31,43,.5),transparent_62%),radial-gradient(700px_500px_at_12%_92%,rgba(200,164,92,.16),transparent_65%)]" />
      </div>
      
      <Container className="relative z-10 grid gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[.24em] text-gold">
            International Auction House / Since 1897
          </p>
          <h1 className="mt-4 text-5xl leading-[1.02] tracking-tight md:text-6xl lg:text-[64px]">
            Where history
            <br />
            changes{" "}
            <em className="italic font-normal text-gold-lt">hands.</em>
          </h1>
          <p className="mt-5 max-w-xl font-light text-white/70">
            A curated international marketplace for authenticated antiques, rare
            collectibles and fine art. Bid live against collectors worldwide or
            consign your own treasures to a global audience.
          </p>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-white/65">
            {["Certified authentic", "Insured shipping", "128 countries served"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <span className="inline-block h-1 w-1 rounded-full bg-gold" />
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/discover"><Button variant="gold" size="lg">Explore Antiques</Button></Link>
            <Link href="/auctions">
              <Button variant="outline" size="lg" className="border-white/25 bg-transparent text-white hover:border-white/60 hover:bg-white/5">
                Live Auctions
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-10 border-t border-white/10 pt-6">
            {[
              { num: "12,400+", lbl: "Active Lots" },
              { num: "48,900+", lbl: "Bids Placed" },
              { num: "128", lbl: "Countries" },
              { num: "99.4%", lbl: "Auth. Rate" },
            ].map((s) => (
              <div key={s.lbl}>
                <p className="font-display text-2xl font-semibold leading-none text-gold-lt">{s.num}</p>
                <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[.2em] text-white/45">{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Added pt-4 so the absolute badge has room to breathe */}
        <div className="relative pt-4">
          <div className="relative rounded-lg border border-gold/30 bg-gradient-to-br from-white/[.07] to-white/[.02] p-4 backdrop-blur-md">
            <span className="absolute -top-3 left-6 z-10 inline-flex items-center gap-1.5 rounded-full bg-burgundy px-3 py-1 text-[10px] font-bold uppercase tracking-[.22em] text-white shadow-lg">
              <span className="live-dot" /> Live Auction
            </span>
            
            <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-ink-2">
              <img 
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop" 
                alt={displayItem.title}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
            </div>
            
            <div className="mt-3">
              <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-gold">
                {displayItem.category} / {displayItem.era}
              </p>
              <h3 className="mt-1.5 font-display text-xl font-semibold leading-snug text-white line-clamp-2">
                {displayItem.title}
              </h3>
              
              <div className="mt-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[.2em] text-white/45">Current bid</p>
                  <p className="mt-1 font-display text-2xl font-bold leading-none text-gold-lt">{formatMoney(displayItem.currentBid)}</p>
                  <p className="mt-1 text-[11px] text-white/50">{displayItem.bidsCount} bids / {displayItem.watchers} watching</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-semibold uppercase tracking-[.2em] text-white/45">Closes in</p>
                  <Countdown endsAt={displayItem.endsAt} className="mt-1 justify-end text-base text-white" />
                </div>
              </div>
              
              <Link href={`/discover/${displayItem.slug}`} className="mt-4 block">
                <Button variant="gold" className="w-full py-2 text-sm">Place a Bid</Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}