"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StarRating } from "./StarRating";
import { createReviewAction, type ReviewState } from "@/app/actions/reviews";

const initial: ReviewState = {};

export function ReviewForm({
  orderId,
  sellerId,
  sellerName,
}: {
  orderId: string;
  sellerId: string;
  sellerName: string;
}) {
  const [state, action, pending] = useActionState(createReviewAction, initial);
  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);

  if (state.success) {
    return (
      <div className="rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-[13px] text-success">
        Thank you — your review has been submitted.
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-sm border border-line-2 bg-paper px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-gold hover:bg-gold/5"
      >
        <span className="inline-flex items-center gap-0.5" aria-hidden>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} className="h-3 w-3 text-line-2" />
          ))}
        </span>
        Leave a review
      </button>
    );
  }

  return (
    <form action={action} className="rounded-md border border-line bg-paper p-4">
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="sellerId" value={sellerId} />
      <input type="hidden" name="rating" value={rating} />

      {state.error && (
        <div className="mb-3 rounded-sm border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-[12.5px] text-danger">
          {state.error}
        </div>
      )}

      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.13em] text-muted">
        Rate your experience with {sellerName}
      </p>
      <div className="mb-3">
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <label
        htmlFor={`body-${orderId}`}
        className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.13em] text-muted"
      >
        Your review (optional)
      </label>
      <textarea
        id={`body-${orderId}`}
        name="body"
        rows={3}
        maxLength={2000}
        placeholder="How was the condition, packaging, communication?"
        className="mb-3 w-full rounded-sm border border-line-2 bg-paper px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
      />

      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" variant="gold" size="sm" disabled={pending || rating === 0}>
          {pending ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}