import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";
import { getSeller } from "@/lib/mock-data";
import type { Item } from "@/types";

export function SellerPanel({ item }: { item: Item }) {
  const seller = getSeller(item.sellerId);

  return (
    <div className="rounded-md border border-line bg-paper p-5">
      <p className="eyebrow mb-3">Consignor</p>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-lt to-gold font-display text-base font-bold text-ink">
          {seller.initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-display text-lg font-semibold">
              {seller.name}
            </p>
            {seller.verified && (
              <BadgeCheck className="h-4 w-4 flex-shrink-0 text-gold-dk" />
            )}
          </div>
          <p className="text-xs text-muted">{seller.location}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 divide-x divide-line rounded-sm border border-line">
        <div className="px-3 py-3 text-center">
          <p className="inline-flex items-center gap-1 font-display text-lg font-bold">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            {seller.rating}
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-2">
            Rating
          </p>
        </div>
        <div className="px-3 py-3 text-center">
          <p className="font-display text-lg font-bold">{seller.sales}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-2">
            Sales
          </p>
        </div>
      </div>

      <Link
        href={`/sellers/${seller.id}`}
        className="mt-4 block rounded-sm border border-line-2 bg-paper px-4 py-2.5 text-center text-xs font-semibold text-ink transition-colors hover:border-ink"
      >
        Visit storefront
      </Link>
    </div>
  );
}