"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Heart,
  Menu,
  X,
  LogOut,
  LayoutGrid,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { HeaderSearch } from "./HeaderSearch";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { MessagesLink } from "@/components/messages/MessagesLink";
import { CartIcon } from "@/components/cart/CartIcon";
import { signOutAction } from "@/app/actions/auth";
import type { CurrentUser } from "@/lib/current-user";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/auctions", label: "Live Auctions" },
  { href: "/categories", label: "Categories" },
  { href: "/sellers", label: "Sellers" },
  { href: "/how-it-works", label: "How It Works" },
];

const ICON_COLOR = "rgba(255, 255, 255, 0.85)";
const LINK_ACTIVE = "#e3cb94";
const LINK_MUTED = "rgba(255, 255, 255, 0.82)";

export function HeaderClient({ user }: { user: CurrentUser | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(200,164,92,0.25)] bg-[#15110e]">
      <Container className="flex h-[74px] items-center gap-5">
        <Link href="/" className="shrink-0" aria-label="ANTIQUA home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-sm px-3 py-2 text-[13px] font-medium tracking-wide transition-colors"
                style={{ color: active ? LINK_ACTIVE : LINK_MUTED }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = active ? LINK_ACTIVE : LINK_MUTED;
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ─── NEW SEARCH ─── */}
        <HeaderSearch />

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link
            href="/sell"
            className="hidden rounded-full bg-gradient-to-br from-[#e3cb94] to-[#c8a45c] px-5 py-2.5 text-[13px] font-semibold text-[#15110e] transition-all hover:brightness-110 lg:inline-flex"
          >
            Sell an Item
          </Link>

          <Link
            href="/favorites"
            aria-label="Favorites"
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[rgba(255,255,255,0.08)]"
          >
            <Heart
              className="h-[18px] w-[18px]"
              style={{ color: ICON_COLOR }}
              strokeWidth={1.9}
            />
          </Link>

          {user && <MessagesLink />}
          {user && <NotificationBell />}
          <CartIcon />

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Account menu"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#e3cb94] to-[#c8a45c] text-[13px] font-bold text-[#15110e] transition-transform hover:scale-105"
              >
                {user.initials}
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div
                    className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-md bg-[#fffdf9] shadow-xl"
                    style={{ border: "1px solid #e5dccd" }}
                  >
                    <div
                      className="px-4 py-3.5"
                      style={{ borderBottom: "1px solid #e5dccd" }}
                    >
                      <p className="font-display text-base font-semibold text-[#15110e]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-[#7d7266]">
                        {user.email}
                      </p>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#9c7c3c] hover:bg-[#f7f3ec]"
                      >
                        <LayoutGrid className="h-4 w-4" />
                        Admin Console
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#15110e] hover:bg-[#f7f3ec]"
                    >
                      <LayoutGrid className="h-4 w-4 text-[#7d7266]" />
                      Dashboard
                    </Link>
                    <Link
                      href="/messages"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#15110e] hover:bg-[#f7f3ec]"
                    >
                      <MessageSquare className="h-4 w-4 text-[#7d7266]" />
                      Messages
                    </Link>
                    <Link
                      href="/dashboard/orders"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#15110e] hover:bg-[#f7f3ec]"
                    >
                      <ShoppingBag className="h-4 w-4 text-[#7d7266]" />
                      My Orders
                    </Link>
                    <Link
                      href="/favorites"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#15110e] hover:bg-[#f7f3ec]"
                    >
                      <Heart className="h-4 w-4 text-[#7d7266]" />
                      Watchlist
                    </Link>
                    <div style={{ borderTop: "1px solid #e5dccd" }}>
                      <form action={signOutAction}>
                        <button
                          type="submit"
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#a8323c] hover:bg-[#f7f3ec]"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </form>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="ml-1 hidden rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors sm:inline-flex"
              style={{ border: "1px solid #c8a45c", color: "#e3cb94" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#c8a45c";
                e.currentTarget.style.color = "#15110e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#e3cb94";
              }}
            >
              Sign In
            </Link>
          )}

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[rgba(255,255,255,0.08)] lg:hidden"
          >
            {open ? (
              <X className="h-5 w-5" style={{ color: ICON_COLOR }} />
            ) : (
              <Menu className="h-5 w-5" style={{ color: ICON_COLOR }} />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile drawer */}
      {open && (
        <div
          className="lg:hidden"
          style={{
            borderTop: "1px solid rgba(200,164,92,0.2)",
            backgroundColor: "#15110e",
          }}
        >
          <Container className="py-4">
            <HeaderSearch variant="mobile" />

            <nav className="flex flex-col">
              {NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="py-3.5 font-display text-lg"
                    style={{
                      color: active ? LINK_ACTIVE : "#ffffff",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {user && (
                <Link
                  href="/messages"
                  className="py-3.5 font-display text-lg"
                  style={{
                    color: "#ffffff",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  Messages
                </Link>
              )}
              <Link
                href="/sell"
                className="py-3.5 font-display text-lg"
                style={{ color: "#e3cb94" }}
              >
                Sell an Item
              </Link>
              {!user && (
                <Link
                  href="/sign-in"
                  className="mt-4 inline-flex justify-center rounded-full px-5 py-3 text-sm font-semibold"
                  style={{ border: "1px solid #c8a45c", color: "#e3cb94" }}
                >
                  Sign In
                </Link>
              )}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}