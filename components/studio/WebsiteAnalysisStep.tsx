"use client";

import { CheckCircle2, Circle, LoaderCircle, PlayCircle } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { industryById } from "@/lib/industries";
import { StudioInput } from "@/lib/projectSchema";

const stages = [
  "Reading page structure",
  "Detecting primary CTAs",
  "Identifying field friction",
  "Mapping user intents",
  "Matching Engati journey patterns",
  "Recommending APEX modes",
  "Preparing journey map",
];

export type AnalysisState = "idle" | "running" | "done";

export function WebsiteAnalysisStep({
  value,
  analysisState,
  activeStage,
  onRunAnalysis,
}: {
  value: StudioInput;
  analysisState: AnalysisState;
  activeStage: number;
  onRunAnalysis: () => void;
}) {
  const industry = industryById[value.industry];

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Simulated Website Analysis</h2>
            <p className="text-sm text-[var(--apex-text-secondary)]">
              APEX analyzes the page context, identifies likely conversion friction, and matches it against Engati journey patterns.
            </p>
          </div>
          <Badge variant="simulated">Prototype mode: simulated analysis</Badge>
        </div>

        <div className="mt-4 grid gap-3 rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-4 sm:grid-cols-2">
          <p className="text-sm"><span className="font-medium">Client:</span> {value.clientName}</p>
          <p className="text-sm"><span className="font-medium">Industry:</span> {industry.name}</p>
          <p className="text-sm"><span className="font-medium">Website:</span> {value.websiteUrl}</p>
          <p className="text-sm"><span className="font-medium">Page:</span> {value.pageUrl}</p>
          <p className="text-sm sm:col-span-2"><span className="font-medium">Goal:</span> {value.businessGoal}</p>
        </div>

        <div className="mt-4">
          <Button onClick={onRunAnalysis} disabled={analysisState === "running"}>
            <PlayCircle className="h-4 w-4" />
            {analysisState === "idle" ? "Analyze Page" : analysisState === "running" ? "Analyzing..." : "Run Again"}
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold">Analysis stages</h3>
        <div className="mt-3 space-y-2">
          {stages.map((stage, index) => {
            const completed = analysisState === "done" || (analysisState === "running" && index < activeStage);
            const current = analysisState === "running" && index === activeStage;

            return (
              <div key={stage} className="flex items-center gap-2 rounded-xl border border-[var(--apex-border)] p-2 text-sm">
                {completed ? (
                  <CheckCircle2 className="h-4 w-4 text-[var(--apex-success)]" />
                ) : current ? (
                  <LoaderCircle className="h-4 w-4 animate-spin text-[var(--apex-blue)]" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-400" />
                )}
                <span>{stage}</span>
                <span className="ml-auto text-xs text-[var(--apex-text-secondary)]">
                  {completed ? "Completed" : current ? "Running" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {analysisState === "done" ? (
        <Card>
          <h3 className="text-base font-semibold">Detected analysis summary</h3>
          <p className="mt-2 text-sm"><span className="font-medium">Detected page type:</span> {value.industry === "insurance" ? "Insurance product / quote landing page" : `${industry.name} conversion landing page`}</p>

          {value.industry === "insurance" ? (
            <>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold">Likely conversion friction</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--apex-text-secondary)]">
                    <li>Quote and renewal intent may be mixed.</li>
                    <li>Contact capture likely happens before intent clarity.</li>
                    <li>Users may face too many fields before understanding product fit.</li>
                    <li>Advisor callback is not surfaced early enough.</li>
                    <li>WhatsApp continuation is not used as a structured handoff.</li>
                    <li>Form-only submission delays CRM-ready qualification.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Recommended APEX strategy</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--apex-text-secondary)]">
                    <li>Use APEX Overlay as the fastest conversion layer over the native page.</li>
                    <li>Use APEX Assist to show before/after friction reduction.</li>
                    <li>Use APEX Page for campaign or microsite journeys.</li>
                    <li>Start Phase 1 with Quote, Renewal, and Advisor Callback.</li>
                    <li>Use progressive qualification before requesting unnecessary fields.</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Metric label="Intent clarity opportunity" value="High" />
                <Metric label="Qualification opportunity" value="High" />
                <Metric label="Phase 1 feasibility" value="High" />
                <Metric label="Integration complexity" value="Medium" />
                <Metric label="Compliance sensitivity" value="Medium" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {[
                  "Simulated page-structure signal",
                  "Engati journey patterns",
                  "Industry benchmark patterns",
                  "Recommended Phase 1 scope",
                ].map((source) => (
                  <Badge key={source}>{source}</Badge>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm text-[var(--apex-text-secondary)]">
              Analysis completed with simulated confidence scoring and recommended phase split for {industry.name} journeys.
            </p>
          )}
        </Card>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3">
      <p className="text-xs text-[var(--apex-text-secondary)]">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
