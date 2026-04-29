"use client";

import { useState, useRef, useEffect } from "react";
import { Shield, Star, Clock, HeartHandshake, Send, Sparkles } from "lucide-react";

import { ChatWindow } from "@/components/demo/ChatWindow";
import { useStoryConversation } from "@/components/demo/useStoryConversation";

const SUGGESTIONS = [
  "Buy car insurance",
  "Renew my policy",
  "Talk to an advisor",
];

export function ApexPageDemo({
  clientName,
  assistantName,
}: {
  clientName: string;
  assistantName: string;
}) {
  const { state, startJourney, send, sendPhone } = useStoryConversation(clientName, assistantName);
  const [inputValue, setInputValue] = useState("");
  const [conversationOpen, setConversationOpen] = useState(false);
  const conversationRef = useRef<HTMLDivElement>(null);

  const shortName = clientName.replace(/insurance/i, "").trim();

  function handleSubmit(text?: string) {
    const value = (text ?? inputValue).trim();
    if (!value) return;
    setInputValue("");
    setConversationOpen(true);
    if (state.stage === "idle") {
      startJourney(value);
    } else {
      send(value);
    }
  }

  // Scroll to conversation when it opens
  useEffect(() => {
    if (conversationOpen) {
      setTimeout(() => {
        conversationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [conversationOpen]);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C8102E]">
              <Shield className="text-white" style={{ width: 18, height: 18 }} />
            </div>
            <span className="text-base font-bold text-[#0A2540] tracking-tight">{shortName || clientName}</span>
          </div>
          <div className="hidden items-center gap-7 sm:flex">
            {["Plans", "Claims", "Renew", "About"].map((item) => (
              <span key={item} className="text-sm text-gray-500 cursor-default">{item}</span>
            ))}
          </div>
          <span className="hidden text-sm font-medium text-gray-500 sm:block cursor-default">Login</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0A2540]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 40%, #3B82F6 0%, transparent 60%), radial-gradient(circle at 20% 80%, #C8102E 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 pb-12 pt-16 text-center">
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-white mb-4">
            Insurance that moves
            <br />
            <span className="text-[#C8102E]">with you.</span>
          </h1>
          <p className="text-lg text-blue-200 mb-8 max-w-md mx-auto">
            Fast quotes. Easy claims. Real protection.
          </p>

          {/* AI input bar */}
          <div className="rounded-2xl bg-white shadow-lg overflow-hidden">
            <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-2">
              <Sparkles className="h-3.5 w-3.5 text-[#C8102E] shrink-0" />
              <span className="text-[11px] font-semibold text-[#C8102E] uppercase tracking-wider">APEX AI</span>
              <span className="text-[11px] text-gray-400">· Ask anything about insurance</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                placeholder="e.g. I want to buy car insurance..."
                className="flex-1 bg-transparent text-sm text-[#0A2540] placeholder-gray-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!inputValue.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C8102E] text-white hover:bg-[#a00d24] disabled:opacity-40 transition-colors shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            {/* Suggestion chips — hidden once conversation started */}
            {!conversationOpen && (
              <div className="flex flex-wrap gap-2 border-t border-gray-100 px-4 py-2.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSubmit(s)}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-[#C8102E]/10 hover:text-[#C8102E] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Conversation panel — expands inline below hero */}
      {conversationOpen && (
        <section ref={conversationRef} className="border-b border-gray-100 bg-white animate-[slideUp_0.3s_ease]">
          <div className="mx-auto max-w-3xl px-6 py-6">
            {/* Conversation header */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0A2540] text-[10px] font-bold text-white shrink-0">
                AX
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0A2540]">{assistantName}</p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[11px] text-gray-400">APEX AI · active</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConversationOpen(false)}
                className="ml-auto text-xs text-gray-400 hover:text-gray-600"
              >
                Collapse
              </button>
            </div>

            {/* Chat window — fixed height with scroll */}
            <div className="rounded-2xl border border-gray-100 bg-[#F9FAFB] overflow-hidden" style={{ height: 420 }}>
              <ChatWindow
                state={state}
                onSend={send}
                onSendPhone={sendPhone}
                assistantName={assistantName}
                compact
              />
            </div>
          </div>
        </section>
      )}

      {/* Trust strip */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8 px-6 py-5">
          {[
            { icon: Star, label: "4.8 / 5 rating", sub: "1.2M reviews" },
            { icon: Clock, label: "Claims in 2 days", sub: "Average settlement" },
            { icon: HeartHandshake, label: "24/7 support", sub: "Always available" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0A2540]/5">
                <Icon className="h-4 w-4 text-[#0A2540]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0A2540]">{label}</p>
                <p className="text-[11px] text-gray-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold text-[#0A2540] mb-2 text-center">Explore our plans</h2>
        <p className="text-gray-400 text-center mb-10 text-sm">Comprehensive coverage for every stage of life</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Motor Insurance", sub: "Cars, bikes, and commercial vehicles", icon: "🚗", from: "₹2,400" },
            { label: "Health Insurance", sub: "Individual, family floater plans", icon: "🏥", from: "₹3,200" },
            { label: "Home Insurance", sub: "Structure, content, and liability", icon: "🏡", from: "₹1,800" },
          ].map((product) => (
            <div
              key={product.label}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-default"
            >
              <span className="text-3xl block mb-3">{product.icon}</span>
              <p className="font-semibold text-[#0A2540] mb-1">{product.label}</p>
              <p className="text-xs text-gray-400 mb-4">{product.sub}</p>
              <p className="text-xs text-gray-400">
                Starting from <strong className="text-[#0A2540]">{product.from}</strong>/year
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-8">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C8102E]">
              <Shield className="text-white" style={{ width: 14, height: 14 }} />
            </div>
            <span className="text-sm font-bold text-[#0A2540]">{shortName || clientName}</span>
          </div>
          <p className="text-xs text-gray-400">IRDAI Approved · CIN U66010DL2001PLC108620</p>
        </div>
      </footer>
    </div>
  );
}
