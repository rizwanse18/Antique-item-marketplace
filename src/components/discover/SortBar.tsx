"use client";

import { cn } from "@/lib/utils";
import type { SortKey } from "@/lib/discover-utils";

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "ending", label: "Ending soonest" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "bids", label: "Most bids" },
  { value: "views", label: "Most watched" },
];

export function SortBar({
  count,
  sort,
  onSort,
  onOpenFilters,
}: {
  count: number;
  sort: SortKey;
  onSort: (s: SortKey) => void;
  onOpenFilters: () => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
      <p className="text-xs text-muted">
        <span className="font-semibold text-ink">{count}</span>{" "}
        lot{count === 1 ? "" : "s"} found
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex items-center gap-2 rounded-sm border border-line-2 bg-paper px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-ink lg:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-3.5 w-3.5"
          >
            <path d="M3 6h18M6 12h12M10 18h4" />
          </svg>
          Filters
        </button>

        <label className="flex items-center gap-2 text-xs text-muted">
          <span className="hidden sm:inline">Sort</span>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as SortKey)}
            className={cn(
              "appearance-none rounded-full border border-line-2 bg-paper py-2 pl-3.5 pr-8 text-xs font-medium text-ink",
              "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237d7266' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")]",
              "bg-[position:right_10px_center] bg-no-repeat"
            )}
          >
            {OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}