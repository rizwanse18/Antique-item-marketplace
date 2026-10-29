"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCart } from "./CartContext";
import { fetchCartProducts, createMultiOrderAction, type MultiOrderState, type CartProduct } from "@/app/actions/cart";

const initial: MultiOrderState = {};
const inputCls = "w-full rounded-sm border border-line-2 bg-paper px-3.5 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20";

function fmt(n: number) { return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); }

export function MultiCheckoutForm({
  defaultName,
  defaultEmail,
}: {
  defaultName: string;
  defaultEmail: string;
}) {
  const { items, clear } = useCart();
  const [state, action, pending] = useActionState(createMultiOrderAction, initial);
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

  const available = products.filter((p) => p.available);
  const subtotal = available.reduce((s, p) => s + p.price, 0);
  const shipping = available.reduce((s, p) => s + Math.max(50, Math.round(p.price * 0.02)), 0);
  const total = subtotal + shipping;

  // Clear cart after successful order — detect redirect by watching if products changed but items didn't reset.
  // Instead: on successful state, clear.
  useEffect(() => {
    if (state && (state as any).success) clear();
  }, [state, clear]);

  if (loading) return <p className="text-center text-sm text-muted">Loading checkout…</p>;

  if (available.length === 0) {
    return (
      <div className="rounded-md border border-danger/30 bg-danger/10 p-6">
        <p className="font-display text-2xl text-danger">Nothing to purchase</p>
        <p className="mt-2 text-sm text-ink/80">
          Your cart contains no purchasable items.
        </p>
        <div className="mt-4">
          <Link href="/cart"><Button variant="gold">Back to cart</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      <form action={action} className="space-y-4">
        <input type="hidden" name="productIds" value={JSON.stringify(available.map((p) => p.id))} />

        {state?.error && (
          <div className="rounded-sm border border-danger/30 bg-danger/10 px-3.5 py-3 text-[13px] text-danger">
            {state.error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.13em] text-muted">Full name *</label>
          <input id="name" name="name" required defaultValue={defaultName} className={inputCls} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.13em] text-muted">Email *</label>
          <input id="email" name="email" type="email" required defaultValue={defaultEmail} className={inputCls} />
        </div>
        <div>
          <label htmlFor="address" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.13em] text-muted">Street address *</label>
          <input id="address" name="address" required placeholder="123 Main Street" className={inputCls} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="city" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.13em] text-muted">City *</label>
            <input id="city" name="city" required className={inputCls} />
          </div>
          <div>
            <label htmlFor="zip" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.13em] text-muted">ZIP / Postal *</label>
            <input id="zip" name="zip" required className={inputCls} />
          </div>
          <div>
            <label htmlFor="country" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.13em] text-muted">Country *</label>
            <input id="country" name="country" required className={inputCls} />
          </div>
        </div>

        <div className="rounded-sm border border-gold/30 bg-gold/10 px-4 py-3 text-[12px] text-gold-dk">
          <strong>Demo mode:</strong> payment is simulated. No card is charged.
        </div>

        <Button type="submit" variant="gold" size="lg" className="w-full" disabled={pending}>
          {pending ? "Processing payment..." : `Complete Purchase — ${fmt(total)}`}
        </Button>
      </form>

      <aside>
        <div className="sticky top-24 rounded-md border border-line bg-paper p-5">
          <h2 className="font-display text-xl">Order summary</h2>
          <div className="mt-4 divide-y divide-line border-y border-line">
            {available.map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-3">
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-sm">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full" style={{ background: `radial-gradient(120% 100% at 30% 15%, ${p.plateTo}, ${p.plateFrom} 70%)` }} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-semibold">{p.title}</p>
                  <p className="text-[11px] text-muted">Sold by {p.sellerName}</p>
                </div>
                <p className="text-sm font-semibold">{fmt(p.price)}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="font-semibold">{fmt(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span className="font-semibold">{fmt(shipping)}</span></div>
            <div className="flex justify-between border-t border-line pt-2 text-base"><span className="font-semibold">Total</span><span className="font-display text-lg font-bold">{fmt(total)}</span></div>
          </div>
        </div>
      </aside>
    </div>
  );
}