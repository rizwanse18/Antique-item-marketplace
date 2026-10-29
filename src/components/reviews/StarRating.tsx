"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  onChange,
  size = "md",
  readOnly = false,
}: {
  value: number;
  onChange?: (n: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}) {
  const sizes = { sm: "h-3 w-3", md: "h-5 w-5", lg: "h-7 w-7" };
  const cls = sizes[size];

  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        if (readOnly) {
          return (
            <span
              key={n}
              aria-label={`${n} star${n === 1 ? "" : "s"}`}
              className="inline-flex"
            >
              <Star className={cn(cls, filled ? "fill-gold text-gold" : "text-line-2")} />
            </span>
          );
        }
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange?.(n)}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            className="cursor-pointer transition-transform hover:scale-110"
          >
            <Star className={cn(cls, filled ? "fill-gold text-gold" : "text-line-2")} />
          </button>
        );
      })}
    </div>
  );
}