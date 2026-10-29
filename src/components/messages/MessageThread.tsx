"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { sendMessageAction, fetchThreadAction } from "@/app/actions/messages";

interface Msg {
  id: string;
  fromMe: boolean;
  senderName: string;
  body: string;
  createdAt: number;
}

export function MessageThread({
  conversationId,
  initialMessages,
  otherName,
}: {
  conversationId: string;
  initialMessages: Msg[];
  otherName: string;
}) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [body, setBody] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      const t = await fetchThreadAction(conversationId);
      if (!cancelled && t) setMessages(t.messages);
    };
    const id = setInterval(poll, 4000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [conversationId]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const text = body.trim();
    if (!text) return;
    start(async () => {
      const res = await sendMessageAction(conversationId, text);
      if (!res.ok) {
        setError(res.error ?? "Failed to send.");
        return;
      }
      setBody("");
      const t = await fetchThreadAction(conversationId);
      if (t) setMessages(t.messages);
    });
  };

  return (
    <div className="flex min-h-[480px] flex-col rounded-md border border-line bg-paper">
      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto p-5"
        style={{ maxHeight: "calc(100vh - 340px)" }}
      >
        {messages.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">Say hello to {otherName}.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={cn("flex", m.fromMe ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[78%] rounded-lg px-3.5 py-2.5 text-sm",
                  m.fromMe ? "bg-gold text-ink" : "bg-cream text-ink"
                )}
              >
                <p
                  className={cn(
                    "mb-1 text-[10px] font-bold uppercase tracking-widest",
                    m.fromMe ? "text-ink/60" : "text-muted-2"
                  )}
                >
                  {m.fromMe ? "You" : m.senderName}
                </p>
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
                <p
                  className={cn(
                    "mt-1 text-[10px]",
                    m.fromMe ? "text-ink/50" : "text-muted-2"
                  )}
                >
                  {new Date(m.createdAt).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={submit} className="flex gap-2 border-t border-line p-3">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={`Message ${otherName}...`}
          maxLength={5000}
          className="flex-1 rounded-full border border-line-2 bg-paper px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          disabled={pending}
        />
        <Button type="submit" variant="gold" disabled={pending || !body.trim()} className="px-4">
          <Send className="h-4 w-4" />
        </Button>
      </form>

      {error && (
        <p className="border-t border-danger/30 bg-danger/10 px-4 py-2 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}