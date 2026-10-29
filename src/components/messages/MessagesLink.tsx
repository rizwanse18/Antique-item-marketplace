"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchUnreadCountAction } from "@/app/actions/messages";

export function MessagesLink() {
  const [unread, setUnread] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      try {
        const n = await fetchUnreadCountAction();
        setUnread(n);
      } catch {
        /* ignore */
      }
    };
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  const showBadge = mounted && unread > 0;

  return (
    <Link
      href="/messages"
      aria-label="Messages"
      className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[rgba(255,255,255,0.08)]"
    >
      <MessageSquare
        className="h-[18px] w-[18px]"
        style={{ color: "rgba(255,255,255,0.85)" }}
        strokeWidth={1.9}
      />
      {showBadge && (
        <span
          className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold"
          style={{ backgroundColor: "#c8a45c", color: "#15110e" }}
        >
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}