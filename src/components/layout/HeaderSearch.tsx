"use client";

import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Minimal header search.
 * Native GET form — no JavaScript handles the submit.
 * Clicking the button or pressing Enter navigates to /discover?q=...
 */
export function HeaderSearch({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const pathname = usePathname();
  const [q, setQ] = useState("");

  // Pre-fill input when landing on /discover?q=...
  useEffect(() => {
    if (pathname === "/discover" && typeof window !== "undefined") {
      setQ(new URLSearchParams(window.location.search).get("q") ?? "");
    }
  }, [pathname]);

  const isMobile = variant === "mobile";

  return (
    <form
      action="/discover"
      method="GET"
      role="search"
      className={
        isMobile
          ? "relative mb-4 w-full"
          : "relative ml-auto hidden w-full max-w-[220px] md:block lg:max-w-[300px] xl:max-w-[380px]"
      }
    >
      <input
        type="text"
        name="q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search antiques, makers, periods…"
        aria-label="Search the catalogue"
        autoComplete="off"
        spellCheck={false}
        className="w-full rounded-full py-2.5 pl-4 pr-11 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[rgba(200,164,92,0.5)]"
        style={{
          backgroundColor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.16)",
        }}
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full transition-colors hover:bg-[rgba(200,164,92,0.22)]"
      >
        <Search
          className="h-4 w-4"
          style={{ color: "#c8a45c" }}
          strokeWidth={2.2}
        />
      </button>
    </form>
  );
}