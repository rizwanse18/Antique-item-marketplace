"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Share2, ShieldCheck, Truck, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FavoriteButton } from "@/components/marketplace/FavoriteButton";
import { StartConversationButton } from "@/components/messages/StartConversationButton";
import { placeBidAction, getAuctionStatus } from "@/app/actions/bids";
import type { Item } from "@/types";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

function formatMoney(n: number) { return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); }
function minIncrement(bid: number) { return Math.max(10, Math.round(bid * 0.05)); }
function fmtCountdown(ms: number) {
  if (ms <= 0) return "ENDED";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400), h = Math.floor((s%86400)/3600), m = Math.floor((s%3600)/60), sec = s%60;
  const p = (n: number) => String(n).padStart(2,"0");
  if (d > 0) return `${d}d ${p(h)}h ${p(m)}m`;
  if (h > 0) return `${p(h)}:${p(m)}:${p(sec)}`;
  return `${p(m)}:${p(sec)}`;
}

export function BidPanel({ item, isFavorited = false, currentUserId = null }: { item: Item; isFavorited?: boolean; currentUserId?: string | null }) {
  const isBuyNow = item.saleType === "buynow";
  const [currentBid, setCurrentBid] = useState(item.currentBid);
  const [bidsCount, setBidsCount] = useState(item.bidsCount);
  const [endsAt, setEndsAt] = useState(item.endsAt);
  const [leadingUserId, setLeadingUserId] = useState<string | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [notice, setNotice] = useState<{ kind: "ok"|"err"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const hasBids = bidsCount > 0;
  const basePrice = hasBids ? currentBid : item.startingBid;
  const increment = minIncrement(basePrice);
  const minNext = basePrice + increment;
  const isLeading = leadingUserId !== null && leadingUserId === currentUserId;
  const isSeller = currentUserId === item.sellerId;

  useEffect(() => { if (amount === 0 && !isBuyNow) setAmount(minNext); }, [minNext, amount, isBuyNow]);
  useEffect(() => { setNow(Date.now()); const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  useEffect(() => {
    if (isBuyNow) return;
    let cancelled = false;
    const tick = async () => {
      const s = await getAuctionStatus(item.id);
      if (cancelled || !s) return;
      setCurrentBid(s.currentBid); setBidsCount(s.bidsCount); setEndsAt(s.endsAt); setLeadingUserId(s.leadingUserId);
    };
    tick();
    const id = setInterval(tick, 5000);
    return () => { cancelled = true; clearInterval(id); };
  }, [item.id, isBuyNow]);

  const msLeft = now !== null ? new Date(endsAt).getTime() - now : 0;
  const ended = now !== null && msLeft <= 0;
  const urgent = !ended && msLeft < 3_600_000;
  const isWinner = ended && isLeading;

  const placeBid = () => {
    if (!currentUserId) { window.location.href = "/sign-in?next=" + encodeURIComponent(window.location.pathname); return; }
    setNotice(null);
    startTransition(async () => {
      const res = await placeBidAction(item.id, amount);
      if (!res.ok) {
        if (res.error === "not-signed-in") { window.location.href = "/sign-in?next=" + encodeURIComponent(window.location.pathname); return; }
        setNotice({ kind: "err", text: res.error ?? "Bid failed." });
        return;
      }
      if (res.newBid) setCurrentBid(res.newBid);
      if (res.newEndsAt) setEndsAt(res.newEndsAt);
      setBidsCount((c) => c + 1);
      setAmount((res.newBid ?? 0) + minIncrement(res.newBid ?? 0));
      setNotice({ kind: "ok", text: `Bid placed at ${formatMoney(res.newBid ?? 0)}. You are now the highest bidder.` });
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-line-2 bg-gradient-to-br from-[#faf6ee] to-[#f3ece0] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-muted">
              {isBuyNow ? "Fixed price" : hasBids ? "Current bid" : "Starting bid"}
            </p>
            <p className="mt-1.5 font-display text-[44px] font-bold leading-none text-ink">
              {formatMoney(isBuyNow ? item.buyNowPrice ?? currentBid : basePrice)}
            </p>
            <p className="mt-2 text-xs text-muted">
              {isBuyNow ? "Purchase immediately - no bidding required." : hasBids ? (
                <><span className="font-semibold text-ink">{bidsCount}</span> bid{bidsCount===1?"":"s"} / <span className="font-semibold text-ink">{item.watchers}</span> watching
                  {isLeading && !ended && <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-success"><TrendingUp className="h-2.5 w-2.5" /> You lead</span>}
                </>
              ) : "Be the first to bid."}
            </p>
          </div>
          {!isBuyNow && (
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-muted">{ended ? "Closed" : "Closes in"}</p>
              <p className={"mt-2 font-display text-lg font-bold tabular-nums " + (ended ? "text-muted" : urgent ? "text-danger animate-pulse" : "text-burgundy")}>
                {now === null ? "-" : fmtCountdown(msLeft)}
              </p>
            </div>
          )}
        </div>

        {!ended && !isBuyNow && !isSeller && (
          <>
            <div className="mt-5 flex gap-2">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">$</span>
                <input type="number" min={minNext} step={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-sm border border-line-2 bg-paper py-3 pl-8 pr-3 text-base font-semibold tabular-nums focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              </div>
              <Button variant="gold" onClick={placeBid} disabled={pending} className="px-7 py-3">{pending ? "Placing..." : "Place Bid"}</Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[minNext, minNext + increment, minNext + increment * 2].map((v) => (
                <button key={v} type="button" onClick={() => setAmount(v)}
                  className="rounded-full border border-line-2 bg-paper px-3.5 py-1.5 text-xs font-semibold tabular-nums text-muted transition-colors hover:border-gold hover:text-ink">
                  {formatMoney(v)}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11.5px] text-muted-2">Minimum next bid {formatMoney(minNext)} / Increment {formatMoney(increment)}</p>
          </>
        )}

        {!ended && !isBuyNow && isSeller && (
          <div className="mt-5 rounded-sm border border-gold/30 bg-gold/10 px-3.5 py-3 text-[12.5px] text-gold-dk">This is your listing. You cannot bid on your own lot.</div>
        )}

        {isBuyNow && !ended && (
          <Link href={`/checkout/${item.slug}`} className="mt-5 block">
            <Button variant="wine" size="lg" className="w-full">Buy It Now for {formatMoney(item.buyNowPrice ?? currentBid)}</Button>
          </Link>
        )}

        {ended && isWinner && (
          <>
            <div className="mt-5 inline-flex items-center gap-2 rounded-sm border border-success/30 bg-success/10 px-3.5 py-3 text-[13px] text-success">
              <Award className="h-4 w-4" /> Congratulations - you won this auction!
            </div>
            <Link href={`/checkout/${item.slug}`} className="mt-3 block">
              <Button variant="gold" size="lg" className="w-full">Pay for won item - {formatMoney(basePrice)}</Button>
            </Link>
          </>
        )}

        {ended && !isWinner && !isSeller && (
          <div className="mt-5 rounded-sm border border-line-2 bg-paper px-3.5 py-3 text-sm text-muted">This lot has closed.</div>
        )}

        {notice && (
          <div className={"mt-4 rounded-sm px-3.5 py-3 text-[12.5px] " + (notice.kind === "ok" ? "border border-success/30 bg-success/10 text-success" : "border border-danger/30 bg-danger/10 text-danger")}>
            {notice.text}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <FavoriteButton productId={item.id} initial={isFavorited} variant="inline" />
        {!isSeller && (item.saleType === "buynow" || item.saleType === "both") && (
          <AddToCartButton productId={item.id} variant="outline" />
        )}
        <StartConversationButton sellerId={item.sellerId} productId={item.id} isSelf={isSeller} />
        <button type="button" onClick={() => { navigator.clipboard?.writeText(window.location.href); setNotice({ kind: "ok", text: "Link copied to clipboard." }); }}
          className="inline-flex items-center gap-2 rounded-sm border border-line-2 bg-paper px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-ink">
          <Share2 className="h-3.5 w-3.5" /> Share
        </button>
      </div>

      <div className="space-y-2.5 rounded-md border border-line bg-paper p-4">
        <div className="flex items-start gap-2.5 text-sm">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
          <div><p className="font-semibold text-ink">Buyer protection</p><p className="text-xs text-muted">{item.returnPolicy}</p></div>
        </div>
        <div className="flex items-start gap-2.5 text-sm">
          <Truck className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-dk" />
          <div><p className="font-semibold text-ink">Shipping</p><p className="text-xs text-muted">{item.shippingFrom} to {item.shippingTo} / {item.shippingCost}</p></div>
        </div>
      </div>
    </div>
  );
}