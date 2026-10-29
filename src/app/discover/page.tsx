import { DiscoverClient } from "@/components/discover/DiscoverClient";
import { getAllItems } from "@/lib/products";
import { getMyFavoritedIds } from "@/lib/favorites";

export const metadata = {
  title: "Discover",
  description:
    "Search and filter authenticated antiques, fine art and rare collectibles.",
};
export const instant = false;

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const category = (params.category ?? "").trim();

  const [items, favoritedIds] = await Promise.all([
    getAllItems(),
    getMyFavoritedIds(),
  ]);

  return (
    <DiscoverClient
      key={`${q}|${category}`}
      items={items}
      favoritedIds={favoritedIds}
      initialQuery={q}
      initialCategory={category}
    />
  );
}