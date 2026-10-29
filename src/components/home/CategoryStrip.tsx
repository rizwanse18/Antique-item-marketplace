import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CATEGORIES } from "@/lib/mock-data";

export function CategoryStrip() {
  return (
    <section className="py-16">
      <Container>
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Departments</p>
            <h2 className="mt-2.5 text-3xl md:text-4xl">Browse by category</h2>
          </div>
          <Link
            href="/categories"
            className="hidden rounded-sm border border-line-2 bg-paper px-5 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-ink sm:inline-flex"
          >
            All categories
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/discover?category=${cat.slug}`}
              className="group flex flex-col items-center rounded-md border border-line bg-paper p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-soft"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold-dk">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </div>
              <span className="text-[12.5px] font-semibold leading-tight text-ink">
                {cat.name}
              </span>
              <span className="mt-1 text-[11px] text-muted-2">
                {cat.count.toLocaleString()}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}