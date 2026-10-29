"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Countdown } from "./Countdown";
import { FavoriteButton } from "./FavoriteButton";
import { formatMoney, getSeller } from "@/lib/mock-data";
import { ItemImage } from "./ItemImage";
import type { Item } from "@/types";

function computeLive(item: Item) {
  return item.saleType !== "buynow" && new Date(item.endsAt).getTime() > Date.now();
}

export function ItemCard({
  item,
  isFavorited = false,
}: {
  item: Item;
  isFavorited?: boolean;
}) {
  const seller = getSeller(item.sellerId);
  const live = computeLive(item);
  const ended = item.saleType !== "buynow" && !live;

  const priceLabel =
    item.saleType === "buynow"
      ? "Price"
      : item.bidsCount > 0
        ? "Current bid"
        : "Starting bid";

  const price =
    item.saleType === "buynow"
      ? item.buyNowPrice ?? item.currentBid
      : item.bidsCount > 0
        ? item.currentBid
        : item.startingBid;

  const typeLabel =
    item.saleType === "buynow"
      ? "Buy Now"
      : item.saleType === "both"
        ? "Auction / BIN"
        : ended
          ? "Ended"
          : "Auction";

  return (
    <Card className="group relative flex flex-col overflow-hidden">
      {/* Stretched link — fills the entire card so clicking anywhere navigates */}
      <Link
        href={`/discover/${item.slug}`}
        aria-label={`View ${item.title}`}
        className="absolute inset-0 z-10 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a45c] focus-visible:ring-offset-2"
      />

      <div className="relative aspect-[4/3] overflow-hidden">
        <ItemImage item={item} />
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,.022)_0_2px,transparent_2px_5px)]" />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_rgba(0,0,0,.25),inset_0_0_0_1px_rgba(200,164,92,.14)]" />

        <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[.2em] text-white/85 backdrop-blur-md">
          {item.categorySlug}
        </div>
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-gold/30 bg-black/55 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[.18em] text-gold-lt backdrop-blur-md">
          {typeLabel}
        </div>

        {/* Favorite button sits above the stretched link */}
        <FavoriteButton
          productId={item.id}
          initial={isFavorited}
          variant="overlay"
          className="absolute right-3 top-3 z-20"
        />
      </div>

      <div className="relative flex flex-1 flex-col p-4">
        <p className="text-[9.5px] font-bold uppercase tracking-[.2em] text-gold-dk">
          {item.category} / {item.era}
        </p>
        <h3 className="mt-2 line-clamp-2 font-display text-[19px] font-semibold leading-snug text-ink transition-colors group-hover:text-burgundy">
          {item.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-[12px] text-muted">
          {seller.name} / {seller.location}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <p className="text-[9.5px] font-semibold uppercase tracking-widest text-muted-2">
              {priceLabel}
            </p>
            <p className="font-display text-[23px] font-bold leading-none">
              {formatMoney(price)}
            </p>
          </div>
          <div className="text-right">
            {item.saleType === "buynow" ? (
              <span className="text-[12.5px] font-bold text-muted">Available</span>
            ) : ended ? (
              <span className="text-[12.5px] font-semibold text-muted">
                Auction ended
              </span>
            ) : (
              <Countdown endsAt={item.endsAt} className="justify-end" />
            )}
            <p className="mt-1 text-[11px] font-medium text-muted-2">
              {item.bidsCount} bid{item.bidsCount === 1 ? "" : "s"} / {item.watchers} watching
            </p>
          </div>
        </div>

        {live && (
          <div className="mt-2">
            <Badge tone="live">
              <span className="live-dot" /> Live
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}