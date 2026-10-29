import type { Item, SaleType } from "@/types";

export type SortKey =
  | "relevance"
  | "newest"
  | "oldest"
  | "price-asc"
  | "price-desc"
  | "ending"
  | "bids"
  | "views";

export interface DiscoverFilters {
  q: string;
  categories: string[];
  saleType: "all" | SaleType;
  priceMin: number | null;
  priceMax: number | null;
  origins: string[];
  onlyLive: boolean;
}

export const EMPTY_FILTERS: DiscoverFilters = {
  q: "",
  categories: [],
  saleType: "all",
  priceMin: null,
  priceMax: null,
  origins: [],
  onlyLive: false,
};

export function itemPrice(item: Item): number {
  if (item.saleType === "buynow") return item.buyNowPrice ?? item.currentBid;
  return item.bidsCount > 0 ? item.currentBid : item.startingBid;
}

export function applyFilters(items: Item[], f: DiscoverFilters): Item[] {
  const q = f.q.trim().toLowerCase();
  const now = Date.now();

  return items.filter((it) => {
    if (f.categories.length && !f.categories.includes(it.categorySlug)) return false;
    if (f.saleType !== "all" && it.saleType !== f.saleType) return false;

    const price = itemPrice(it);
    if (f.priceMin !== null && price < f.priceMin) return false;
    if (f.priceMax !== null && price > f.priceMax) return false;

    if (f.origins.length && !f.origins.includes(it.origin)) return false;

    if (f.onlyLive) {
      const live = it.saleType !== "buynow" && new Date(it.endsAt).getTime() > now;
      if (!live) return false;
    }

    if (q) {
      const hay = [
        it.title,
        it.description,
        it.category,
        it.era,
        it.origin,
        it.categorySlug,
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });
}

export function applySort(items: Item[], key: SortKey): Item[] {
  const out = [...items];
  switch (key) {
    case "ending":
      out.sort(
        (a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime()
      );
      break;
    case "newest":
      out.sort(
        (a, b) => new Date(b.endsAt).getTime() - new Date(a.endsAt).getTime()
      );
      break;
    case "oldest":
      out.sort(
        (a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime()
      );
      break;
    case "price-asc":
      out.sort((a, b) => itemPrice(a) - itemPrice(b));
      break;
    case "price-desc":
      out.sort((a, b) => itemPrice(b) - itemPrice(a));
      break;
    case "bids":
      out.sort((a, b) => b.bidsCount - a.bidsCount);
      break;
    case "views":
      out.sort((a, b) => b.watchers - a.watchers);
      break;
    default:
      break;
  }
  return out;
}

export function uniqueOrigins(items: Item[]): string[] {
  return Array.from(new Set(items.map((i) => i.origin))).sort();
}