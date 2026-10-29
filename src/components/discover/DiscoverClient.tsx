"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ItemCard } from "@/components/marketplace/ItemCard";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FilterPanel } from "./FilterPanel";
import { SortBar } from "./SortBar";
import {
  EMPTY_FILTERS,
  applyFilters,
  applySort,
  uniqueOrigins,
  type DiscoverFilters,
  type SortKey,
} from "@/lib/discover-utils";
import { CATEGORIES } from "@/lib/mock-data";
import type { Item } from "@/types";

export function DiscoverClient({
  items,
  favoritedIds = [],
  initialQuery = "",
  initialCategory = "",
}: {
  items: Item[];
  favoritedIds?: string[];
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [filters, setFilters] = useState<DiscoverFilters>(() => ({
    ...EMPTY_FILTERS,
    q: initialQuery,
    categories: initialCategory ? [initialCategory] : [],
  }));
  const [sort, setSort] = useState<SortKey>("ending");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fav = useMemo(() => new Set(favoritedIds), [favoritedIds]);
  const origins = useMemo(() => uniqueOrigins(items), [items]);

  const results = useMemo(() => {
    const filtered = applyFilters(items, filters);
    return applySort(filtered, sort);
  }, [items, filters, sort]);

  const hasQuery = filters.q.trim().length > 0;

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-9">
        <Container>
          <p className="eyebrow">The Catalogue</p>
          <h1 className="mt-2.5 text-4xl md:text-5xl">Discover</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Search authenticated antiques, fine art and rare collectibles from
            vetted consignors worldwide.
          </p>
          <div className="relative mt-6 max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
            <input
              type="search"
              value={filters.q}
              onChange={(e) =>
                setFilters((f) => ({ ...f, q: e.target.value }))
              }
              placeholder="Search by title, maker, era, material or origin…"
              className="w-full rounded-full border border-line-2 bg-paper py-3.5 pl-11 pr-11 text-sm placeholder:text-muted-2 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
            {hasQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setFilters((f) => ({ ...f, q: "" }))}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/5 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <FilterPanel
                  categories={CATEGORIES}
                  origins={origins}
                  filters={filters}
                  onChange={setFilters}
                  onClear={() => setFilters(EMPTY_FILTERS)}
                />
              </div>
            </aside>

            <div>
              <SortBar
                count={results.length}
                sort={sort}
                onSort={setSort}
                onOpenFilters={() => setDrawerOpen(true)}
              />

              {results.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      isFavorited={fav.has(item.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-line-2 bg-paper/60 px-6 py-24 text-center">
                  <Search className="h-10 w-10 text-line-2" />
                  <p className="mt-5 font-display text-2xl">No lots found</p>
                  <p className="mt-2 max-w-sm text-sm text-muted">
                    {hasQuery
                      ? `We couldn\u2019t find anything matching "${filters.q}".`
                      : "No lots match your current filters."}
                  </p>
                  <div className="mt-6">
                    <Button variant="outline" onClick={() => setFilters(EMPTY_FILTERS)}>
                      Clear filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-[200] bg-ink/70 backdrop-blur-sm lg:hidden"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="absolute inset-y-0 left-0 w-full max-w-sm overflow-y-auto bg-paper p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="eyebrow">Refine</p>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/5 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <FilterPanel
              categories={CATEGORIES}
              origins={origins}
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters(EMPTY_FILTERS)}
            />
            <div className="sticky bottom-0 -mx-5 mt-6 border-t border-line bg-paper px-5 py-4">
              <Button
                variant="gold"
                className="w-full"
                onClick={() => setDrawerOpen(false)}
              >
                Show {results.length} result{results.length === 1 ? "" : "s"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}