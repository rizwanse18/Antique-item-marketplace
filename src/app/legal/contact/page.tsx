import { Mail, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/legal/ContactForm";
import { getCurrentUser } from "@/lib/current-user";

export const metadata = { title: "Contact Us" };
export const instant = false;

export default async function ContactPage() {
  const user = await getCurrentUser();

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-11">
        <Container>
          <p className="eyebrow">Legal & Trust</p>
          <h1 className="mt-2.5 text-4xl md:text-5xl">Contact Us</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Questions, disputes, reports, or feedback — we read every message
            and aim to reply within 2 business days.
          </p>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="max-w-xl">
              <ContactForm defaultName={user?.name} defaultEmail={user?.email} />
            </div>

            <aside className="space-y-4">
              <div className="rounded-md border border-line bg-paper p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dk">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-display text-base font-semibold">Email</p>
                    <p className="mt-1 text-xs text-muted">
                      General:{" "}
                      <a href="mailto:hello@antiqua.example.com" className="text-gold-dk underline">
                        hello@antiqua.example.com
                      </a>
                    </p>
                    <p className="text-xs text-muted">
                      Trust &amp; safety:{" "}
                      <a href="mailto:trust@antiqua.example.com" className="text-gold-dk underline">
                        trust@antiqua.example.com
                      </a>
                    </p>
                    <p className="text-xs text-muted">
                      Legal:{" "}
                      <a href="mailto:legal@antiqua.example.com" className="text-gold-dk underline">
                        legal@antiqua.example.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-line bg-paper p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dk">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-display text-base font-semibold">Registered office</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      ANTIQUA Auction House Ltd.
                      <br />
                      12 St James&rsquo;s Place
                      <br />
                      London SW1A 1NP
                      <br />
                      United Kingdom
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-line bg-paper p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dk">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-display text-base font-semibold">Response times</p>
                    <ul className="mt-1 space-y-1 text-xs text-muted">
                      <li>General enquiries: 2 business days</li>
                      <li>Order issues: 1 business day</li>
                      <li>Auction disputes: 3 business days</li>
                      <li>Safety / fraud: within 24 hours</li>
                    </ul>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}