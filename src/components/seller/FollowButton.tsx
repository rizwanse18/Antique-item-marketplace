"use client";

import { useState, useTransition } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFollowAction } from "@/app/actions/follows";

export function FollowButton({
  sellerId,
  initialFollowing,
  initialCount,
  isSelf,
}: {
  sellerId: string;
  initialFollowing: boolean;
  initialCount: number;
  isSelf: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();

  if (isSelf) return null;

  const onClick = () => {
    startTransition(async () => {
      const res = await toggleFollowAction(sellerId);
      if (!res.ok) {
        if (res.error === "not-signed-in") {
          window.location.href = "/sign-in?next=" + encodeURIComponent(window.location.pathname);
          return;
        }
        return;
      }
      setFollowing(res.following);
      setCount((c) => (res.following ? c + 1 : Math.max(0, c - 1)));
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all disabled:opacity-60",
        following
          ? "border border-line-2 bg-paper text-ink hover:border-ink"
          : "bg-gradient-to-br from-gold-lt to-gold text-ink hover:brightness-105"
      )}
    >
      {following ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
      {pending ? "..." : following ? `Following (${count})` : `Follow (${count})`}
    </button>
  );
}