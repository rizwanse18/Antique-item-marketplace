"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Item } from "@/types";

export function Gallery({ item }: { item: Item }) {
  const [active, setActive] = useState(0);
  const images = item.images ?? [];
  const hasPhotos = images.length > 0;

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-line bg-cream">
        {hasPhotos ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images[active]?.url} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-0" style={{ background: `radial-gradient(120% 100% at 30% 15%, ${item.plate.to}, ${item.plate.from} 70%)` }} />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,.022)_0_2px,transparent_2px_5px)]" />
            <div className="absolute inset-0 shadow-[inset_0_0_90px_rgba(0,0,0,.55),inset_0_0_0_1px_rgba(200,164,92,.14)]" />
          </>
        )}
        <div className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.14em] text-white/85 backdrop-blur-md">
          {hasPhotos ? `${active + 1} / ${images.length}` : "No photo"}
        </div>
      </div>

      {hasPhotos && images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              className={cn(
                "relative aspect-square overflow-hidden rounded-sm border-2 transition-all",
                i === active ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={`${item.title} ${i+1}`} className="h-full w-full object-cover" />
              {img.isPrimary && (
                <span className="absolute left-1 top-1 rounded-sm bg-gold px-1 py-0.5 text-[8px] font-bold text-ink">★</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}