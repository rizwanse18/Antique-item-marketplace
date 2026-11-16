"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Bell, CheckCheck, ArrowLeft } from "lucide-react";
import {
  markAllReadAction,
  markOneReadAction,
} from "@/app/actions/notifications";

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

export function NotificationsClient({
  initialItems,
  initialUnread,
}: {
  initialItems: NotifItem[];
  initialUnread: number;
}) {
  const [items, setItems] = useState<NotifItem[]>(initialItems);
  const [unread, setUnread] = useState(initialUnread);
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [pending, startTransition] = useTransition();

  const filtered = tab === "unread" ? items.filter((i) => !i.read) : items;

  const markAll = () => {
    startTransition(async () => {
      await markAllReadAction();
      setUnread(0);
      setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    });
  };

  const markOne = async (id: string) => {
    await markOneReadAction(id);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, read: true } : i))
    );
    setUnread((n) => Math.max(0, n - 1));
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#7d7266] hover:text-[#9c7c3c]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#15110e]">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-[#7d7266]">
            {unread > 0
              ? unread + " unread notification" + (unread === 1 ? "" : "s")
              : "You are all caught up"}
          </p>
        </div>
        {unread > 0 && (
          <button
            type="button"
            onClick={markAll}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#e3cb94] to-[#c8a45c] px-4 py-2 text-xs font-semibold text-[#15110e] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <div className="mb-4 flex gap-1 rounded-full bg-[#efe9dd] p-1 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setTab("all")}
          className={
            "flex-1 rounded-full px-4 py-1.5 transition-colors " +
            (tab === "all"
              ? "bg-[#fffdf9] text-[#15110e] shadow-sm"
              : "text-[#7d7266] hover:text-[#15110e]")
          }
        >
          All ({items.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("unread")}
          className={
            "flex-1 rounded-full px-4 py-1.5 transition-colors " +
            (tab === "unread"
              ? "bg-[#fffdf9] text-[#15110e] shadow-sm"
              : "text-[#7d7266] hover:text-[#15110e]")
          }
        >
          Unread ({unread})
        </button>
      </div>

      <div
        className="overflow-hidden rounded-lg bg-[#fffdf9]"
        style={{ border: "1px solid #e5dccd" }}
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Bell className="h-10 w-10 text-[#c8a45c] opacity-40" />
            <p className="mt-3 font-display text-lg text-[#15110e]">
              {tab === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </p>
            <p className="mt-1 max-w-sm text-sm text-[#7d7266]">
              When you bid, get outbid or win an auction, it will appear here.
            </p>
          </div>
        ) : (
          filtered.map((n) => {
            const body = (
              <div className="flex gap-3">
                <span
                  className="mt-1.5 inline-block h-2 w-2 flex-shrink-0 rounded-full"
                  style={{
                    backgroundColor: n.read ? "transparent" : "#c8a45c",
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#15110e]">
                    {n.title}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#7d7266]">{n.body}</p>
                  <p className="mt-1 text-[11px] text-[#a1968a]">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
                {!n.read && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      markOne(n.id);
                    }}
                    className="self-start whitespace-nowrap text-[11px] font-semibold text-[#9c7c3c] hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </div>
            );

            const cls =
              "block px-4 py-3 transition-colors hover:bg-[#f7f3ec]";
            const sty = {
              borderBottom: "1px solid #e5dccd",
              backgroundColor: !n.read
                ? "rgba(200,164,92,0.06)"
                : "transparent",
            };

            if (n.linkUrl) {
              return (
                <Link
                  key={n.id}
                  href={n.linkUrl}
                  onClick={() => {
                    if (!n.read) markOne(n.id);
                  }}
                  className={cls}
                  style={sty}
                >
                  {body}
                </Link>
              );
            }
            return (
              <div key={n.id} className={cls} style={sty}>
                {body}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}