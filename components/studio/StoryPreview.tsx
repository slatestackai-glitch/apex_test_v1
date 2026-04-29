import { CheckCircle2, CircleDot, FileText, Layers, Monitor, Sparkles } from "lucide-react";

import { industryById } from "@/lib/industries";
import { StudioInput } from "@/lib/projectSchema";

export function StoryPreview({ draft }: { draft: StudioInput }) {
  const industry = industryById[draft.industry];
  const selectedJourneys = draft.selectedJourneyIds
    .map((id) => industry.journeys.find((j) => j.id === id))
    .filter(Boolean);

  const items = [
    {
      icon: CircleDot,
      label: "Client",
      value: draft.clientName || "Not set",
      ready: Boolean(draft.clientName),
    },
    {
      icon: Layers,
      label: "Journeys",
      value: selectedJourneys.length > 0 ? `${selectedJourneys.length} selected` : "None selected",
      ready: selectedJourneys.length > 0,
    },
    {
      icon: Monitor,
      label: "Mode",
      value: draft.selectedModeIds.length > 0 ? `${draft.selectedModeIds.length} mode${draft.selectedModeIds.length > 1 ? "s" : ""} — primary: ${draft.selectedPrimaryMode}` : "None selected",
      ready: draft.selectedModeIds.length > 0,
    },
    {
      icon: Sparkles,
      label: "Assistant",
      value: draft.brand.assistantName || "Not set",
      ready: Boolean(draft.brand.assistantName),
    },
    {
      icon: FileText,
      label: "Knowledge",
      value: draft.knowledgeSources.length > 0 ? `${draft.knowledgeSources.length} source${draft.knowledgeSources.length > 1 ? "s" : ""}` : "None",
      ready: draft.knowledgeSources.length > 0,
    },
  ];

  const readyCount = items.filter((i) => i.ready).length;
  const allReady = readyCount === items.length;

  return (
    <div className="sticky top-4 flex flex-col gap-3">
      {/* Story summary */}
      <div className="rounded-2xl border border-[var(--apex-border)] bg-white p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)] mb-3">
          Your demo story
        </p>
        <div className="flex flex-col gap-2">
          {items.map(({ icon: Icon, label, value, ready }) => (
            <div key={label} className="flex items-start gap-2.5">
              {ready ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--apex-success)] mt-0.5" />
              ) : (
                <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-slate-200 mt-0.5" />
              )}
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-[var(--apex-text-secondary)] uppercase tracking-wide">{label}</p>
                <p className={`text-xs font-medium truncate ${ready ? "text-[var(--apex-text-primary)]" : "text-slate-400"}`}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Readiness */}
      <div className={`rounded-2xl border p-4 ${allReady ? "border-[#c8efda] bg-[#f3fbf7]" : "border-[var(--apex-border)] bg-[var(--apex-section-bg)]"}`}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-[var(--apex-text-secondary)]">Package readiness</p>
          <span className={`text-xs font-bold ${allReady ? "text-[var(--apex-success)]" : "text-[var(--apex-text-secondary)]"}`}>
            {readyCount}/{items.length}
          </span>
        </div>
        <div className="h-1.5 bg-white rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(readyCount / items.length) * 100}%`,
              background: allReady ? "var(--apex-success)" : "var(--apex-blue)",
            }}
          />
        </div>
        <p className="mt-2 text-[11px] text-[var(--apex-text-secondary)]">
          {allReady
            ? "All sections configured — ready to generate."
            : `Complete ${items.length - readyCount} more section${items.length - readyCount > 1 ? "s" : ""} to unlock generation.`}
        </p>
      </div>

      {/* What gets generated */}
      <div className="rounded-2xl border border-[var(--apex-border)] bg-white p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)] mb-3">
          What&apos;s generated
        </p>
        <div className="flex flex-col gap-1.5">
          {[
            "Journey recommendations",
            "Lead qualification logic",
            "Interactive demo (Overlay, Assist, Page)",
            "Analytics event plan",
            "Integration readiness plan",
            "Implementation brief",
            "Downloadable PDF mind map",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-[var(--apex-text-secondary)]">
              <div className="w-1 h-1 rounded-full bg-[var(--apex-blue)] shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
