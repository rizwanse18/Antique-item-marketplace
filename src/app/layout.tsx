import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartContext";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ANTIQUA - International Antique & Fine Art Auction House",
    template: "%s | ANTIQUA",
  },
  description:
    "A specialised international marketplace for authenticated antiques, rare collectibles, historical objects and fine art. Buy, sell and bid live.",
  applicationName: "ANTIQUA",
  authors: [{ name: "ANTIQUA Auction House Ltd." }],
  keywords: [
    "antiques",
    "auction",
    "fine art",
    "collectibles",
    "rare books",
    "ceramics",
    "furniture",
    "jewelry",
    "sculptures",
    "online auction",
  ],
  openGraph: {
    type: "website",
    siteName: "ANTIQUA",
    title: "ANTIQUA - International Antique & Fine Art Auction House",
    description:
      "Buy, sell and bid live on authenticated antiques, rare collectibles and fine art.",
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ANTIQUA - International Antique & Fine Art Auction House",
    description:
      "Buy, sell and bid live on authenticated antiques, rare collectibles and fine art.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

function HeaderSkeleton() {
  return <div className="h-[74px] border-b border-gold/20 bg-ink" />;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ANTIQUA Auction House Ltd.",
    url: SITE_URL,
    description:
      "International marketplace for authenticated antiques, rare collectibles and fine art since 1897.",
    foundingDate: "1897",
    address: {
      "@type": "PostalAddress",
      streetAddress: "12 St James's Place",
      addressLocality: "London",
      postalCode: "SW1A 1NP",
      addressCountry: "GB",
    },
    sameAs: [
      "https://twitter.com/antiqua",
      "https://instagram.com/antiqua",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ANTIQUA",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/discover?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Suspense fallback={<HeaderSkeleton />}>
            <Header />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}