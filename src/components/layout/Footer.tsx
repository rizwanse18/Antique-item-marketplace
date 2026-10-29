import Link from "next/link";
import { Container } from "@/components/ui/Container";

const SECTIONS = [
  {
    title: "Marketplace",
    links: [
      { label: "Browse Catalogue", href: "/discover" },
      { label: "Live Auctions", href: "/auctions" },
      { label: "Categories", href: "/categories" },
      { label: "Sellers", href: "/sellers" },
      { label: "Watchlist", href: "/favorites" },
    ],
  },
  {
    title: "Sell",
    links: [
      { label: "Sell an Item", href: "/sell" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Seller Guidelines", href: "/legal/seller-guidelines" },
      { label: "Auction Rules", href: "/legal/auction-rules" },
      { label: "Authenticity Guidelines", href: "/legal/authenticity" },
    ],
  },
  {
    title: "Trust & Legal",
    links: [
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Buyer Protection", href: "/legal/buyer-protection" },
      { label: "Shipping Policy", href: "/legal/shipping" },
      { label: "Return Policy", href: "/legal/returns" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "All Legal & Trust", href: "/legal" },
      { label: "Prohibited Items", href: "/legal/prohibited" },
      { label: "Contact", href: "/legal/contact" },
      { label: "About ANTIQUA", href: "/how-it-works" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-gold/20 bg-ink text-white/60">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-gold text-gold">
              <div className="absolute inset-1 rounded-full border border-gold/35" />
              <svg
                viewBox="0 0 24 24"
                className="h-[19px] w-[19px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-6 9 6" />
                <path d="M5 9v11h14V9" />
                <path d="M9 20v-6h6v6" />
              </svg>
            </div>
            <span className="font-display text-xl font-semibold tracking-[.14em] text-white">
              ANTIQUA
            </span>
          </div>
          <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed">
            An international auction house specialising in authenticated antiques,
            rare collectibles and fine art since 1897.
          </p>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h5 className="mb-4 font-body text-[11px] font-bold uppercase tracking-[.2em] text-gold">
              {section.title}
            </h5>
            <ul className="space-y-2.5">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13.5px] transition-colors hover:text-gold-lt"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-6 text-[12px] text-white/40">
          <span>© 2026 ANTIQUA Auction House Ltd. All rights reserved.</span>
          <span>
            <Link href="/legal/terms" className="hover:text-gold-lt">Terms</Link>
            {" · "}
            <Link href="/legal/privacy" className="hover:text-gold-lt">Privacy</Link>
            {" · "}
            <Link href="/legal/contact" className="hover:text-gold-lt">Contact</Link>
          </span>
        </Container>
      </div>
    </footer>
  );
}