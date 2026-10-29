import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export const metadata = { title: "Email Log (dev)" };
export const instant = false;

function fmtDate(d: Date) {
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusTone(s: string): "success" | "gold" | "muted" | "live" {
  if (s === "sent") return "success";
  if (s === "queued") return "gold";
  if (s === "failed") return "live";
  return "muted";
}

export default async function EmailLogPage({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/dev/emails");
  // Only allow in dev mode
  if (process.env.NODE_ENV === "production") redirect("/");

  const sp = await searchParams;
  const provider = process.env.EMAIL_PROVIDER || "log";

  const [emails, totalCount, sentCount, failedCount] = await Promise.all([
    prisma.emailLog.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.emailLog.count(),
    prisma.emailLog.count({ where: { status: "sent" } }),
    prisma.emailLog.count({ where: { status: "failed" } }),
  ]);

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-11">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Development</p>
              <h1 className="mt-2.5 text-4xl md:text-5xl">Email Log</h1>
              <p className="mt-3 max-w-2xl text-sm text-muted">
                Every outbound email is recorded here. Currently using the <b>{provider}</b> provider.
                {provider === "log" && " Emails are logged to the terminal + this page — not actually delivered."}
              </p>
            </div>
            <Badge tone={provider === "log" ? "gold" : "success"}>
              Provider: {provider}
            </Badge>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-md border border-line bg-paper p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-2">Total</p>
              <p className="mt-1 font-display text-3xl font-bold">{totalCount}</p>
            </div>
            <div className="rounded-md border border-line bg-paper p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-2">Sent</p>
              <p className="mt-1 font-display text-3xl font-bold text-success">{sentCount}</p>
            </div>
            <div className="rounded-md border border-line bg-paper p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-2">Failed</p>
              <p className="mt-1 font-display text-3xl font-bold text-danger">{failedCount}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          {sp.empty && (
            <div className="mb-4 rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              Email log cleared.
            </div>
          )}

          {emails.length === 0 ? (
            <div className="mx-auto max-w-md rounded-md border border-dashed border-line-2 bg-paper/60 px-6 py-16 text-center">
              <p className="font-display text-2xl">No emails yet</p>
              <p className="mt-2 text-sm text-muted">
                Trigger an event — sign up, get outbid, buy an item — and emails will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {emails.map((e) => (
                <div key={e.id} className="rounded-md border border-line bg-paper p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge tone={statusTone(e.status)}>{e.status}</Badge>
                      <span className="font-mono text-[11px] text-muted">{e.template}</span>
                    </div>
                    <span className="text-[11px] text-muted-2">{fmtDate(e.createdAt)}</span>
                  </div>
                  <p className="mt-2 font-display text-base font-semibold">{e.subject}</p>
                  <p className="mt-1 text-xs text-muted">
                    To: {e.toName} &lt;{e.toEmail}&gt;
                  </p>
                  <p className="mt-2 whitespace-pre-wrap rounded-sm bg-cream px-3 py-2 text-[12.5px] text-ink/85">
                    {e.body}
                  </p>
                  {e.error && (
                    <p className="mt-2 rounded-sm bg-danger/10 px-3 py-2 text-[12px] text-danger">
                      Error: {e.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}