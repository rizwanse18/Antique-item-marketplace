import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-gold text-gold">
        <div className="absolute inset-1 rounded-full border border-gold/35" />
        <svg
          viewBox="0 0 24 24"
          className="h-[19px] w-[19px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-6 9 6" />
          <path d="M5 9v11h14V9" />
          <path d="M9 20v-6h6v6" />
        </svg>
      </div>
      <div className="hidden flex-col leading-none sm:flex">
        <span className="font-display text-[23px] font-semibold tracking-[.14em] text-white">
          ANTIQUA
        </span>
        <span className="mt-[3px] text-[8.5px] font-medium uppercase tracking-[.3em] text-gold">
          Est. 1897 · Fine Art &amp; Antiques
        </span>
      </div>
    </div>
  );
}