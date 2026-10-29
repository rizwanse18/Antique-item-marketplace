import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-line bg-paper transition-all duration-300 hover:-translate-y-1 hover:border-line-2 hover:shadow-card",
        className
      )}
    >
      {children}
    </div>
  );
}