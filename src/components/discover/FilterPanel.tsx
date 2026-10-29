"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/types";
import type { DiscoverFilters } from "@/lib/discover-utils";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line pb-5">
      <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-2">
        {title}
      </h4>
      {children}
    </div>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1.5 text-sm">
      <span className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-[3px] border transition-colors",
            checked
              ? "border-gold bg-gold text-ink"
              : "border-line-2 bg-paper text-transparent"
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <span className={cn("text-ink/85", checked && "font-medium text-ink")}>
          {label}
        </span>
      </span>
      {count !== undefined && (
        <span className="text-[11px] text-muted-2">{count}</span>
      )}
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
    </label>
  );
}

export function FilterPanel({
  categories,
  origins,
  filters,
  onChange,
  onClear,
}: {
  categories: Category[];
  origins: string[];
  filters: DiscoverFilters;
  onChange: (next: DiscoverFilters) => void;
  onClear: () => void;
}) {
  const toggleArray = (key: "categories" | "origins", value: string) => {
    const arr = filters[key];
    const next = arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];
    onChange({ ...filters, [key]: next });
  };

  const setSaleType = (v: DiscoverFilters["saleType"]) =>
    onChange({ ...filters, saleType: v });

  const hasAny =
    filters.categories.length > 0 ||
    filters.origins.length > 0 ||
    filters.saleType !== "all" ||
    filters.priceMin !== null ||
    filters.priceMax !== null ||
    filters.onlyLive;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold">Filters</h3>
        {hasAny && (
          <button
            type="button"
            onClick={onClear}
            className="text-[12px] font-semibold text-gold-dk hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <Section title="Sale type">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { v: "all", l: "All" },
              { v: "auction", l: "Auction" },
              { v: "buynow", l: "Buy Now" },
            ] as const
          ).map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => setSaleType(o.v)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                filters.saleType === o.v
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-paper text-muted hover:border-muted-2 hover:text-ink"
              )}
            >
              {o.l}
            </button>
          ))}
        </div>
        <CheckRow
          checked={filters.onlyLive}
          onChange={() =>
            onChange({ ...filters, onlyLive: !filters.onlyLive })
          }
          label="Live auctions only"
        />
      </Section>

      <Section title="Category">
        <div className="max-h-64 overflow-y-auto pr-1">
          {categories.map((c) => (
            <CheckRow
              key={c.slug}
              checked={filters.categories.includes(c.slug)}
              onChange={() => toggleArray("categories", c.slug)}
              label={c.name}
              count={c.count}
            />
          ))}
        </div>
      </Section>

      <Section title="Price (USD)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            value={filters.priceMin ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                priceMin: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="w-full rounded-sm border border-line-2 bg-paper px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
          <span className="text-muted-2">–</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Max"
            value={filters.priceMax ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                priceMax: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="w-full rounded-sm border border-line-2 bg-paper px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>
      </Section>

      <Section title="Origin">
        <div className="max-h-52 overflow-y-auto pr-1">
          {origins.map((o) => (
            <CheckRow
              key={o}
              checked={filters.origins.includes(o)}
              onChange={() => toggleArray("origins", o)}
              label={o}
            />
          ))}
        </div>
      </Section>

      <div className="rounded-md border border-dashed border-line-2 bg-paper/60 p-4 text-[11px] leading-relaxed text-muted">
        More filters (condition, era, material, maker, authenticity) will appear
        once listing metadata is wired into the database in later phases.
      </div>
    </div>
  );
}