import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <section className="py-10">
      <Container>
        <div className="animate-pulse grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div className="aspect-[4/3] rounded-md bg-[#e5dccd]" />
          <div className="space-y-4">
            <div className="h-3 w-40 rounded bg-[#e5dccd]" />
            <div className="h-10 w-full rounded bg-[#e5dccd]" />
            <div className="h-4 w-60 rounded bg-[#e5dccd]" />
            <div className="mt-6 h-72 rounded-md bg-[#f3ece0]" />
            <div className="h-32 rounded-md bg-[#e5dccd]" />
          </div>
        </div>
      </Container>
    </section>
  );
}