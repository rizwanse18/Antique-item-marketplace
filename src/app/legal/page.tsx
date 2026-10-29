import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  ScrollText,
  Gavel,
  Truck,
  RotateCcw,
  AlertTriangle,
  BadgeCheck,
  Mail,
  Store,
} from "lucide-react";
import { Container } from "@/components/ui/Container";

export const metadata = { title: "Legal & Trust" };
export const instant = false;

const PAGES = [
  { href: "/legal/terms",          icon: FileText,     title: "Terms of Service",       desc: "The legal agreement between you and ANTIQUA." },
  { href: "/legal/privacy",        icon: ShieldCheck,  title: "Privacy Policy",         desc: "How we collect, use, and protect your personal data." },
  { href: "/legal/buyer-protection", icon: BadgeCheck, title: "Buyer Protection",       desc: "How we protect you if a lot materially misrepresents its description." },
  { href: "/legal/seller-guidelines", icon: Store,     title: "Seller Guidelines",      desc: "Requirements and best practices for consigning on ANTIQUA." },
  { href: "/legal/auction-rules",  icon: Gavel,        title: "Auction Rules",          desc: "Bid increments, anti-sniping, payment windows, and lot withdrawals." },
  { href: "/legal/shipping",       icon: Truck,        title: "Shipping Policy",        desc: "Packing, insurance, carriers, and international delivery." },
  { href: "/legal/returns",        icon: RotateCcw,    title: "Return Policy",          desc: "When returns are accepted, and how to open a case." },
  { href: "/legal/prohibited",     icon: AlertTriangle, title: "Prohibited Items",      desc: "What may not be listed — stolen goods, cultural heritage, regulated items." },
  { href: "/legal/authenticity",   icon: ScrollText,   title: "Authenticity Guidelines", desc: "How ANTIQUA approaches authentication and provenance." },
  { href: "/legal/contact",        icon: Mail,         title: "Contact Us",             desc: "Reach the ANTIQUA team for any question or concern." },
];

export default function LegalIndexPage() {
  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-12">
        <Container>
          <p className="eyebrow">Trust & Transparency</p>
          <h1 className="mt-2.5 text-4xl md:text-5xl">Legal & Trust</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Buying and selling antiques requires trust. These documents explain your rights,
            our responsibilities, and how disputes are handled.
          </p>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PAGES.map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.href}
                  href={p.href}
                  className="group rounded-md border border-line bg-paper p-5 transition-all hover:-translate-y-0.5 hover:border-line-2 hover:shadow-soft"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold-dk">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 font-display text-lg font-semibold group-hover:text-burgundy">
                    {p.title}
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">
                    {p.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}