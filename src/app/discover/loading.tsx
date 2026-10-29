import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <section className="py-16">
      <Container>
        <div className="animate-pulse">
          <div className="h-4 w-32 rounded bg-[#e5dccd]" />
          <div className="mt-3 h-10 w-56 rounded bg-[#e5dccd]" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-md border border-[#e5dccd] bg-[#fffdf9]">
                <div className="aspect-[4/3] bg-[#e5dccd]" />
                <div className="space-y-2 p-4">
                  <div className="h-3 w-20 rounded bg-[#e5dccd]" />
                  <div className="h-5 w-full rounded bg-[#e5dccd]" />
                  <div className="h-3 w-28 rounded bg-[#e5dccd]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}