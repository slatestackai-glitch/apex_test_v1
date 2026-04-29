"use client";

import { CheckCircle2, CircleDot, LoaderCircle } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StudioInput } from "@/lib/projectSchema";

const generationStages = [
  "Building journey map",
  "Creating qualification schema",
  "Preparing APEX Overlay experience",
  "Generating APEX Assist and APEX Page modes",
  "Compiling implementation brief",
  "Preparing PDF package",
  "Finalizing demo website",
];

export function ReviewGenerateStep({
  value,
  phase1Count,
  phase2Count,
  analysisDone,
  generating,
  generationStage,
}: {
  value: StudioInput;
  phase1Count: number;
  phase2Count: number;
  analysisDone: boolean;
  generating: boolean;
  generationStage: number;
}) {
  const statuses = [
    "Ready for demo",
    "Simulated only",
    "Needs client data",
    "Needs API credentials",
    "Needs compliance approval",
    "Needs WhatsApp template approval",
    "Needs CRM field mapping",
  ] as const;

  const blockers = [
    "CRM credentials",
    "CRM field mapping approval",
    "WhatsApp template approval",
    "Compliance sign-off",
  ];

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-xl font-semibold">Review & Generate</h2>
        <p className="text-sm text-[var(--apex-text-secondary)]">Review the demo package before generation.</p>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-base font-semibold">Pre-generation audit</h3>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <AuditItem label="Client context" value={`${value.clientName} (${value.industry})`} />
          <AuditItem label="Analysis summary" value={analysisDone ? "Complete" : "Pending"} />
          <AuditItem label="Selected journeys" value={`${value.selectedJourneyIds.length} journeys`} />
          <AuditItem label="Phase split" value={`Phase 1: ${phase1Count} | Phase 2: ${phase2Count}`} />
          <AuditItem label="Qualification readiness" value="Configured" />
          <AuditItem label="UI modes included" value={value.selectedModeIds.join(", ")} />
          <AuditItem label="Primary mode" value={value.selectedPrimaryMode} />
          <AuditItem label="Brand readiness" value={`${value.brand.clientName} / ${value.brand.assistantName}`} />
          <AuditItem label="Knowledge sources" value={`${value.knowledgeSources.length} selected`} />
          <AuditItem label="Actions" value={`${value.actions.length} selected`} />
          <AuditItem label="Guardrails" value={`${value.guardrailIds.length} selected`} />
          <AuditItem label="Integrations" value="Demo simulated + readiness matrix" />
          <AuditItem label="Analytics events" value="Discovery, Journey, Qualification, Handoff, Fallback" />
          <AuditItem label="Production blockers" value={blockers.join(", ")} />
        </div>

        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Badge key={status} variant={status === "Ready for demo" ? "success" : status === "Simulated only" ? "simulated" : "warning"}>
              {status}
            </Badge>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold">Generation progress</h3>
        <div className="mt-3 space-y-2">
          {generationStages.map((stage, index) => {
            const complete = generating ? index < generationStage : false;
            const running = generating && index === generationStage;

            return (
              <div key={stage} className="flex items-center gap-2 rounded-xl border border-[var(--apex-border)] px-3 py-2 text-sm">
                {complete ? (
                  <CheckCircle2 className="h-4 w-4 text-[var(--apex-success)]" />
                ) : running ? (
                  <LoaderCircle className="h-4 w-4 animate-spin text-[var(--apex-blue)]" />
                ) : (
                  <CircleDot className="h-4 w-4 text-slate-400" />
                )}
                <span>{stage}</span>
                <span className="ml-auto text-xs text-[var(--apex-text-secondary)]">
                  {complete ? "Completed" : running ? "Running" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function AuditItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3 text-sm">
      <p className="text-xs font-medium text-[var(--apex-text-secondary)]">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}
