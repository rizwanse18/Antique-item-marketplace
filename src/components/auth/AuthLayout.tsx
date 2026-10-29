import Link from "next/link";
import type { ReactNode } from "react";

export function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="grid min-h-[calc(100vh-74px)] lg:grid-cols-[1.05fr_.95fr]">
      <div className="relative hidden overflow-hidden bg-ink text-white lg:block">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_500px_at_30%_20%,rgba(110,31,43,.55),transparent_60%),radial-gradient(600px_400px_at_80%_80%,rgba(200,164,92,.22),transparent_65%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between p-14">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-gold text-gold">
              <div className="absolute inset-1 rounded-full border border-gold/35" />
              <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-6 9 6" />
                <path d="M5 9v11h14V9" />
                <path d="M9 20v-6h6v6" />
              </svg>
            </div>
            <span className="font-display text-xl font-semibold tracking-[.14em]">ANTIQUA</span>
          </Link>

          <div className="max-w-md">
            <p className="text-[11px] font-semibold uppercase tracking-[.24em] text-gold">
              International Auction House
            </p>
            <h2 className="mt-4 font-display text-4xl leading-tight">
              Where history changes <em className="italic font-normal text-gold-lt">hands.</em>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              Join 84,000 collectors worldwide. Track lots, bid live, and consign
              your own treasures to a global audience.
            </p>
          </div>

          <ul className="space-y-3 text-sm text-white/70">
            {[
              "Authenticated antiques and fine art",
              "Real-time bidding with anti-sniping",
              "Buyer protection on every purchase",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-gold">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center bg-cream px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  );
}