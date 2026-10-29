import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";

export const instant = false;

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    include: { reporter: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const open = reports.filter((r) => r.status === "open");
  const closed = reports.filter((r) => r.status !== "open");

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-display text-2xl">Reports</h2>
        <p className="mt-1 text-xs text-muted">
          {open.length} open · {closed.length} closed
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-md border border-dashed border-line-2 bg-paper/60 px-6 py-12 text-center">
          <p className="font-display text-lg">No reports yet</p>
          <p className="mt-1 text-xs text-muted">User-submitted reports will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {reports.map((r) => (
            <div key={r.id} className="rounded-md border border-line bg-paper p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge tone={r.status === "open" ? "live" : r.status === "resolved" ? "success" : "muted"}>
                      {r.status}
                    </Badge>
                    <span className="text-[11px] font-mono text-muted-2">{r.targetType}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-ink">{r.reason}</p>
                  {r.details && <p className="mt-1 text-xs text-muted">{r.details}</p>}
                  <p className="mt-1 text-[11px] text-muted-2">
                    Reported by {r.reporter.name} · {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}