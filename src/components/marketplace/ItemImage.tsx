import { cn } from "@/lib/utils";
import type { Item } from "@/types";

export function ItemImage({
  item,
  index = 0,
  className,
  alt,
}: {
  item: Item;
  index?: number;
  className?: string;
  alt?: string;
}) {
  const image = item.images?.[index];

  if (image) {
    return (
      <img
        src={image.url}
        alt={alt ?? item.title}
        className={cn("h-full w-full object-cover", className)}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={cn("h-full w-full", className)}
      style={{
        background: `radial-gradient(120% 100% at 30% 15%, ${item.plate.to}, ${item.plate.from} 70%)`,
      }}
    />
  );
}

export function hasImages(item: Item): boolean {
  return Array.isArray(item.images) && item.images.length > 0;
}