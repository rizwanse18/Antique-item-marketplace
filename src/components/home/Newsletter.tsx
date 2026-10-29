"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
  };

  return (
    <section className="bg-ink py-16 text-white">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[.24em] text-gold">
            Newsletter
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl">Stay ahead of the gavel.</h2>
          <p className="mt-3 text-sm text-white/60">
            Catalogue previews, sale announcements and rare finds - sent once a week.
          </p>

          {done ? (
            <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold/15 px-5 py-3 text-sm text-gold-lt">
              Thank you - you are subscribed.
            </p>
          ) : (
            <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
              />
              <Button type="submit" variant="gold">Subscribe</Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}