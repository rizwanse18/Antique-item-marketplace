import { Container } from "@/components/ui/Container";

const QUOTES = [
  { q: "The provenance documentation was faultless. The commode arrived exactly as described.", name: "Elise M.", role: "Collector / Geneva" },
  { q: "I consigned three pieces in one week and every one of them sold above reserve.", name: "H. Whitcombe", role: "Estate Dealer / London" },
  { q: "Live bidding feels like being in the saleroom. The anti-sniping extension saved me from losing a rare Iznik dish.", name: "D. Larsson", role: "Private Collector / Stockholm" },
];

export function Testimonials() {
  return (
    <section className="py-16">
      <Container>
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">Voices from the saleroom</p>
          <h2 className="mt-2.5 text-3xl md:text-4xl">What collectors say</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {QUOTES.map((t) => (
            <blockquote
              key={t.name}
              className="flex h-full flex-col justify-between rounded-md border border-line bg-paper p-6"
            >
              <p className="font-display text-lg italic leading-relaxed text-ink">
                &ldquo;{t.q}&rdquo;
              </p>
              <footer className="mt-6 border-t border-line pt-4">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}