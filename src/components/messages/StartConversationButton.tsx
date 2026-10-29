"use client";

import { useTransition } from "react";
import { MessageSquare } from "lucide-react";
import { startConversationAction } from "@/app/actions/messages";

export function StartConversationButton({
  sellerId,
  productId,
  isSelf,
}: {
  sellerId: string;
  productId: string;
  isSelf: boolean;
}) {
  const [pending, start] = useTransition();

  if (isSelf) return null;

  const onClick = () => {
    start(async () => {
      await startConversationAction(sellerId, productId);
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-sm border border-line-2 bg-paper px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-ink disabled:opacity-60"
    >
      <MessageSquare className="h-3.5 w-3.5" />
      {pending ? "Opening..." : "Contact Seller"}
    </button>
  );
}