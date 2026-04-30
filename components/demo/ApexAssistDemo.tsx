"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import { ChatWindow } from "@/components/demo/ChatWindow";
import { InsuranceSiteShell } from "@/components/demo/InsuranceSiteShell";
import { useStoryConversation } from "@/components/demo/useStoryConversation";

const INTENTS = [
  { id: "buy",    emoji: "🚗", title: "Buy insurance",   subtitle: "Motor, health, home" },
  { id: "renew",  emoji: "🔄", title: "Renew policy",    subtitle: "Quick renewal" },
  { id: "copy",   emoji: "📄", title: "Get policy copy", subtitle: "Download instantly" },
  { id: "advisor",emoji: "💬", title: "Talk to advisor", subtitle: "9 AM – 8 PM" },
];

type View = "default" | "apex";

export function ApexAssistDemo({
  clientName,
  assistantName,
}: {
  clientName: string;
  assistantName: string;
}) {
  const { state, startJourney, send, sendPhone } = useStoryConversation(clientName, assistantName);
  const [view, setView] = useState<View>("default");
  const [assistActive, setAssistActive] = useState(false);

  function handleIntent(intent: string) {
    setAssistActive(true);
    if (state.stage === "idle") startJourney(intent);
  }

  function switchView(next: View) {
    setView(next);
    if (next === "default") setAssistActive(false);
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Toggle bar */}
      <div className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-0 px-6 py-3">
          <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1 gap-1">
            <button
              type="button"
              onClick={() => switchView("default")}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                view === "default"
                  ? "bg-[#0A2540] text-white shadow-sm"
                  : "text-gray-500 hover:text-[#0A2540]"
              }`}
            >
              Default Experience
            </button>
            <button
              type="button"
              onClick={() => switchView("apex")}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                view === "apex"
                  ? "bg-[#C8102E] text-white shadow-sm"
                  : "text-gray-500 hover:text-[#0A2540]"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              APEX Assist
            </button>
          </div>
        </div>
      </div>

      {/* Content: smooth crossfade */}
      <div className="relative">
        {view === "default" ? (
          <div className="animate-[fadeIn_0.25s_ease]">
            <InsuranceSiteShell
              clientName={clientName}
              onIntent={() => {}}
            />
          </div>
        ) : (
          <div className="animate-[fadeIn_0.25s_ease]">
            {/* APEX Assist embedded experience */}
            <nav className="sticky top-[57px] z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C8102E]">
                    <Sparkles className="text-white h-4 w-4" />
                  </div>
                  <span className="text-base font-bold text-[#0A2540] tracking-tight">
                    {clientName.replace(/insurance/i, "").trim() || clientName}
                  </span>
                </div>
                <div className="hidden items-center gap-7 sm:flex">
                  {["Plans", "Claims", "Renew", "About"].map((item) => (
                    <span key={item} className="text-sm text-gray-500 cursor-default">{item}</span>
                  ))}
                </div>
                <span className="hidden text-sm font-medium text-gray-500 sm:block cursor-default">Login</span>
              </div>
            </nav>

            {/* Hero with APEX embedded */}
            <section className="bg-[#0A2540] relative overflow-hidden">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle at 70% 40%, #3B82F6 0%, transparent 60%)" }} />
              <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-0">
                <div className="text-center mb-10">
                  <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-200 uppercase tracking-wider">
                    <Sparkles className="h-3 w-3" /> APEX Assist · embedded
                  </p>
                  <h1 className="text-5xl font-bold tracking-tight text-white mb-4">
                    Insurance that moves<br /><span className="text-[#C8102E]">with you.</span>
                  </h1>
                  <p className="text-lg text-blue-200 max-w-md mx-auto">Fast quotes. Easy claims. Real protection.</p>
                </div>

                {!assistActive ? (
                  <div className="max-w-xl mx-auto pb-10 animate-[fadeIn_0.2s_ease]">
                    <div className="rounded-3xl bg-white/10 border border-white/20 backdrop-blur-sm p-4">
                      <div className="flex items-center gap-2 mb-3 px-1">
                        <Sparkles className="h-4 w-4 text-blue-300" />
                        <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">What can I help you with?</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {INTENTS.map((intent) => (
                          <button key={intent.id} type="button" onClick={() => handleIntent(intent.id)}
                            className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-left hover:bg-white/20 hover:border-white/30 transition-all">
                            <span className="text-xl">{intent.emoji}</span>
                            <div>
                              <p className="text-sm font-semibold text-white">{intent.title}</p>
                              <p className="text-[11px] text-blue-300">{intent.subtitle}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-xl mx-auto pb-0 animate-[slideUp_0.3s_ease]">
                    <div className="rounded-t-3xl bg-white shadow-2xl overflow-hidden" style={{ height: "60vh" }}>
                      <div className="flex items-center gap-3 bg-white border-b border-gray-100 px-4 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0A2540] text-[10px] font-bold text-white">AX</div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#0A2540]">{assistantName}</p>
                          <div className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <p className="text-[11px] text-gray-400">APEX Assist · active</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => setAssistActive(false)}
                          className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Minimise</button>
                      </div>
                      <ChatWindow state={state} onSend={send} onSendPhone={sendPhone} assistantName={assistantName} compact />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Below fold — dimmed when assist open */}
            <div className={`transition-opacity duration-300 ${assistActive ? "opacity-30 pointer-events-none" : ""}`}>
              <section className="border-b border-gray-100 bg-gray-50">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8 px-6 py-5">
                  {[
                    { label: "4.8 / 5 rating", sub: "1.2M reviews" },
                    { label: "Claims in 2 days", sub: "Average settlement" },
                    { label: "24/7 support", sub: "Always available" },
                  ].map(({ label, sub }) => (
                    <div key={label} className="flex flex-col items-center text-center">
                      <p className="text-sm font-semibold text-[#0A2540]">{label}</p>
                      <p className="text-[11px] text-gray-400">{sub}</p>
                    </div>
                  ))}
                </div>
              </section>
              <section className="mx-auto max-w-6xl px-6 py-16">
                <h2 className="text-2xl font-bold text-[#0A2540] mb-8 text-center">Explore our plans</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[{ label: "Motor Insurance", icon: "🚗" }, { label: "Health Insurance", icon: "🏥" }, { label: "Home Insurance", icon: "🏡" }].map((p) => (
                    <div key={p.label} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                      <span className="text-3xl block mb-3">{p.icon}</span>
                      <p className="font-semibold text-[#0A2540]">{p.label}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
