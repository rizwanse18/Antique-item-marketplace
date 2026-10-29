"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] uncaught error:", error);
  }, [error]);

  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <p className="font-display text-[120px] font-bold leading-none text-[#a8323c]">
            500
          </p>
          <h1 className="mt-4 font-display text-3xl md:text-4xl">
            Something went wrong in the saleroom
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            A technical error occurred while processing your request. Our team
            has been notified. Please try again, or return to a safe page.
          </p>
          {error.digest && (
            <p className="mt-3 font-mono text-[11px] text-muted-2">
              Error ID: {error.digest}
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="gold" onClick={reset}>
              Try again
            </Button>
            <Link href="/"><Button variant="outline">Return home</Button></Link>
          </div>
        </div>
      </Container>
    </section>
  );
}