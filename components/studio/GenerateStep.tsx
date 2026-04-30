"use client";

import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { StudioInput } from "@/lib/projectSchema";

const GENERATION_STAGES = [
  "Shaping lead definition...",
  "Building journeys...",
  "Indexing knowledge base...",
  "Configuring agent training...",
  "Preparing experience...",
  "Creating demo site...",
  "Drawing mind map...",
  "Finalising package...",
];

export function GenerateStep({
  value,
  generating,
  generationStage,
}: {
  value: StudioInput;
  generating: boolean;
  generationStage: number;
}) {
  const selectedJourneyCount = (value.selectedJourneyIds ?? []).length;
  const primaryMode = value.selectedPrimaryMode ?? "overlay";
  const modeLabel = primaryMode === "overlay" ? "APEX Overlay" : primaryMode === "assist" ? "APEX Assist" : "APEX Page";
  const mainGoal = value.mainGoal ?? value.businessGoal ?? "—";
  const leadText = value.derivedLeadText ?? value.leadDefinition?.customText ?? "Contact + intent + consent";
  const kbCount = [
    ...(value.knowledgeBaseConfig?.documents ?? []),
    ...(value.knowledgeBaseConfig?.urls ?? []),
    ...(value.knowledgeBaseConfig?.enterpriseSources ?? []),
  ].length;

  const rows = [
    { n: "1", label: "Vision", value: `${value.clientName || "Client"} · ${mainGoal}` },
    { n: "2", label: "Lead definition", value: leadText },
    { n: "3", label: "Journey", value: `${selectedJourneyCount} journey${selectedJourneyCount !== 1 ? "s" : ""} selected` },
    { n: "4", label: "Controls", value: `${kbCount} knowledge source${kbCount !== 1 ? "s" : ""}` },
    { n: "5", label: "Experience", value: modeLabel },
  ];

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#C8102E] mb-1">Step 5 — Generate</p>
        <h2 className="text-2xl font-bold text-[#0A2540]">Review and generate</h2>
        <p className="text-sm text-gray-400 mt-1">Review your configuration and generate the complete demo package.</p>
      </div>

      {!generating && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-5">Package summary</p>
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.n} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C8102E]/10">
                  <span className="text-[10px] font-bold text-[#C8102E]">{row.n}</span>
                </div>
                <div className="flex-1 flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-gray-400 w-28 shrink-0">{row.label}</span>
                  <span className="text-sm text-[#0A2540]">{row.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">What you&apos;ll receive</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                { label: "Demo site", desc: "Live interactive APEX demo" },
                { label: "Mind map", desc: "Visual journey architecture" },
                { label: "Brief", desc: "Implementation roadmap" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                  <p className="text-xs font-bold text-[#0A2540]">{item.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {generating && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <p className="text-sm font-semibold text-[#0A2540] mb-1">Generating your package…</p>
          <p className="text-xs text-gray-400 mb-5">This takes a few seconds.</p>
          <div className="space-y-3">
            {GENERATION_STAGES.map((stage, i) => {
              const done = i < generationStage;
              const active = i === generationStage;
              return (
                <div key={stage} className="flex items-center gap-3">
                  <div className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all",
                    done ? "bg-emerald-500" : active ? "bg-[#C8102E]" : "bg-gray-100")}>
                    {done ? <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      : active ? <Loader2 className="h-3 w-3 text-white animate-spin" />
                        : <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />}
                  </div>
                  <span className={cn("text-sm transition-colors",
                    done ? "text-emerald-600 line-through decoration-emerald-400"
                      : active ? "text-[#0A2540] font-medium"
                        : "text-gray-300")}>
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
