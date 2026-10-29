import { BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Seller } from "@/types";

export function SellerCard({ seller }: { seller: Seller }) {
  return (
    <Card className="p-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold-lt to-gold font-display text-xl font-bold text-ink">
        {seller.initials}
      </div>
      <div className="mt-4 flex items-center justify-center gap-1.5">
        <h3 className="font-display text-lg font-semibold">{seller.name}</h3>
        {seller.verified && <BadgeCheck className="h-4 w-4 text-gold-dk" />}
      </div>
      <p className="mt-1 text-xs text-muted">{seller.location}</p>
      <div className="mt-4 flex items-center justify-center gap-4 border-t border-line pt-4 text-xs">
        <div>
          <p className="font-display text-base font-bold">{seller.rating}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-2">Rating</p>
        </div>
        <div className="h-6 w-px bg-line" />
        <div>
          <p className="font-display text-base font-bold">{seller.sales}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-2">Sales</p>
        </div>
      </div>
    </Card>
  );
}