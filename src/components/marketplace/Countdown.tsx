"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function format(ms: number) {
  if (ms <= 0) return "ENDED";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  if (d > 0) return `${d}d ${p(h)}h ${p(m)}m`;
  if (h > 0) return `${p(h)}:${p(m)}:${p(sec)}`;
  return `${p(m)}:${p(sec)}`;
}

export function Countdown({
  endsAt,
  className,
}: {
  endsAt: string;
  className?: string;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(endsAt).getTime();

  if (now === null) {
    return <span className={cn("tabular-nums", className)}>—</span>;
  }

  const ms = target - now;
  const ended = ms <= 0;
  const urgent = !ended && ms < 3600 * 1000;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 tabular-nums text-[12.5px] font-bold",
        ended && "text-muted",
        urgent && !ended && "text-danger animate-pulse",
        !ended && !urgent && "text-burgundy",
        className
      )}
    >
      {!ended && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          className="h-3 w-3"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      )}
      {format(ms)}
    </span>
  );
}