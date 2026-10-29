import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <p className="font-display text-[120px] font-bold leading-none text-[#c8a45c]">
            404
          </p>
          <h1 className="mt-4 font-display text-3xl md:text-4xl">
            This lot has been withdrawn
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            The page you are looking for doesn&rsquo;t exist, has been removed, or
            perhaps never made it to the saleroom. Let&rsquo;s find something
            extraordinary instead.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/"><Button variant="gold">Return home</Button></Link>
            <Link href="/discover"><Button variant="outline">Browse catalogue</Button></Link>
            <Link href="/auctions"><Button variant="ghost">Live auctions</Button></Link>
          </div>
        </div>
      </Container>
    </section>
  );
}