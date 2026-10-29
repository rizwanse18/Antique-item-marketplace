"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartContext";
import { fetchCartProducts } from "@/app/actions/cart";

interface CartProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  imageUrl: string | null;
  plateFrom: string;
  plateTo: string;
  category: string;
  sellerName: string;
  available: boolean;
  reason: string | null;
}

function fmt(n: number) { return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); }

export default function CartPage() {
  const { items, remove, clear } = useCart();
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchCartProducts(items).then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, [items]);

  const availableItems = products.filter((p) => p.available);
  const unavailableItems = products.filter((p) => !p.available);
  const subtotal = availableItems.reduce((s, p) => s + p.price, 0);

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-11">
        <Container>
          <p className="eyebrow">Shopping Cart</p>
          <h1 className="mt-2.5 text-4xl md:text-5xl">Your Cart</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Bundled lots in a single order. Auction-only lots must go through bidding instead.
          </p>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          {loading ? (
            <p className="text-center text-sm text-muted">Loading cart…</p>
          ) : products.length === 0 ? (
            <div className="mx-auto max-w-md rounded-md border border-dashed border-line-2 bg-paper/60 px-6 py-16 text-center">
              <ShoppingBag className="mx-auto h-10 w-10 text-line-2" />
              <p className="mt-5 font-display text-2xl">Your cart is empty</p>
              <p className="mt-2 text-sm text-muted">
                Add buy-now lots from the catalogue to purchase several at once.
              </p>
              <div className="mt-6">
                <Link href="/discover"><Button variant="gold">Browse lots</Button></Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-3">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className={
                      "flex items-start gap-4 rounded-md border bg-paper p-4 " +
                      (p.available ? "border-line" : "border-danger/30 bg-danger/5")
                    }
                  >
                    <Link href={`/discover/${p.slug}`} className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm">
                      {p.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{ background: `radial-gradient(120% 100% at 30% 15%, ${p.plateTo}, ${p.plateFrom} 70%)` }}
                        />
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gold-dk">
                        {p.category}
                      </p>
                      <Link href={`/discover/${p.slug}`} className="line-clamp-2 font-display text-lg font-semibold text-ink hover:text-burgundy">
                        {p.title}
                      </Link>
                      <p className="mt-1 text-xs text-muted">Sold by {p.sellerName}</p>
                      {!p.available && (
                        <p className="mt-1 text-xs font-semibold text-danger">{p.reason}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-display text-lg font-bold">{fmt(p.price)}</p>
                      <button
                        type="button"
                        onClick={() => remove(p.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted hover:text-danger"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>
                ))}

                {unavailableItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      unavailableItems.forEach((u) => remove(u.id));
                    }}
                    className="text-xs font-semibold text-danger hover:underline"
                  >
                    Remove {unavailableItems.length} unavailable item{unavailableItems.length === 1 ? "" : "s"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={clear}
                  className="ml-4 text-xs font-semibold text-muted hover:text-ink"
                >
                  Clear cart
                </button>
              </div>

              <aside>
                <div className="sticky top-24 rounded-md border border-line bg-paper p-5">
                  <h2 className="font-display text-xl">Order summary</h2>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Subtotal ({availableItems.length} item{availableItems.length === 1 ? "" : "s"})</span>
                      <span className="font-semibold">{fmt(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Shipping (per item, next step)</span>
                      <span className="text-muted-2">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-line pt-4">
                    {availableItems.length > 0 ? (
                      <Link href="/checkout">
                        <Button variant="gold" size="lg" className="w-full">
                          Proceed to Checkout <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <p className="text-center text-xs text-danger">
                        No purchasable items in your cart.
                      </p>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}