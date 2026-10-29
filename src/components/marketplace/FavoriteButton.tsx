"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFavoriteAction } from "@/app/actions/favorites";

type Variant = "overlay" | "inline";

export function FavoriteButton({
  productId,
  initial,
  variant = "overlay",
  className,
}: {
  productId: string;
  initial: boolean;
  variant?: Variant;
  className?: string;
}) {
  const [fav, setFav] = useState(initial);
  const [pending, startTransition] = useTransition();

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const res = await toggleFavoriteAction(productId);
      if (!res.ok) {
        window.location.href = "/sign-in?next=" + encodeURIComponent(window.location.pathname);
        return;
      }
      setFav(res.favorited);
    });
  };

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-label={fav ? "Remove from watchlist" : "Add to watchlist"}
        className={cn(
          "inline-flex items-center gap-2 rounded-sm border px-3.5 py-2 text-xs font-semibold transition-colors disabled:opacity-60",
          fav
            ? "border-danger/40 bg-danger/10 text-danger"
            : "border-line-2 bg-paper text-ink hover:border-ink",
          className
        )}
      >
        <Heart className="h-3.5 w-3.5" fill={fav ? "currentColor" : "none"} />
        {fav ? "In watchlist" : "Add to watchlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-label={fav ? "Remove from watchlist" : "Add to watchlist"}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white/85 backdrop-blur-md transition-transform hover:scale-110 hover:bg-black/70 disabled:opacity-60",
        fav && "bg-black/70 text-danger",
        className
      )}
    >
      <Heart className="h-3.5 w-3.5" fill={fav ? "currentColor" : "none"} />
    </button>
  );
}