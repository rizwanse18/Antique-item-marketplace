import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ItemCard } from "@/components/marketplace/ItemCard";
import type { Item } from "@/types";

export function LiveAuctionsSection({ items, favoritedIds = [] }: { items: Item[]; favoritedIds?: string[] }) {
  if (!items.length) return null;
  const fav = new Set(favoritedIds);
  return (
    <section className="border-y border-line bg-cream py-16">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <span className="live-dot" /> Live Now
            </p>
            <h2 className="mt-2.5 text-3xl md:text-4xl">Live auctions</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Real-time bidding on lots closing soon. The gavel falls fast.
            </p>
          </div>
          <Link href="/auctions"><Button variant="outline">View all auctions</Button></Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} isFavorited={fav.has(item.id)} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function EndingSoonSection({ items, favoritedIds = [] }: { items: Item[]; favoritedIds?: string[] }) {
  if (!items.length) return null;
  const fav = new Set(favoritedIds);
  return (
    <section className="py-16">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Final Call</p>
            <h2 className="mt-2.5 text-3xl md:text-4xl">Ending soon</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Lots closing within the next few hours.
            </p>
          </div>
          <Link href="/auctions"><Button variant="outline">See all ending lots</Button></Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} isFavorited={fav.has(item.id)} />
          ))}
        </div>
      </Container>
    </section>
  );
}