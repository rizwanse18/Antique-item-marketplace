"use client";

import { useTransition } from "react";
import { Star, Eye, EyeOff, Trash2 } from "lucide-react";
import {
  adminToggleFeatured,
  adminToggleHidden,
  adminDeleteProduct,
} from "@/app/actions/admin";

export function ProductRowActions({
  productId,
  featured,
  hidden,
}: {
  productId: string;
  featured: boolean;
  hidden: boolean;
}) {
  const [pending, start] = useTransition();

  const onFeature = () => start(() => { adminToggleFeatured(productId); });
  const onHide = () => start(() => { adminToggleHidden(productId); });
  const onDelete = () => {
    if (!confirm("Delete this product permanently? Uploaded images will be removed from disk.")) return;
    start(() => { adminDeleteProduct(productId); });
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onFeature}
        disabled={pending}
        title={featured ? "Unfeature" : "Feature on homepage"}
        className="rounded-sm border border-line-2 bg-paper px-2 py-1.5 text-[11px] font-semibold transition-colors hover:border-gold disabled:opacity-60"
        style={{ color: featured ? "#9c7c3c" : "#7d7266" }}
      >
        <Star className="h-3 w-3" fill={featured ? "currentColor" : "none"} />
      </button>
      <button
        type="button"
        onClick={onHide}
        disabled={pending}
        title={hidden ? "Unhide" : "Hide from public"}
        className="rounded-sm border border-line-2 bg-paper px-2 py-1.5 text-[11px] font-semibold transition-colors hover:border-ink disabled:opacity-60"
        style={{ color: hidden ? "#a8323c" : "#7d7266" }}
      >
        {hidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        title="Delete"
        className="rounded-sm border border-danger/30 bg-danger/5 px-2 py-1.5 text-[11px] font-semibold text-danger transition-colors hover:bg-danger/10 disabled:opacity-60"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}