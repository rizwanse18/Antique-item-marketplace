import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SELLERS } from "@/lib/mock-data";

export function FeaturedSellers() {
  return (
    <section className="border-y border-line bg-cream py-16">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Vetted Consignors</p>
            <h2 className="mt-2.5 text-3xl md:text-4xl">Featured sellers</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Trusted dealers, galleries and specialists from across the world.
            </p>
          </div>
          <Link href="/sellers"><Button variant="outline">All sellers</Button></Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SELLERS.map((s) => (
            <div
              key={s.id}
              className="rounded-md border border-line bg-paper p-6 text-center transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold-lt to-gold font-display text-xl font-bold text-ink">
                {s.initials}
              </div>
              <div className="mt-4 flex items-center justify-center gap-1.5">
                <h3 className="font-display text-lg font-semibold">{s.name}</h3>
                {s.verified && <BadgeCheck className="h-4 w-4 text-gold-dk" />}
              </div>
              <p className="mt-1 text-xs text-muted">{s.location}</p>
              <div className="mt-4 flex items-center justify-center gap-4 border-t border-line pt-4 text-xs">
                <div>
                  <p className="font-display text-base font-bold">{s.rating}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-2">Rating</p>
                </div>
                <div className="h-6 w-px bg-line" />
                <div>
                  <p className="font-display text-base font-bold">{s.sales}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-2">Sales</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}