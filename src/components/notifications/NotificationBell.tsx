"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { fetchMyNotifications, markAllReadAction } from "@/app/actions/notifications";

interface NotifItem {
  id: string;
  type: string;
  title: string;
  body: string;
  linkUrl: string | null;
  read: boolean;
  createdAt: number;
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<NotifItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    try {
      const res = await fetchMyNotifications();
      setItems(res.items);
      setUnread(res.unread);
      setLoaded(true);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    setMounted(true);
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  const toggle = () => {
    setOpen((v) => !v);
    if (!open) load();
  };

  const markAll = async () => {
    await markAllReadAction();
    setUnread(0);
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[rgba(255,255,255,0.08)]"
      >
        <Bell
          className="h-[18px] w-[18px]"
          style={{ color: "rgba(255,255,255,0.85)" }}
          strokeWidth={1.9}
        />
        {mounted && unread > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold"
            style={{ backgroundColor: "#a8323c", color: "#ffffff" }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-[calc(100%+10px)] z-50 w-80 overflow-hidden rounded-md bg-[#fffdf9] shadow-xl"
            style={{ border: "1px solid #e5dccd" }}
          >
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid #e5dccd" }}
            >
              <p className="font-display text-base font-semibold text-[#15110e]">Notifications</p>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={markAll}
                  className="text-[11px] font-semibold text-[#9c7c3c] hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {!loaded ? (
                <p className="px-4 py-8 text-center text-xs text-[#7d7266]">Loading…</p>
              ) : items.length === 0 ? (
                <p className="px-4 py-8 text-center text-xs text-[#7d7266]">No notifications yet.</p>
              ) : (
                items.map((n) => {
                  const Comp: React.ElementType = n.linkUrl ? Link : "div";
                  const props = n.linkUrl ? { href: n.linkUrl } : {};
                  return (
                    <Comp
                      key={n.id}
                      {...props}
                      onClick={() => setOpen(false)}
                      className="flex gap-3 px-4 py-3 text-left transition-colors hover:bg-[#f7f3ec]"
                      style={{
                        borderBottom: "1px solid #e5dccd",
                        backgroundColor: !n.read ? "rgba(200,164,92,0.06)" : "transparent",
                      }}
                    >
                      <span
                        className="mt-1.5 inline-block h-2 w-2 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: n.read ? "transparent" : "#c8a45c" }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-[#15110e]">{n.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-[12px] text-[#7d7266]">{n.body}</p>
                        <p className="mt-1 text-[10.5px] text-[#a1968a]">{timeAgo(n.createdAt)}</p>
                      </div>
                    </Comp>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}