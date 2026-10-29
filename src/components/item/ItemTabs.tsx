"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatMoney, timeAgo } from "@/lib/mock-data";
import type { Item } from "@/types";

const TABS = ["Description", "Details", "Condition", "Provenance", "Bids"] as const;
type Tab = (typeof TABS)[number];

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <tr className="border-b border-line">
      <td className="w-2/5 py-3 pr-4 text-[11px] font-semibold uppercase tracking-widest text-muted-2">
        {label}
      </td>
      <td className="py-3 text-sm text-ink">{value}</td>
    </tr>
  );
}

export function ItemTabs({ item }: { item: Item }) {
  const [tab, setTab] = useState<Tab>("Description");

  return (
    <div>
      <div className="flex overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "-mb-px whitespace-nowrap border-b-2 px-5 py-3 text-[13px] font-semibold transition-colors",
              tab === t
                ? "border-gold text-ink"
                : "border-transparent text-muted hover:text-ink"
            )}
          >
            {t}
            {t === "Bids" && (
              <span className="ml-1.5 text-[11px] text-muted-2">
                ({item.bidsCount})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="pt-6">
        {tab === "Description" && (
          <div className="space-y-5">
            <p className="leading-relaxed text-ink/85">{item.description}</p>
            {item.historicalBackground && (
              <div>
                <h4 className="mb-2 font-display text-lg font-semibold">
                  Historical background
                </h4>
                <p className="leading-relaxed text-ink/75">
                  {item.historicalBackground}
                </p>
              </div>
            )}
          </div>
        )}

        {tab === "Details" && (
          <table className="w-full border-collapse">
            <tbody>
              <Row label="Category" value={item.category} />
              <Row label="Period" value={item.era} />
              <Row label="Origin" value={item.origin} />
              <Row label="Materials" value={item.material} />
              <Row label="Dimensions" value={item.dims} />
              <Row label="Weight" value={item.weight} />
              <Row label="Maker / Artist" value={item.maker} />
              <Row label="Authenticity" value={item.authenticity} />
              <Row label="Certificate" value={item.certificate} />
              <Row label="Shipping from" value={item.shippingFrom} />
              <Row label="Shipping to" value={item.shippingTo} />
              <Row label="Shipping cost" value={item.shippingCost} />
              <Row label="Return policy" value={item.returnPolicy} />
            </tbody>
          </table>
        )}

        {tab === "Condition" && (
          <div>
            <p className="leading-relaxed text-ink/85">
              {item.conditionReport ?? "No condition report provided."}
            </p>
            <div className="mt-5 rounded-sm border border-line-2 bg-cream px-4 py-3 text-xs text-muted">
              Condition reports are prepared by the consignor and reviewed by our
              specialists. They describe the piece as accurately as possible but are
              not a substitute for personal inspection.
            </div>
          </div>
        )}

        {tab === "Provenance" && (
          <div>
            <p className="leading-relaxed text-ink/85">
              {item.provenance ?? "Provenance information not provided."}
            </p>
            <div className="mt-5 flex items-start gap-2.5 rounded-sm border border-gold/30 bg-gold/10 px-4 py-3 text-xs text-gold-dk">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="mt-0.5 h-4 w-4 flex-shrink-0"
              >
                <path d="M12 3l8 4v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />
              </svg>
              <span>
                Provenance is provided by the consignor. Our specialists verify
                documentation where possible but final due diligence is the buyer's
                responsibility.
              </span>
            </div>
          </div>
        )}

        {tab === "Bids" && (
          <div>
            {item.bidHistory && item.bidHistory.length > 0 ? (
              <div className="divide-y divide-line">
                {item.bidHistory.map((b, i) => (
                  <div
                    key={`${b.user}-${b.ts}`}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-3 text-[11px] font-bold text-white">
                      {b.user
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {b.user}
                        {i === 0 && (
                          <span className="ml-1.5 text-[11px] font-medium text-success">
                            leading
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-muted-2">{timeAgo(b.ts)}</p>
                    </div>
                    <p
                      className={cn(
                        "ml-auto font-display text-lg font-bold tabular-nums",
                        i === 0 ? "text-success" : "text-ink"
                      )}
                    >
                      {formatMoney(b.amount)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-muted">
                No bids yet. Be the first.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}