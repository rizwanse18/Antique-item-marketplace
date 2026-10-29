import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { ReactNode } from "react";

export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-11">
        <Container>
          <Link
            href="/legal"
            className="mb-3 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-muted hover:text-ink"
          >
            <ChevronLeft className="h-3 w-3" /> Legal & Trust
          </Link>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-2.5 text-4xl md:text-5xl">{title}</h1>
          <p className="mt-3 text-xs text-muted-2">Last updated: {updated}</p>
          {intro && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
              {intro}
            </p>
          )}
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <article className="max-w-3xl space-y-6 text-sm leading-relaxed text-ink/85 [&>h2]:mt-10 [&>h2]:font-display [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:text-ink [&>h3]:mt-6 [&>h3]:font-display [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-ink [&>p]:mt-3 [&>ul]:mt-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-1.5 [&>ol]:mt-3 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-1.5 [&_strong]:font-semibold [&_strong]:text-ink">
            {children}
          </article>

          <div className="mt-12 max-w-3xl rounded-md border border-line bg-paper p-5 text-xs text-muted">
            <p className="font-semibold text-ink">Contact</p>
            <p className="mt-1">
              Questions about this document? Email{" "}
              <a href="mailto:antiqueitemmarketplace@gmail.com" className="text-gold-dk underline">
                antiqueitemmarketplace@gmail.com
              </a>{" "}
              or use our{" "}
              <Link href="/legal/contact" className="text-gold-dk underline">
                contact form
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}