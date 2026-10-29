"use client";

import { useTransition } from "react";
import { BadgeCheck } from "lucide-react";
import { adminToggleVerify } from "@/app/actions/admin";

export function SellerRowActions({
  sellerId,
  verified,
}: {
  sellerId: string;
  verified: boolean;
}) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      onClick={() => start(() => { adminToggleVerify(sellerId); })}
      disabled={pending}
      className="inline-flex items-center gap-1 rounded-sm border px-2.5 py-1 text-[11px] font-semibold transition-colors disabled:opacity-60"
      style={{
        borderColor: verified ? "rgba(200,164,92,0.4)" : "#d3c7b3",
        backgroundColor: verified ? "rgba(200,164,92,0.1)" : "#fffdf9",
        color: verified ? "#9c7c3c" : "#7d7266",
      }}
    >
      <BadgeCheck className="h-3 w-3" />
      {pending ? "..." : verified ? "Verified" : "Verify"}
    </button>
  );
}