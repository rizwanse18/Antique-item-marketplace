import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CATEGORIES } from "@/lib/mock-data";
import {
  Armchair, BookOpen, Clock, FlaskConical, Gem, Landmark,
  Package, Paintbrush, Shirt, Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  clocks: Clock,
  furniture: Armchair,
  paintings: Paintbrush,
  "fine-art": Paintbrush,
  silver: Sparkles,
  ceramics: FlaskConical,
  jewellery: Gem,
  jewelry: Gem,
  books: BookOpen,
  manuscripts: BookOpen,
  "asian-art": Landmark,
  asian: Landmark,
  sculpture: Package,
  textiles: Shirt,
  decorative: Landmark,
  militaria: Landmark,
};

function iconFor(slug: string): LucideIcon {
  return ICONS[slug.toLowerCase()] ?? Sparkles;
}

export function CategoryStrip() {
  return (
    <section className="border-b border-line bg-cream py-14">
      <Container>
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Departments</p>
            <h2 className="mt-2.5 text-3xl md:text-4xl">Browse by category</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              From rare clocks to fine art - explore our curated departments.
            </p>
          </div>
          <Link
            href="/categories"
            className="hidden rounded-sm border border-line-2 bg-paper px-5 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-ink sm:inline-flex"
          >
            All categories
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {CATEGORIES.map((cat) => {
            const Icon = iconFor(cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/discover?category=${cat.slug}`}
                className="group relative flex flex-col items-center rounded-lg border border-line bg-paper p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-card"
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-lt/40 to-gold/20 text-gold-dk transition-all duration-300 group-hover:scale-110 group-hover:from-gold-lt group-hover:to-gold group-hover:text-ink">
                  <Icon className="h-6 w-6" strokeWidth={1.6} />
                </div>
                <span className="text-[13px] font-semibold leading-tight text-ink">
                  {cat.name}
                </span>
                <span className="mt-1 text-[11px] text-muted-2">
                  {cat.count.toLocaleString()} lots
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}