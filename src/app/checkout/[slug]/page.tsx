import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { getCheckoutInfo } from "@/lib/orders";

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `Checkout — ${slug}` };
}

function formatMoney(n: number) { return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); }

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const info = await getCheckoutInfo(slug);
  if (!info) redirect("/sign-in?next=/checkout/" + slug);
  if (!info.product) notFound();

  const { product, canBuy, reason, price, user } = info;
  const shippingFee = canBuy ? Math.max(50, Math.round(price * 0.02)) : 0;
  const total = price + shippingFee;

  return (
    <section className="py-12">
      <Container>
        <div className="mb-8">
          <p className="eyebrow">Secure Checkout</p>
          <h1 className="mt-2.5 text-3xl md:text-4xl">Complete your purchase</h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            {canBuy ? (
              <CheckoutForm
                productId={product.id}
                defaultName={user.name}
                defaultEmail={user.email}
              />
            ) : (
              <div className="rounded-md border border-danger/30 bg-danger/10 p-6">
                <p className="font-display text-2xl text-danger">Cannot complete purchase</p>
                <p className="mt-2 text-sm text-ink/80">{reason}</p>
                <div className="mt-4">
                  <Link href={`/discover/${product.slug}`} className="text-sm font-semibold text-gold-dk underline">
                    Back to lot
                  </Link>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-md border border-line bg-paper p-5">
              <h2 className="font-display text-xl">Order summary</h2>
              <div className="mt-4 flex items-center gap-3 border-b border-line pb-4">
                <div
                  className="h-16 w-16 flex-shrink-0 rounded-sm"
                  style={{ background: `radial-gradient(120% 100% at 30% 15%, ${product.plateTo}, ${product.plateFrom} 70%)` }}
                />
                <div className="min-w-0">
                  <Link href={`/discover/${product.slug}`} className="line-clamp-2 font-display text-base font-semibold text-ink hover:text-burgundy">
                    {product.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted">{product.category.name}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted">Item price</span><span className="font-semibold">{formatMoney(price)}</span></div>
                <div className="flex justify-between"><span className="text-muted">Shipping (2%)</span><span className="font-semibold">{formatMoney(shippingFee)}</span></div>
                <div className="flex justify-between border-t border-line pt-2 text-base"><span className="font-semibold">Total</span><span className="font-display text-lg font-bold">{formatMoney(total)}</span></div>
              </div>
            </div>

            <div className="rounded-md border border-line bg-paper p-4 text-xs text-muted">
              <p className="font-semibold text-ink">Buyer protection</p>
              <p className="mt-1">{product.returnPolicy || "14-day returns on misdescription."}</p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}