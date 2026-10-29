import { redirect } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/admin";

export const instant = false;

export const metadata = { title: "Admin" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await requireAdmin();
  if (!me) redirect("/sign-in?next=/admin");

  return (
    <section className="py-8">
      <Container>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Admin Console</p>
            <h1 className="mt-1.5 font-display text-2xl">ANTIQUA Back Office</h1>
          </div>
          <Link
            href="/"
            className="rounded-sm border border-line-2 bg-paper px-4 py-2 text-xs font-semibold text-ink hover:border-ink"
          >
            ← Back to site
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <AdminSidebar />
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </section>
  );
}