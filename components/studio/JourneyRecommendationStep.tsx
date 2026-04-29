"use client";

import { ArrowDown, ArrowUp, CircleCheck, Layers, Link2, Sparkles, ToggleLeft, ToggleRight } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { industryById } from "@/lib/industries";
import { Phase, StudioInput } from "@/lib/projectSchema";

export function JourneyRecommendationStep({
  value,
  onToggleJourney,
  onPhaseChange,
  onMoveJourney,
}: {
  value: StudioInput;
  onToggleJourney: (journeyId: string) => void;
  onPhaseChange: (journeyId: string, phase: Phase) => void;
  onMoveJourney: (journeyId: string, direction: "up" | "down") => void;
}) {
  const industry = industryById[value.industry];
  const selectedSet = new Set(value.selectedJourneyIds);
  const selectedJourneys = value.selectedJourneyIds
    .map((id) => industry.journeys.find((journey) => journey.id === id))
    .filter((journey): journey is NonNullable<typeof journey> => Boolean(journey));

  const phase1Count = selectedJourneys.filter((journey) => value.journeyPhases[journey.id] === "Phase 1").length;
  const phase2Count = selectedJourneys.filter((journey) => value.journeyPhases[journey.id] === "Phase 2").length;

  const estimatedComplexity = selectedJourneys.reduce((total, journey) => {
    if (journey.complexity === "High") return total + 3;
    if (journey.complexity === "Medium") return total + 2;
    return total + 1;
  }, 0);

  const integrationDependencies = new Set(selectedJourneys.flatMap((journey) => journey.productionDependencies));
  const handoffChannels = new Set(selectedJourneys.flatMap((journey) => journey.handoff));

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Card>
        <h2 className="text-xl font-semibold">Recommended Conversion Journeys</h2>
        <p className="text-sm text-[var(--apex-text-secondary)]">
          APEX recommends journeys based on industry, business goal, and simulated page analysis.
        </p>

        <div className="mt-4 space-y-3">
          {industry.journeys.map((journey) => {
            const selected = selectedSet.has(journey.id);
            const phase = value.journeyPhases[journey.id] ?? journey.phase;

            return (
              <details
                key={journey.id}
                open={selected || journey.id === "insurance-get-quote"}
                className="rounded-2xl border border-[var(--apex-border)] bg-white"
              >
                <summary className="list-none cursor-pointer px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        onToggleJourney(journey.id);
                      }}
                      className="mr-1"
                    >
                      {selected ? (
                        <ToggleRight className="h-5 w-5 text-[var(--apex-blue)]" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-slate-400" />
                      )}
                    </button>
                    <span className="text-sm font-semibold">{journey.name}</span>
                    <Badge variant="info">{journey.suggestedMode}</Badge>
                    <Badge>{journey.complexity}</Badge>
                    <Badge>{journey.feasibility} feasibility</Badge>
                    {journey.id === "insurance-get-quote" ? <Badge variant="success">Hero journey</Badge> : null}
                    <span className="ml-auto text-xs text-[var(--apex-text-secondary)]">{selected ? "Included" : "Not selected"}</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--apex-text-secondary)]">{journey.intent}</p>
                </summary>

                <div className="border-t border-[var(--apex-border)] px-4 py-3 text-sm">
                  <div className="grid gap-3 lg:grid-cols-2">
                    <Detail label="User problem" value={journey.userProblem} />
                    <Detail label="Business value" value={journey.businessValue} />
                    <Detail label="Why recommended" value={journey.whyRecommended} />
                    <Detail label="Qualification trigger" value={journey.qualificationCriteria.join(", ")} />
                    <Detail label="CRM event" value={journey.crmEvent} />
                    <Detail label="Required fields" value={journey.requiredFields.join(", ")} />
                    <Detail label="Production dependencies" value={journey.productionDependencies.join(", ")} />
                  </div>

                  <div className="mt-3 grid gap-2 rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3">
                    <p className="text-xs font-medium text-[var(--apex-text-secondary)]">Sample conversation</p>
                    {journey.sampleConversation.map((line) => (
                      <p key={line} className="text-sm">
                        {line}
                      </p>
                    ))}
                  </div>

                  <div className="mt-3 rounded-xl border border-[var(--apex-border)] bg-white p-3">
                    <p className="text-xs font-medium text-[var(--apex-text-secondary)]">Sample handoff payload</p>
                    <pre className="mt-2 overflow-x-auto rounded-lg bg-[#0a2540] p-2 text-xs text-white">
{JSON.stringify(journey.samplePayload, null, 2)}
                    </pre>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <label className="text-xs text-[var(--apex-text-secondary)]">Recommended phase:</label>
                    <Select
                      className="h-8 w-[120px]"
                      value={phase}
                      onChange={(event) => onPhaseChange(journey.id, event.target.value as Phase)}
                    >
                      <option value="Phase 1">Phase 1</option>
                      <option value="Phase 2">Phase 2</option>
                    </Select>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMoveJourney(journey.id, "up")}
                      disabled={!selected}
                    >
                      <ArrowUp className="h-4 w-4" />
                      Move up
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMoveJourney(journey.id, "down")}
                      disabled={!selected}
                    >
                      <ArrowDown className="h-4 w-4" />
                      Move down
                    </Button>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </Card>

      <div className="space-y-4">
        <Card>
          <h3 className="text-base font-semibold">Scope Impact</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--apex-text-secondary)]">
            <li className="flex items-center gap-2">
              <CircleCheck className="h-4 w-4 text-[var(--apex-blue)]" />
              Phase 1 journeys selected: {phase1Count}
            </li>
            <li className="flex items-center gap-2">
              <CircleCheck className="h-4 w-4 text-[var(--apex-blue)]" />
              Phase 2 journeys selected: {phase2Count}
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--apex-blue)]" />
              Estimated complexity score: {estimatedComplexity}
            </li>
            <li className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-[var(--apex-blue)]" />
              Integrations needed: {handoffChannels.size}
            </li>
            <li className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[var(--apex-blue)]" />
              Analytics events generated: {14 + selectedJourneys.length * 2}
            </li>
          </ul>

          <div className="mt-3 rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3">
            <p className="text-xs font-medium text-[var(--apex-text-secondary)]">Output sections affected</p>
            <p className="mt-1 text-sm">PDF, demo website, qualification logic, implementation brief, analytics plan, integration plan.</p>
          </div>

          <div className="mt-3 rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3">
            <p className="text-xs font-medium text-[var(--apex-text-secondary)]">Production blockers introduced</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-[var(--apex-text-secondary)]">
              {[...integrationDependencies].slice(0, 5).map((dependency) => (
                <li key={dependency}>{dependency}</li>
              ))}
              {integrationDependencies.size === 0 ? <li>No new blockers in selected scope.</li> : null}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-2">
      <p className="text-xs font-medium text-[var(--apex-text-secondary)]">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}
