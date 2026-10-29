"use client";

import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "./CartContext";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  productId,
  variant = "solid",
  disabled = false,
}: {
  productId: string;
  variant?: "solid" | "outline";
  disabled?: boolean;
}) {
  const { has, add, remove } = useCart();
  const inCart = has(productId);

  if (disabled) return null;

  const onClick = () => {
    if (inCart) remove(productId);
    else add(productId);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-sm border px-3.5 py-2 text-xs font-semibold transition-all",
        inCart
          ? "border-success/40 bg-success/10 text-success"
          : variant === "solid"
          ? "border-ink bg-ink text-white hover:bg-ink-3"
          : "border-line-2 bg-paper text-ink hover:border-ink"
      )}
    >
      {inCart ? (
        <>
          <Check className="h-3.5 w-3.5" /> In cart
        </>
      ) : (
        <>
          <ShoppingBag className="h-3.5 w-3.5" /> Add to cart
        </>
      )}
    </button>
  );
}