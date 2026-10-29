"use client";

import { useTransition } from "react";
import { Ban, CheckCircle2 } from "lucide-react";
import { adminToggleSuspend, adminChangeRole } from "@/app/actions/admin";

export function UserRowActions({
  userId,
  role,
  suspended,
}: {
  userId: string;
  role: string;
  suspended: boolean;
}) {
  const [pending, start] = useTransition();

  const onRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as "buyer" | "seller" | "admin";
    start(() => { adminChangeRole(userId, newRole); });
  };

  const onToggleSuspend = () => {
    if (!confirm(suspended ? "Unsuspend this user?" : "Suspend this user?")) return;
    start(() => { adminToggleSuspend(userId); });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        onChange={onRoleChange}
        disabled={pending}
        className="rounded-sm border border-line-2 bg-paper px-2 py-1 text-[11px] font-semibold disabled:opacity-60"
      >
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
        <option value="admin">Admin</option>
      </select>
      <button
        type="button"
        onClick={onToggleSuspend}
        disabled={pending}
        title={suspended ? "Unsuspend" : "Suspend"}
        className="rounded-sm border px-2 py-1 text-[11px] font-semibold transition-colors disabled:opacity-60"
        style={{
          borderColor: suspended ? "rgba(47,107,79,0.3)" : "rgba(168,50,60,0.3)",
          backgroundColor: suspended ? "rgba(47,107,79,0.08)" : "rgba(168,50,60,0.05)",
          color: suspended ? "#2f6b4f" : "#a8323c",
        }}
      >
        {suspended ? <CheckCircle2 className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
      </button>
    </div>
  );
}