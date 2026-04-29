"use client";

import { FormEvent, useRef, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, ChevronRight, Send, Sparkles } from "lucide-react";

import { ConversationSession } from "@/lib/conversation/types";
import { cn } from "@/lib/utils";

const STATE_LABELS: Record<string, string> = {
  initial: "Starting",
  journey_selected: "Intent captured",
  product_type_selected: "Product identified",
  vehicle_detail_method_selected: "Vehicle detail",
  city_captured: "Location set",
  phone_captured: "Contact captured",
  consent_captured: "Consent recorded",
  lead_qualified: "Lead qualified",
  crm_push_simulated: "CRM pushed",
  whatsapp_handoff_ready: "Handoff ready",
};

const ORDERED_STATES = [
  "initial",
  "journey_selected",
  "product_type_selected",
  "vehicle_detail_method_selected",
  "city_captured",
  "phone_captured",
  "consent_captured",
  "lead_qualified",
  "crm_push_simulated",
  "whatsapp_handoff_ready",
];

export function GuidedConversation({
  session,
  onSend,
  onRunToFinal,
  assistantName = "Ava",
  className,
}: {
  session: ConversationSession;
  onSend: (text: string) => void;
  onRunToFinal?: () => void;
  assistantName?: string;
  className?: string;
}) {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const currentIdx = ORDERED_STATES.indexOf(session.state);
  const progress = Math.max(5, Math.round((currentIdx / (ORDERED_STATES.length - 1)) * 100));
  const isComplete = session.state === "whatsapp_handoff_ready";

  // Last assistant message
  const lastAssistant = [...session.messages].reverse().find((m) => m.role === "assistant");
  // All previous exchanges for history trail
  const historyPairs: Array<{ user: string; assistant: string }> = [];
  let i = 0;
  const msgs = session.messages;
  while (i < msgs.length - 1) {
    if (msgs[i].role === "assistant" && msgs[i + 1]?.role === "user") {
      historyPairs.push({
        assistant: msgs[i].text,
        user: msgs[i + 1].text,
      });
      i += 2;
    } else {
      i++;
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.messages.length]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <div className={cn("flex flex-col h-full min-h-0", className)}>
      {/* Progress bar */}
      <div className="mb-4 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-[var(--apex-text-secondary)]">
            {STATE_LABELS[session.state] ?? "In progress"}
          </span>
          <span className="text-xs font-semibold text-[var(--apex-blue)]">{progress}%</span>
        </div>
        <div className="h-1.5 bg-[var(--apex-section-bg)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              background: isComplete
                ? "var(--apex-success)"
                : "linear-gradient(90deg, var(--apex-blue), #3b82f6)",
            }}
          />
        </div>
      </div>

      {/* Conversation history (collapsed trail) */}
      {historyPairs.length > 0 && !isComplete && (
        <div className="mb-3 space-y-1.5 shrink-0">
          {historyPairs.map((pair, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-[var(--apex-text-secondary)]">
              <ChevronRight className="h-3 w-3 shrink-0 text-[var(--apex-blue)]" />
              <span className="truncate">{pair.user}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-0">
        {isComplete ? (
          /* ── Final success state ── */
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-[#e8f8ef] flex items-center justify-center mb-4 mx-auto">
              <CheckCircle2 className="h-8 w-8 text-[var(--apex-success)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--apex-text-primary)]">
              Qualified Quote Lead Created
            </h3>
            <p className="mt-2 text-sm text-[var(--apex-text-secondary)] max-w-xs">
              Lead score 90/100 — consent captured — CRM push simulated — WhatsApp handoff ready.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#c8efda] bg-[#f3fbf7] px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--apex-success)]" />
              <span className="text-sm font-semibold text-[var(--apex-success)]">
                CRM event: qualified_quote_lead
              </span>
            </div>
            {onRunToFinal && (
              <button
                type="button"
                onClick={() => onSend("Restart journey")}
                className="mt-5 text-xs text-[var(--apex-text-secondary)] hover:text-[var(--apex-blue)] underline underline-offset-2"
              >
                Restart from beginning
              </button>
            )}
          </div>
        ) : (
          /* ── Active question card ── */
          <div className="flex-1 flex flex-col">
            {lastAssistant && (
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[var(--apex-blue)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex-1 bg-[var(--apex-section-bg)] rounded-2xl rounded-tl-sm px-4 py-3.5">
                  <p className="text-[10px] font-semibold text-[var(--apex-text-secondary)] mb-1">{assistantName}</p>
                  <p className="text-sm font-medium text-[var(--apex-text-primary)] leading-relaxed">
                    {lastAssistant.text}
                  </p>
                </div>
              </div>
            )}

            {/* Free-text input — primary */}
            <form onSubmit={submit} className="ml-12 flex gap-2 mb-3">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tell me what you need help with today..."
                className="flex-1 rounded-xl border border-[var(--apex-border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--apex-blue)] focus:ring-2 focus:ring-[#e8f1ff] transition"
              />
              <button
                type="submit"
                className="rounded-xl bg-[var(--apex-blue)] text-white px-3 py-2 hover:bg-[#094cb0] transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            {/* Choice chips — secondary */}
            {session.chips.length > 0 && (
              <div className="ml-12">
                <p className="text-[10px] font-medium text-[var(--apex-text-secondary)] mb-1.5">Or choose an option</p>
                <div className="flex flex-wrap gap-2">
                  {session.chips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => onSend(chip)}
                      className="group inline-flex items-center gap-1.5 rounded-xl border border-[var(--apex-blue)] bg-white px-3.5 py-2 text-sm font-medium text-[var(--apex-blue)] hover:bg-[#e8f1ff] transition-colors"
                    >
                      {chip}
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Skip to final */}
      {!isComplete && onRunToFinal && (
        <div className="mt-4 pt-3 border-t border-[var(--apex-border)] shrink-0">
          <button
            type="button"
            onClick={onRunToFinal}
            className="flex items-center gap-1.5 text-xs text-[var(--apex-text-secondary)] hover:text-[var(--apex-blue)] transition-colors"
          >
            <ArrowRight className="h-3 w-3" />
            Jump to qualified lead
          </button>
        </div>
      )}
    </div>
  );
}
