import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "live" | "gold" | "muted" | "success";

const tones: Record<Tone, string> = {
  live:    "bg-danger/10 text-danger",
  gold:    "bg-gold/20 text-gold-dk",
  muted:   "bg-black/5 text-muted",
  success: "bg-success/15 text-success",
};

export function Badge({
  tone = "muted",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}