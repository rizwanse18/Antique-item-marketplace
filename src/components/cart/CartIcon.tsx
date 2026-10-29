"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "./CartContext";

export function CartIcon() {
  const { count } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showBadge = mounted && count > 0;

  return (
    <Link
      href="/cart"
      aria-label="Cart"
      className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[rgba(255,255,255,0.08)]"
    >
      <ShoppingBag
        className="h-[18px] w-[18px]"
        style={{ color: "rgba(255,255,255,0.85)" }}
        strokeWidth={1.9}
      />
      {showBadge && (
        <span
          className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold"
          style={{ backgroundColor: "#c8a45c", color: "#15110e" }}
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}