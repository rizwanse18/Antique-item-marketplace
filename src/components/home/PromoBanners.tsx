import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Flame, Sparkles, Tag } from "lucide-react";

export function PromoBanners() {
  return (
    <section className="bg-cream py-8">
      <Container className="grid gap-4 md:grid-cols-3">
        {/* Banner 1: Flash Deals */}
        <Link href="/auctions" className="group relative overflow-hidden rounded-xl bg-burgundy p-6 text-white transition-transform hover:-translate-y-1">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
              <Flame className="h-3 w-3 text-gold-lt" /> Ending Soon
            </span>
            <h3 className="mt-3 font-display text-2xl font-semibold">Flash Auctions</h3>
            <p className="mt-1 text-sm text-white/70">Bid on pieces closing in the next 6 hours.</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gold-lt group-hover:underline">View Lots &rarr;</p>
          </div>
          <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        </Link>

        {/* Banner 2: New Arrivals */}
        <Link href="/discover" className="group relative overflow-hidden rounded-xl bg-[#1a1a1a] p-6 text-white transition-transform hover:-translate-y-1">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-gold" /> Just Added
            </span>
            <h3 className="mt-3 font-display text-2xl font-semibold">New Arrivals</h3>
            <p className="mt-1 text-sm text-white/70">Freshly sourced antiques from top dealers.</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gold group-hover:underline">Explore Now &rarr;</p>
          </div>
          <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-gold/10 blur-2xl" />
        </Link>

        {/* Banner 3: Sell */}
        <Link href="/sell" className="group relative overflow-hidden rounded-xl bg-[#c8a45c] p-6 text-ink transition-transform hover:-translate-y-1">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
              <Tag className="h-3 w-3" /> Consign
            </span>
            <h3 className="mt-3 font-display text-2xl font-semibold">Sell Your Antiques</h3>
            <p className="mt-1 text-sm text-ink/70">Reach 50,000+ global collectors today.</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink group-hover:underline">Start Selling &rarr;</p>
          </div>
          <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
        </Link>
      </Container>
    </section>
  );
}