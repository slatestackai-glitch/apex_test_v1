"use client";

import { CheckCircle2, Circle, CircleDot, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { ConversationSession } from "@/lib/conversation/types";

function maskPhone(value: string) {
  if (!value) return null;
  const n = value.replace(/\s+/g, "");
  if (n.length < 4) return "***";
  return `${n.slice(0, 3)}••••${n.slice(-2)}`;
}

export function OutcomePanel({ session }: { session: ConversationSession }) {
  const fields = session.capturedFields;
  const isQualified = session.qualificationReady;
  const isHandoffReady = session.handoffReady;

  const capturedList = [
    { label: "Journey", value: String(fields.journey || ""), done: Boolean(fields.journey) },
    { label: "Product", value: String(fields.productType || ""), done: Boolean(fields.productType) },
    { label: "City", value: String(fields.city || ""), done: Boolean(fields.city) },
    { label: "Phone", value: maskPhone(String(fields.phone || "")) ?? "", done: Boolean(fields.phone) },
    { label: "Consent", value: fields.consent ? "Captured" : "", done: Boolean(fields.consent) },
  ];

  const filledCount = capturedList.filter((f) => f.done).length;

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto">
      {/* Lead score */}
      <div className="rounded-2xl border border-[var(--apex-border)] bg-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-[var(--apex-blue)]" />
            <span className="text-xs font-semibold text-[var(--apex-text-secondary)]">Lead score</span>
          </div>
          <span className="text-xs text-[var(--apex-text-secondary)]">Threshold: 70</span>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-3xl font-bold text-[var(--apex-text-primary)]">{session.leadScore}</span>
          <span className="text-sm text-[var(--apex-text-secondary)] mb-1">/100</span>
          {isQualified && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#e8f8ef] px-2.5 py-0.5 text-[10px] font-bold text-[var(--apex-success)]">
              <CheckCircle2 className="h-3 w-3" />
              Qualified
            </span>
          )}
        </div>
        <div className="h-2 rounded-full bg-[var(--apex-section-bg)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${session.leadScore}%`,
              background:
                session.leadScore >= 70
                  ? "var(--apex-success)"
                  : session.leadScore >= 40
                    ? "var(--apex-warning)"
                    : "var(--apex-blue)",
            }}
          />
        </div>
      </div>

      {/* Captured fields */}
      <div className="rounded-2xl border border-[var(--apex-border)] bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[var(--apex-blue)]" />
            <span className="text-xs font-semibold text-[var(--apex-text-secondary)]">Captured fields</span>
          </div>
          <span className="text-[10px] font-medium text-[var(--apex-text-secondary)]">{filledCount}/{capturedList.length}</span>
        </div>
        <div className="space-y-2">
          {capturedList.map((f) => (
            <div key={f.label} className="flex items-center gap-2">
              {f.done ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--apex-success)]" />
              ) : (
                <Circle className="h-3.5 w-3.5 shrink-0 text-[var(--apex-border)]" />
              )}
              <span className="text-xs text-[var(--apex-text-secondary)] w-14 shrink-0">{f.label}</span>
              {f.done && (
                <span className="text-xs font-medium text-[var(--apex-text-primary)] truncate">{f.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Handoff status */}
      <div
        className={`rounded-2xl border p-4 ${
          isHandoffReady
            ? "border-[#c8efda] bg-[#f3fbf7]"
            : isQualified
              ? "border-[#fde68a] bg-[#fffbeb]"
              : "border-[var(--apex-border)] bg-white"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Zap className="h-4 w-4 text-[var(--apex-text-secondary)]" />
          <span className="text-xs font-semibold text-[var(--apex-text-secondary)]">Handoff status</span>
        </div>

        {[
          { label: "CRM event", value: "qualified_quote_lead", done: isQualified },
          { label: "Engati CRM", value: session.crmPushed ? "Simulated" : "Pending", done: session.crmPushed },
          { label: "WhatsApp", value: isHandoffReady ? "Ready" : "Pending", done: isHandoffReady },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 mt-1.5">
            {item.done ? (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--apex-success)]" />
            ) : (
              <CircleDot className="h-3.5 w-3.5 shrink-0 text-slate-300" />
            )}
            <span className="text-xs text-[var(--apex-text-secondary)]">{item.label}</span>
            <span className={`ml-auto text-xs font-medium ${item.done ? "text-[var(--apex-success)]" : "text-[var(--apex-text-secondary)]"}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* CRM payload when handoff ready */}
      {isHandoffReady && (
        <div className="rounded-2xl border border-[var(--apex-border)] bg-[#0a2540] p-4">
          <p className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wide mb-2">CRM Payload Preview</p>
          <pre className="text-[10px] text-[#7dd3fc] leading-relaxed overflow-x-auto">
{JSON.stringify(
  {
    event: "qualified_quote_lead",
    journey: fields.journey,
    productType: fields.productType,
    city: fields.city,
    leadScore: session.leadScore,
    consent: true,
    handoff: ["Engati CRM", "WhatsApp Business"],
  },
  null,
  2
)}
          </pre>
        </div>
      )}
    </div>
  );
}
