"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { submitContactAction, type ContactState } from "@/app/actions/contact";

const initial: ContactState = {};
const inputCls =
  "w-full rounded-sm border border-line-2 bg-paper px-3.5 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20";

export function ContactForm({ defaultName, defaultEmail }: { defaultName?: string; defaultEmail?: string }) {
  const [state, action, pending] = useActionState(submitContactAction, initial);

  if (state.success) {
    return (
      <div className="rounded-md border border-success/30 bg-success/10 px-4 py-4 text-sm text-success">
        Thank you — your message has been received. We aim to reply within 2 business days.
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <div className="rounded-sm border border-danger/30 bg-danger/10 px-3.5 py-3 text-[13px] text-danger">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.13em] text-muted">
            Your name *
          </label>
          <input id="name" name="name" required defaultValue={defaultName} className={inputCls} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.13em] text-muted">
            Email *
          </label>
          <input id="email" name="email" type="email" required defaultValue={defaultEmail} className={inputCls} />
        </div>
      </div>

      <div>
        <label htmlFor="topic" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.13em] text-muted">
          Topic *
        </label>
        <select id="topic" name="topic" required className={inputCls}>
          <option value="">Select a topic</option>
          <option>General question</option>
          <option>Order problem</option>
          <option>Auction dispute</option>
          <option>Report a listing</option>
          <option>Report a user</option>
          <option>Seller verification</option>
          <option>Privacy / data request</option>
          <option>Press / media</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.13em] text-muted">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={5000}
          placeholder="Please include order IDs, listing links, or photos if relevant."
          className={inputCls + " resize-y"}
        />
      </div>

      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}