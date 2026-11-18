"use client";
import { useState } from "react";
import { Send, Search, MoreVertical, Phone, Video } from "lucide-react";
import { Container } from "@/components/ui/Container";

const CONTACTS = [
  { id: 1, name: "Verrier Gallery", initials: "VG", lastMsg: "Yes, the item is still available.", time: "2m ago", unread: 2, online: true },
  { id: 2, name: "Holland Antiques", initials: "HA", lastMsg: "Thank you for your bid!", time: "1h ago", unread: 0, online: false },
  { id: 3, name: "Kato Collection", initials: "KC", lastMsg: "I can offer insured shipping.", time: "1d ago", unread: 0, online: false },
];

export default function MessagesPage() {
  const [active, setActive] = useState(1);

  return (
    <div className="min-h-[calc(100vh-74px)] bg-cream py-8">
      <Container className="h-[calc(100vh-140px)]">
        <div className="flex h-full overflow-hidden rounded-xl border border-line bg-paper shadow-sm">
          
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0 border-r border-line flex flex-col">
            <div className="p-4 border-b border-line">
              <h1 className="font-display text-2xl font-semibold text-ink mb-3">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
                <input type="text" placeholder="Search messages..." className="w-full rounded-md border border-line bg-cream py-2 pl-9 pr-3 text-sm focus:border-gold focus:outline-none" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {CONTACTS.map((c) => (
                <button key={c.id} onClick={() => setActive(c.id)} className={`w-full text-left flex items-start gap-3 p-4 border-b border-line transition-colors ${active === c.id ? "bg-gold/5" : "hover:bg-cream"}`}>
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-lt to-gold font-bold text-ink">{c.initials}</div>
                    {c.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-paper bg-green-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-semibold text-sm text-ink truncate">{c.name}</p>
                      <span className="text-[10px] text-muted whitespace-nowrap">{c.time}</span>
                    </div>
                    <p className={`text-xs mt-1 truncate ${c.unread ? "font-semibold text-ink" : "text-muted"}`}>{c.lastMsg}</p>
                  </div>
                  {c.unread > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-ink">{c.unread}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-[#fcfaf5]">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-line bg-paper px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-lt to-gold font-bold text-ink">
                  {CONTACTS.find(c => c.id === active)?.initials}
                </div>
                <div>
                  <p className="font-semibold text-ink">{CONTACTS.find(c => c.id === active)?.name}</p>
                  <p className="text-xs text-green-600">Online now</p>
                </div>
              </div>
              <div className="flex gap-2 text-muted">
                <button className="p-2 hover:bg-cream rounded-full"><Phone className="h-5 w-5" /></button>
                <button className="p-2 hover:bg-cream rounded-full"><Video className="h-5 w-5" /></button>
                <button className="p-2 hover:bg-cream rounded-full"><MoreVertical className="h-5 w-5" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="text-center text-xs text-muted my-4">Today</div>
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl rounded-tl-sm bg-paper px-4 py-2.5 text-sm text-ink shadow-sm border border-line">
                  Hello! I saw you are interested in the Louis XV Commode. Are you looking for anything specific?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[70%] rounded-2xl rounded-tr-sm bg-gold px-4 py-2.5 text-sm text-ink shadow-sm">
                  Hi! Yes, I'd like to know if the provenance documents are included.
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl rounded-tl-sm bg-paper px-4 py-2.5 text-sm text-ink shadow-sm border border-line">
                  Yes, the full provenance certificate from the 19th century is included.
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-line bg-paper p-4">
              <div className="flex items-center gap-3 rounded-full border border-line bg-cream px-4 py-2">
                <input type="text" placeholder="Type a message..." className="flex-1 bg-transparent text-sm focus:outline-none" />
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-ink hover:bg-gold-dk transition-colors">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}