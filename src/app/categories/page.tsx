import Link from "next/link";
import {
  Armchair, Gem, Watch, Frame, Shapes, Coins, BookOpen, Wine,
  Lamp, Sparkles, Sword, Music, Landmark, Package,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Categories",
  description:
    "Explore the ANTIQUA catalogue by department — furniture, jewelry, ceramics, fine art, rare books and more.",
};
export const instant = false;

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  furniture: Armchair,
  jewelry: Gem,
  watches: Watch,
  paintings: Frame,
  sculptures: Shapes,
  coins: Coins,
  books: BookOpen,
  ceramics: Wine,
  glassware: Lamp,
  textiles: Sparkles,
  military: Sword,
  instruments: Music,
  decorative: Landmark,
  historical: Package,
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
      products: {
        take: 3,
        orderBy: { createdAt: "desc" },
        include: {
          images: {
            take: 1,
            orderBy: [{ isPrimary: "desc" }, { order: "asc" }],
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const totalLots = categories.reduce((sum, c) => sum + c._count.products, 0);

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-11">
        <Container>
          <p className="eyebrow">Departments</p>
          <h1 className="mt-2.5 text-4xl md:text-5xl">Categories</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Explore the marketplace by department and specialty. Every lot is
            authenticated and catalogued by our specialists.
          </p>
          <p className="mt-4 text-xs text-muted-2">
            <span className="font-semibold text-ink">{totalLots}</span> lots across{" "}
            <span className="font-semibold text-ink">{categories.length}</span> departments
          </p>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          {categories.length === 0 ? (
            <div className="mx-auto max-w-md rounded-md border border-dashed border-line-2 bg-paper/60 px-6 py-16 text-center">
              <Package className="mx-auto h-10 w-10 text-line-2" />
              <p className="mt-5 font-display text-2xl">No categories yet</p>
              <p className="mt-2 text-sm text-muted">
                Categories will appear here once the marketplace has listings.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => {
                const Icon = ICONS[cat.slug] ?? Package;
                const count = cat._count.products;
                return (
                  <Link
                    key={cat.id}
                    href={`/discover?category=${cat.slug}`}
                    className="group rounded-md border border-line bg-paper p-5 transition-all hover:-translate-y-0.5 hover:border-line-2 hover:shadow-soft"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold-dk">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-display text-3xl font-bold text-[#e5dccd]">
                        {count}
                      </span>
                    </div>

                    <h2 className="mt-4 font-display text-xl font-semibold group-hover:text-burgundy">
                      {cat.name}
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      {count} lot{count === 1 ? "" : "s"} available
                    </p>

                    {cat.products.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-1.5">
                        {cat.products.map((p) => (
                          <div
                            key={p.id}
                            className="aspect-square overflow-hidden rounded-sm"
                          >
                            {p.images[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={p.images[0].url}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div
                                className="h-full w-full"
                                style={{
                                  background: `radial-gradient(120% 100% at 30% 15%, ${p.plateTo}, ${p.plateFrom} 70%)`,
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-gold-dk transition-opacity opacity-60 group-hover:opacity-100">
                      Explore →
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}