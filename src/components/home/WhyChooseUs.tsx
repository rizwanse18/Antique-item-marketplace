import { ShieldCheck, FileCheck2, Lock, Gavel, Handshake, BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";

const ITEMS = [
  { icon: BadgeCheck,  title: "Verified Sellers",     body: "Every consignor is identity-checked and vetted before their first listing goes live." },
  { icon: FileCheck2,  title: "Authenticity Focus",   body: "Provenance, documentation and expert review are central to every listing." },
  { icon: Lock,        title: "Secure Transactions",  body: "Encrypted payments, escrow-ready checkout, and full purchase records." },
  { icon: Gavel,       title: "Live Auctions",        body: "Real-time bidding with anti-sniping extensions and server-authoritative rules." },
  { icon: ShieldCheck, title: "Buyer Protection",     body: "If an item materially misrepresents its description, you are covered." },
  { icon: Handshake,   title: "Direct Seller Contact", body: "Message dealers directly for condition reports, provenance or shipping questions." },
];

export function WhyChooseUs() {
  return (
    <section className="py-16">
      <Container>
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">Why ANTIQUA</p>
          <h2 className="mt-2.5 text-3xl md:text-4xl">Built for serious collectors</h2>
          <p className="mt-3 text-sm text-muted">
            Antiques demand trust. Our platform is designed around authenticity,
            documentation and secure transactions from the very first click.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-md border border-line bg-paper p-6 transition-all duration-200 hover:-translate-y-1 hover:border-line-2 hover:shadow-soft"
            >
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
  );
}