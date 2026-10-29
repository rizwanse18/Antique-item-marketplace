import Link from "next/link";
import {
  BadgeCheck, FileCheck2, Lock, Gavel, ShieldCheck, Handshake,
  Search, Eye, GavelIcon, PackageCheck, Upload, UserCheck, Trophy, Wallet,
  ArrowRight, Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "How It Works",
  description:
    "Buying, selling and bidding on ANTIQUA — how the platform protects buyers and helps sellers reach a global audience.",
};
export const instant = false;

const BUYER_STEPS = [
  { icon: Search, title: "Discover", body: "Browse thousands of authenticated lots across 14 departments, or use search to find a specific maker, era, or origin." },
  { icon: Eye, title: "Inspect", body: "Review high-resolution photos, provenance documentation, condition reports, and full lot details before you commit." },
  { icon: GavelIcon, title: "Bid or Buy", body: "Bid live with automatic anti-sniping, or purchase fixed-price lots instantly. Every bid is server-validated." },
  { icon: PackageCheck, title: "Receive", body: "Insured shipping, tracking, and buyer protection on every purchase through our checkout." },
];

const SELLER_STEPS = [
  { icon: Upload, title: "List", body: "Create a listing with photos, provenance, and a full condition report. Choose auction, fixed-price, or both." },
  { icon: UserCheck, title: "Verify", body: "Our specialists review your identity and documentation. Verified sellers receive a gold badge and priority placement." },
  { icon: Trophy, title: "Auction or Sell", body: "Go live to collectors in 128 countries. Anti-sniping extensions keep the sale fair and active." },
  { icon: Wallet, title: "Get Paid", body: "Funds are released securely 14 days after delivery confirmation, or 21 days after dispatch." },
];

const TRUST = [
  { icon: BadgeCheck,  title: "Verified Sellers",    body: "Every consignor is identity-checked before their first listing goes live." },
  { icon: FileCheck2,  title: "Authenticity Focus",  body: "Provenance, documentation, and expert review are central to every listing." },
  { icon: Lock,        title: "Secure Transactions", body: "Encrypted checkout, buyer protection, and a full dispute-resolution process." },
  { icon: Gavel,       title: "Server-Authoritative Bidding", body: "Anti-sniping extensions, minimum increment enforcement, and race-condition-safe bids." },
  { icon: ShieldCheck, title: "Buyer Protection",    body: "Full refund if an item materially misrepresents its description." },
  { icon: Handshake,   title: "Direct Seller Contact", body: "Message any seller for provenance, condition questions, or shipping details." },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink py-20 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_400px_at_20%_20%,rgba(110,31,43,.5),transparent_60%),radial-gradient(600px_400px_at_85%_80%,rgba(200,164,92,.2),transparent_65%)]" />
        <Container className="relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-[.24em] text-gold">
            How ANTIQUA Works
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight md:text-5xl lg:text-6xl">
            A marketplace built for{" "}
            <em className="italic font-normal text-gold-lt">serious collectors</em>.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            Buying and selling antiques is built on trust. Here is exactly how
            ANTIQUA protects both sides — from your first bid to final delivery.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/discover">
              <Button variant="gold" size="lg">Browse catalogue</Button>
            </Link>
            <Link href="/sell">
              <Button variant="outline" size="lg" className="border-white/25 bg-transparent text-white hover:border-white/60 hover:bg-white/5">
                Start selling
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* For buyers */}
      <section className="py-16">
        <Container>
          <div className="max-w-2xl">
            <p className="eyebrow">For Buyers</p>
            <h2 className="mt-2.5 text-3xl md:text-4xl">Four steps to a new treasure</h2>
            <p className="mt-3 text-sm text-muted">
              Every step is designed to help you buy with confidence — nothing hidden, nothing rushed.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {BUYER_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative rounded-md border border-line bg-paper p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold-dk">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-display text-3xl font-bold text-[#e5dccd]">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* For sellers */}
      <section className="border-y border-line bg-cream py-16">
        <Container>
          <div className="max-w-2xl">
            <p className="eyebrow">For Sellers</p>
            <h2 className="mt-2.5 text-3xl md:text-4xl">From your collection to the world</h2>
            <p className="mt-3 text-sm text-muted">
              List once, reach collectors in 128 countries. All you need is an accurate description and good photos.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {SELLER_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative rounded-md border border-line bg-paper p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-display text-3xl font-bold text-[#e5dccd]">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-md border border-gold/30 bg-gold/5 p-6">
            <div>
              <h3 className="font-display text-xl font-semibold">Ready to consign?</h3>
              <p className="mt-1 text-sm text-muted">
                One-step onboarding. No listing fees. 8% commission on final sale price.
              </p>
            </div>
            <Link href="/seller/onboarding">
              <Button variant="gold">Become a seller <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Trust */}
      <section className="py-16">
        <Container>
          <div className="max-w-2xl">
            <p className="eyebrow">Why ANTIQUA</p>
            <h2 className="mt-2.5 text-3xl md:text-4xl">Built on six foundations of trust</h2>
            <p className="mt-3 text-sm text-muted">
              Antiques demand certainty. Every part of ANTIQUA is designed around it.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-md border border-line bg-paper p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold-dk">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats + CTA */}
      <section className="border-t border-line bg-ink py-16 text-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[.24em] text-gold">
                By the numbers
              </p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">
                A marketplace trusted by collectors worldwide
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                Since 1897, ANTIQUA has been at the heart of the fine-art and antique trade.
                Our digital marketplace carries that tradition into the modern collector&rsquo;s world.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { num: "12,400+", lbl: "Authenticated lots" },
                { num: "84,000", lbl: "Registered collectors" },
                { num: "128", lbl: "Countries served" },
                { num: "99.4%", lbl: "Dispute resolution rate" },
              ].map((s) => (
                <div key={s.lbl} className="rounded-md border border-white/10 bg-white/5 p-5">
                  <p className="font-display text-3xl font-semibold text-gold-lt">{s.num}</p>
                  <p className="mt-1 text-[10.5px] uppercase tracking-widest text-white/45">
                    {s.lbl}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4 border-t border-white/10 pt-8">
            <Link href="/discover">
              <Button variant="gold" size="lg">Start browsing</Button>
            </Link>
            <Link href="/legal/buyer-protection">
              <Button variant="outline" size="lg" className="border-white/25 bg-transparent text-white hover:border-white/60 hover:bg-white/5">
                Read buyer protection
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}