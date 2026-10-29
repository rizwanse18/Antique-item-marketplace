import { Container } from "@/components/ui/Container";
import { ItemCard } from "@/components/marketplace/ItemCard";
import { getRelatedItems } from "@/lib/products";
import { getMyFavoritedIds } from "@/lib/favorites";
import type { Item } from "@/types";

export async function RelatedItems({ item }: { item: Item }) {
  const [related, favoritedIds] = await Promise.all([
    getRelatedItems(item, 3),
    getMyFavoritedIds(),
  ]);
  if (!related.length) return null;
  const fav = new Set(favoritedIds);

  return (
    <section className="border-t border-line bg-cream py-14">
      <Container>
        <div className="mb-8">
          <p className="eyebrow">You may also like</p>
          <h2 className="mt-2.5 text-2xl md:text-3xl">Related lots</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <ItemCard key={r.id} item={r} isFavorited={fav.has(r.id)} />
          ))}
        </div>
      </Container>
    </section>
  );
}