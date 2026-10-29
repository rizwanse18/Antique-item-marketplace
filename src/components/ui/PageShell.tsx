import { Container } from "./Container";
import type { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-11">
        <Container>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-2.5 text-4xl md:text-5xl">{title}</h1>
          {description && (
            <p className="mt-3 max-w-2xl text-muted">{description}</p>
          )}
        </Container>
      </section>
      <section className="py-16">
        <Container>{children}</Container>
      </section>
    </>
  );
}

export function Placeholder({ note }: { note: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-line-2 bg-paper/60 px-6 py-24 text-center">
      <p className="font-display text-2xl">Coming in a later phase</p>
      <p className="mt-2 max-w-md text-sm text-muted">{note}</p>
    </div>
  );
}