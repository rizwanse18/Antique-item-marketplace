"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { becomeSellerAction, type SellerState } from "@/app/actions/seller";

const initial: SellerState = {};

export function BecomeSellerForm({ defaultName }: { defaultName: string }) {
  const [state, action, pending] = useActionState(becomeSellerAction, initial);
  return (
    <form action={action} className="space-y-4">
      {state.error && <div className="rounded-sm border border-danger/30 bg-danger/10 px-3.5 py-3 text-[13px] text-danger">{state.error}</div>}
      <div>
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.13em] text-muted">Business name</label>
        <input value={defaultName} readOnly className="w-full cursor-not-allowed rounded-sm border border-line-2 bg-cream px-3.5 py-3 text-sm text-muted" />
      </div>
      <div>
        <label htmlFor="location" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.13em] text-muted">Location *</label>
        <input id="location" name="location" required placeholder="e.g. Paris, France" className="w-full rounded-sm border border-line-2 bg-paper px-3.5 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
      </div>
      <div>
        <label htmlFor="bio" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.13em] text-muted">About your business *</label>
        <textarea id="bio" name="bio" required rows={5} placeholder="Describe your expertise (min 20 chars)." className="w-full resize-y rounded-sm border border-line-2 bg-paper px-3.5 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
      </div>
      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={pending}>
        {pending ? "Setting up..." : "Become a Seller"}
      </Button>
    </form>
  );
}