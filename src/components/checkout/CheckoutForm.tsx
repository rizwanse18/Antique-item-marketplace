"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { createOrderAction, type OrderState } from "@/app/actions/orders";

const initial: OrderState = {};
const inputCls = "w-full rounded-sm border border-line-2 bg-paper px-3.5 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20";

export function CheckoutForm({
  productId,
  defaultName,
  defaultEmail,
}: {
  productId: string;
  defaultName: string;
  defaultEmail: string;
}) {
  const [state, action, pending] = useActionState(createOrderAction, initial);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="productId" value={productId} />

      {state.error && (
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
        <strong>Demo mode:</strong> payment is simulated. No card is charged. Real Stripe integration in a later phase.
      </div>

      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={pending}>
        {pending ? "Processing payment..." : "Complete Purchase"}
      </Button>
    </form>
  );
}