import { Container } from "@/components/ui/Container";
import { Award, Globe2, ShieldCheck, Truck } from "lucide-react";

const ITEMS = [
  { Icon: ShieldCheck, title: "Certified Authentic", body: "Every lot vetted by our specialists" },
  { Icon: Truck,       title: "Insured Shipping",   body: "Worldwide delivery, fully protected" },
  { Icon: Award,       title: "Buyer Protection",   body: "14-day returns on all purchases" },
  { Icon: Globe2,      title: "Global Reach",       body: "Bidders from 128 countries" },
];

export function TrustBar() {
  return (
    <section className="border-y border-line bg-paper">
      <Container className="grid gap-5 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ Icon, title, body }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dk">
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-ink">{title}</p>
              <p className="text-[11.5px] text-muted">{body}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}