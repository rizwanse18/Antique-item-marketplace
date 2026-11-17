import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/components/marketplace/Countdown";
import { ItemImage } from "@/components/marketplace/ItemImage";
import { formatMoney, getSeller } from "@/lib/mock-data";
import type { Item } from "@/types";

export function Hero({ featured }: { featured: Item | null }) {
  const seller = featured ? getSeller(featured.sellerId) : null;

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_78%_18%,rgba(110,31,43,.5),transparent_62%),radial-gradient(700px_500px_at_12%_92%,rgba(200,164,92,.16),transparent_65%)]" />
      <Container className="relative z-10 grid gap-14 py-20 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[.24em] text-gold">
            International Auction House / Since 1897
          </p>
          <h1 className="mt-5 text-5xl leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
            Where history
            <br />
            changes{" "}
            <em className="italic font-normal text-gold-lt">hands.</em>
          </h1>
          <p className="mt-6 max-w-xl font-light text-white/70">
            A curated international marketplace for authenticated antiques, rare
            collectibles and fine art. Bid live against collectors worldwide or
            consign your own treasures to a global audience.
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-white/65">
            {["Certified authentic", "Insured shipping", "128 countries served"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <span className="inline-block h-1 w-1 rounded-full bg-gold" />
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/discover"><Button variant="gold" size="lg">Explore Antiques</Button></Link>
            <Link href="/auctions">
              <Button variant="outline" size="lg" className="border-white/25 bg-transparent text-white hover:border-white/60 hover:bg-white/5">
                Live Auctions
              </Button>
            </Link>
            <Link href="/sell">
              <Button variant="ghost" size="lg" className="text-white/85 hover:bg-white/10 hover:text-white">
                Sell an Antique
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-10 border-t border-white/10 pt-7">
            {[
              { num: "12,400+", lbl: "Active Lots" },
              { num: "48,900+", lbl: "Bids Placed" },
              { num: "128", lbl: "Countries" },
              { num: "99.4%", lbl: "Auth. Rate" },
            ].map((s) => (
              <div key={s.lbl}>
                <p className="font-display text-3xl font-semibold leading-none text-gold-lt">{s.num}</p>
                <p className="mt-2 text-[10.5px] font-medium uppercase tracking-[.2em] text-white/45">{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {featured ? (
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg border border-gold/30 bg-gradient-to-br from-white/[.07] to-white/[.02] p-5 backdrop-blur-md">
              <span className="absolute -top-3 left-6 z-10 inline-flex items-center gap-1.5 rounded-full bg-burgundy px-3 py-1 text-[10px] font-bold uppercase tracking-[.22em] text-white shadow-lg">
                <span className="live-dot" /> Live Lot
              </span>
              {/* --- FIXED IMAGE SECTION --- */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-ink-2">
                <img 
                  src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop" 
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]" />
              </div>
              
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[.24em] text-gold">
                  {featured.category} / {featured.era}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-white">
                  {featured.title}
                </h3>
                {seller && (
                  <p className="mt-1 text-xs text-white/55">
                    {seller.name} / {seller.location}
                  </p>
                )}
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-white/45">Current bid</p>
                    <p className="mt-1 font-display text-3xl font-bold leading-none text-gold-lt">{formatMoney(featured.currentBid)}</p>
                    <p className="mt-1 text-xs text-white/50">{featured.bidsCount} bids / {featured.watchers} watching</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-white/45">Closes in</p>
                    <Countdown endsAt={featured.endsAt} className="mt-1.5 justify-end text-lg text-white" />
                  </div>
                </div>
                <Link href={`/discover/${featured.slug}`} className="mt-5 block">
                  <Button variant="gold" className="w-full">Place a Bid</Button>
                </Link>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 -z-10 h-32 w-32 rounded-full bg-gold/20 blur-3xl" />
          </div>
        ) : null}
      </Container>
    </section>
  );
}