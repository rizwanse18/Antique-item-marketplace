"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteListingAction } from "@/app/actions/seller";

export function DeleteListingButton({ productId }: { productId: string }) {
  const [pending, start] = useTransition();
  const onClick = () => {
    if (!confirm("Delete this listing?")) return;
    start(async () => { await deleteListingAction(productId); });
  };
  return (
    <button type="button" onClick={onClick} disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-sm border border-danger/30 bg-danger/5 px-3 py-1.5 text-[11px] font-semibold text-danger transition-colors hover:bg-danger/10 disabled:opacity-60">
      <Trash2 className="h-3 w-3" />
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}