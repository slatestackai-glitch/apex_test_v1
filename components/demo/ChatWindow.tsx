"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import type { StoryState, StoryMessage } from "@/lib/conversation/storyFlow";

function PlanCard({ plan }: { plan: NonNullable<StoryMessage["planData"]> }) {
  return (
    <div className="mt-2 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="bg-[#0A2540] px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">{plan.tag}</span>
        <span className="text-lg font-bold text-white">{plan.price} <span className="text-xs font-normal text-blue-300">{plan.priceUnit}</span></span>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-[#0A2540] mb-2">{plan.name}</p>
        <ul className="space-y-1.5">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ConfirmCard({ data }: { data: NonNullable<StoryMessage["confirmData"]> }) {
  return (
    <div className="mt-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
          <CheckCircle2 className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0A2540]">Quote confirmed</p>
          <p className="text-xs text-gray-500">Sent to {data.phone}</p>
        </div>
      </div>
      <div className="border-t border-emerald-100 pt-3 space-y-1">
        <p className="text-xs text-gray-500">An advisor will call you <strong className="text-[#0A2540]">{data.eta}</strong></p>
        <p className="text-[11px] text-gray-400">Reference: {data.reference} · Valid 7 days</p>
      </div>
    </div>
  );
}

function TypingIndicator({ loadingText }: { loadingText: string }) {
  return (
    <div className="flex items-center gap-2 px-1">
      {loadingText ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C8102E]" />
          <span className="text-xs text-gray-500 italic">{loadingText}</span>
        </>
      ) : (
        <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-gray-100">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ChatWindow({
  state,
  onSend,
  onSendPhone,
  assistantName,
  brandColor = "#C8102E",
  compact = false,
}: {
  state: StoryState;
  onSend: (text: string) => void;
  onSendPhone: (phone: string) => void;
  assistantName: string;
  brandColor?: string;
  compact?: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [phoneInput, setPhoneInput] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages, state.isTyping]);

  function handleQuickReply(id: string, label: string) {
    if (id === "yes") {
      onSend("yes");
    } else {
      onSend(label);
    }
  }

  function handlePhoneSubmit() {
    const val = phoneInput.trim();
    if (!val) return;
    setPhoneInput("");
    onSendPhone(val);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className={cn("flex-1 overflow-y-auto space-y-3 px-4 py-4", compact ? "text-sm" : "")}>
        {state.messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[85%]", msg.role === "user" ? "items-end" : "items-start")}>
              {msg.role === "ai" && (
                <p className="text-[10px] font-semibold text-gray-400 mb-1 px-1">{assistantName}</p>
              )}
              <div
                className={cn(
                  "rounded-2xl px-3 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-[#0A2540] text-white"
                    : "bg-gray-100 text-[#0A2540]"
                )}
              >
                {msg.text}
              </div>
              {msg.card === "plan" && msg.planData && <PlanCard plan={msg.planData} />}
              {msg.card === "confirmation" && msg.confirmData && <ConfirmCard data={msg.confirmData} />}
            </div>
          </div>
        ))}

        {state.isTyping && <TypingIndicator loadingText={state.loadingText} />}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      {(state.inputMode !== "none" || state.quickReplies.length > 0) && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          {state.inputMode === "quick-replies" && (
            <div className="flex flex-wrap gap-2">
              {state.quickReplies.map((qr) => (
                <button
                  key={qr.id}
                  type="button"
                  onClick={() => handleQuickReply(qr.id, qr.label)}
                  className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-[#0A2540] hover:border-[#C8102E] hover:text-[#C8102E] transition-colors"
                >
                  {qr.label}
                </button>
              ))}
            </div>
          )}

          {state.inputMode === "phone" && (
            <div className="flex items-center gap-2">
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handlePhoneSubmit(); }}
                placeholder="+91 98765 43210"
                autoFocus
                className="flex-1 h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
              />
              <button
                type="button"
                onClick={handlePhoneSubmit}
                disabled={!phoneInput.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8102E] text-white hover:bg-[#a00d24] disabled:opacity-40 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
