import { StarRating } from "./StarRating";
import type { ReviewView } from "@/lib/reviews";

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ReviewList({ reviews }: { reviews: ReviewView[] }) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-line-2 bg-paper/60 px-6 py-10 text-center">
        <p className="font-display text-lg">No reviews yet</p>
        <p className="mt-1 text-xs text-muted">Be the first to review after a completed purchase.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-md border border-line bg-paper p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display text-base font-semibold">{r.reviewerName}</p>
                <StarRating value={r.rating} readOnly size="sm" />
              </div>
              <p className="mt-1 text-[11px] text-muted-2">{fmtDate(r.createdAt)}</p>
            </div>
          </div>
          {r.body && (
            <p className="mt-3 text-sm leading-relaxed text-ink/85">{r.body}</p>
          )}
        </div>
      ))}
    </div>
  );
}