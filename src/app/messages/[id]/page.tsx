import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MessageThread } from "@/components/messages/MessageThread";
import { getCurrentUser } from "@/lib/current-user";
import { getConversationThread } from "@/lib/messages";

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getConversationThread(id);
  return { title: t ? `Chat with ${t.otherName}` : "Conversation" };
}

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/messages");

  const { id } = await params;
  const thread = await getConversationThread(id);
  if (!thread) notFound();

  return (
    <section className="py-8">
      <Container>
        <Link href="/messages" className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-ink">
          <ChevronLeft className="h-3.5 w-3.5" /> All messages
        </Link>

        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-lt to-gold font-display text-base font-bold text-ink">
            {thread.otherName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-2xl">{thread.otherName}</h1>
            {thread.productTitle && thread.productSlug && (
              <Link
                href={`/discover/${thread.productSlug}`}
                className="text-xs text-gold-dk hover:underline"
              >
                About: {thread.productTitle}
              </Link>
            )}
          </div>
        </div>

        <MessageThread
          conversationId={thread.id}
          initialMessages={thread.messages}
          otherName={thread.otherName}
        />
      </Container>
    </section>
  );
}