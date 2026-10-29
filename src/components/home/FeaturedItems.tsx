import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ItemCard } from "@/components/marketplace/ItemCard";
import type { Item } from "@/types";

export function FeaturedItems({ items, favoritedIds = [] }: { items: Item[]; favoritedIds?: string[] }) {
  if (!items.length) return null;
  const fav = new Set(favoritedIds);
  return (
    <section className="border-y border-line bg-cream py-16">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Curated Selection</p>
            <h2 className="mt-2.5 text-3xl md:text-4xl">Featured items</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Hand-picked pieces available for immediate purchase.
            </p>
          </div>
          <Link href="/discover"><Button variant="outline">See all items</Button></Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} isFavorited={fav.has(item.id)} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function RecentlyAdded({ items, favoritedIds = [] }: { items: Item[]; favoritedIds?: string[] }) {
  if (!items.length) return null;
  const fav = new Set(favoritedIds);
  return (
    <section className="py-16">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Fresh to Market</p>
            <h2 className="mt-2.5 text-3xl md:text-4xl">Recently added</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Newly consigned pieces from private collections and estates worldwide.
            </p>
          </div>
          <Link href="/discover"><Button variant="outline">Full catalogue</Button></Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} isFavorited={fav.has(item.id)} />
          ))}
        </div>
      </Container>
    </section>
  );
}