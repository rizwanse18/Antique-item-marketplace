import { Container } from "@/components/ui/Container";

const BUYERS = [
  { n: "01", title: "Discover",  body: "Browse authenticated lots across 14 departments." },
  { n: "02", title: "Inspect",   body: "Review provenance, condition reports, and full imagery." },
  { n: "03", title: "Bid or Buy", body: "Bid live in the saleroom, or purchase instantly at a fixed price." },
  { n: "04", title: "Receive",   body: "Insured shipping, tracking and buyer protection on every order." },
];

const SELLERS = [
  { n: "01", title: "List",   body: "Create a listing with full metadata, imagery and provenance." },
  { n: "02", title: "Verify", body: "Our specialists review documentation and authenticate your item." },
  { n: "03", title: "Auction or Sell", body: "Go live to a global audience, or offer at a fixed price." },
  { n: "04", title: "Get Paid", body: "Funds released securely once the buyer confirms receipt." },
];

export function HowItWorksSection() {
  return (
    <section className="border-y border-line bg-cream py-16">
      <Container>
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">Process</p>
          <h2 className="mt-2.5 text-3xl md:text-4xl">How it works</h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="font-display text-xl font-semibold text-burgundy">For Buyers</p>
            <ol className="mt-6 space-y-5">
              {BUYERS.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="font-display text-2xl font-bold text-gold-dk">{s.n}</span>
                  <div>
                    <p className="font-display text-lg font-semibold">{s.title}</p>
                    <p className="mt-1 text-sm text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className="font-display text-xl font-semibold text-burgundy">For Sellers</p>
            <ol className="mt-6 space-y-5">
              {SELLERS.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="font-display text-2xl font-bold text-gold-dk">{s.n}</span>
                  <div>
                    <p className="font-display text-lg font-semibold">{s.title}</p>
                    <p className="mt-1 text-sm text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}