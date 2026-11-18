"use client";
import Link from "next/link";
import { useState } from "react";
import { CreditCard, Landmark, Smartphone, ShieldCheck, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { formatMoney } from "@/lib/mock-data";

export default function CheckoutClient() {
  const [method, setMethod] = useState<"card" | "jazzcash" | "easypaisa" | "bank">("card");
  const total = 4250; // Example cart total

  return (
    <div className="min-h-screen bg-cream py-12">
      <Container className="max-w-4xl">
        <h1 className="font-display text-3xl font-semibold text-ink mb-8">Secure Checkout</h1>
        
        <div className="grid md:grid-cols-[1fr_380px] gap-8">
          {/* Payment Methods Form */}
          <div className="space-y-6">
            <div className="rounded-xl border border-line bg-paper p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-ink mb-4">Select Payment Method</h2>
              
              <div className="space-y-3">
                {/* Credit Card */}
                <label className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${method === "card" ? "border-gold bg-gold/5" : "border-line hover:bg-cream"}`}>
                  <input type="radio" name="pay" checked={method === "card"} onChange={() => setMethod("card")} className="accent-gold" />
                  <CreditCard className="h-5 w-5 text-muted" />
                  <span className="font-medium text-ink flex-1">Credit / Debit Card</span>
                  <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-1 rounded">Stripe</span>
                </label>
                
                {method === "card" && (
                  <div className="pl-10 pr-4 pb-4 space-y-3">
                    <input type="text" placeholder="Card Number (0000 0000 0000 0000)" className="w-full rounded-md border border-line px-3 py-2 text-sm focus:border-gold focus:outline-none" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="MM / YY" className="w-full rounded-md border border-line px-3 py-2 text-sm focus:border-gold focus:outline-none" />
                      <input type="text" placeholder="CVC" className="w-full rounded-md border border-line px-3 py-2 text-sm focus:border-gold focus:outline-none" />
                    </div>
                  </div>
                )}

                {/* JazzCash */}
                <label className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${method === "jazzcash" ? "border-gold bg-gold/5" : "border-line hover:bg-cream"}`}>
                  <input type="radio" name="pay" checked={method === "jazzcash"} onChange={() => setMethod("jazzcash")} className="accent-gold" />
                  <Smartphone className="h-5 w-5 text-muted" />
                  <span className="font-medium text-ink flex-1">JazzCash (Pakistan)</span>
                </label>

                {/* Easypaisa */}
                <label className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${method === "easypaisa" ? "border-gold bg-gold/5" : "border-line hover:bg-cream"}`}>
                  <input type="radio" name="pay" checked={method === "easypaisa"} onChange={() => setMethod("easypaisa")} className="accent-gold" />
                  <Smartphone className="h-5 w-5 text-muted" />
                  <span className="font-medium text-ink flex-1">Easypaisa (Pakistan)</span>
                </label>

                {/* Bank Transfer */}
                <label className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${method === "bank" ? "border-gold bg-gold/5" : "border-line hover:bg-cream"}`}>
                  <input type="radio" name="pay" checked={method === "bank"} onChange={() => setMethod("bank")} className="accent-gold" />
                  <Landmark className="h-5 w-5 text-muted" />
                  <span className="font-medium text-ink flex-1">Bank Wire Transfer</span>
                </label>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-gold py-4 font-semibold text-ink transition-transform hover:scale-[1.01]">
              <ShieldCheck className="h-5 w-5" /> Pay {formatMoney(total)} Securely
            </button>
          </div>

          {/* Order Summary Sidebar */}
          <div className="rounded-xl border border-line bg-[#f7f3ec] p-6 h-fit">
            <h2 className="text-lg font-semibold text-ink mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm border-b border-line pb-4 mb-4">
              <div className="flex justify-between text-muted"><span>Subtotal</span><span>{formatMoney(total)}</span></div>
              <div className="flex justify-between text-muted"><span>Insured Shipping</span><span className="text-success font-medium">Calculated</span></div>
              <div className="flex justify-between text-muted"><span>Buyer Protection</span><span className="text-success font-medium">Included</span></div>
            </div>
            <div className="flex justify-between font-display text-xl font-bold text-ink mb-6">
              <span>Total</span><span>{formatMoney(total)}</span>
            </div>
            <Link href="/dashboard/orders" className="flex items-center justify-center gap-1 w-full text-sm font-semibold text-gold-dk hover:underline">
              View past orders <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}