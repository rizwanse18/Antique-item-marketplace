import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/current-user";
import { getMyConversations } from "@/lib/messages";

export const metadata = { title: "Messages" };
export const instant = false;

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}

export default async function MessagesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/messages");
  const convos = await getMyConversations();

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-11">
        <Container>
          <p className="eyebrow">Your Inbox</p>
          <h1 className="mt-2.5 text-4xl md:text-5xl">Messages</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Direct conversations with buyers and sellers on ANTIQUA.
          </p>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          {convos.length === 0 ? (
            <div className="mx-auto max-w-md rounded-md border border-dashed border-line-2 bg-paper/60 px-6 py-16 text-center">
              <MessageSquare className="mx-auto h-10 w-10 text-line-2" />
              <p className="mt-5 font-display text-2xl">No messages yet</p>
              <p className="mt-2 text-sm text-muted">
                Contact a seller from any lot page to start a conversation.
              </p>
              <div className="mt-6">
                <Link href="/discover"><Button variant="gold">Browse lots</Button></Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {convos.map((c) => (
                <Link
                  key={c.id}
                  href={`/messages/${c.id}`}
                  className="flex items-start gap-3 rounded-md border border-line bg-paper p-4 transition-all hover:border-line-2 hover:shadow-soft"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-lt to-gold font-display text-sm font-bold text-ink">
                    {c.otherName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-display text-base font-semibold">{c.otherName}</p>
                      <p className="flex-shrink-0 text-[11px] text-muted-2">{timeAgo(c.lastMessageAt)}</p>
                    </div>
                    {c.productTitle && (
                      <p className="mt-0.5 truncate text-[11px] font-semibold uppercase tracking-widest text-gold-dk">
                        About: {c.productTitle}
                      </p>
                    )}
                    <p className="mt-1 truncate text-sm text-muted">
                      {c.lastMessage ? (
                        <>{c.lastFromMe ? "You: " : ""}{c.lastMessage}</>
                      ) : (
                        <span className="italic">No messages yet</span>
                      )}
                    </p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[10px] font-bold text-ink">
                      {c.unreadCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}