"use client";

import { useState } from "react";

import { SendHorizonal } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ApexProject } from "@/lib/projectSchema";

export function IntegrationPlan({ project }: { project: ApexProject }) {
  const [result, setResult] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);

  async function simulate(integrationId: string) {
    setLoading(integrationId);

    try {
      const response = await fetch(`/api/projects/${project.id}/simulate-payload`, {
        method: "POST",
      });
      const payload = (await response.json()) as {
        status: string;
        validation: string;
        simulatedPush: string;
        fallback: string;
      };

      setResult((previous) => ({
        ...previous,
        [integrationId]: `${payload.status} • ${payload.validation} • ${payload.simulatedPush} • fallback ${payload.fallback}`,
      }));
    } catch {
      setResult((previous) => ({
        ...previous,
        [integrationId]: "Payload simulation failed",
      }));
    } finally {
      setLoading(null);
    }
  }

  return (
    <Card>
      <h3 className="text-base font-semibold">Integration Plan</h3>
      <p className="text-sm text-[var(--apex-text-secondary)]">
        Integration readiness includes simulated payload validation and production dependency visibility.
      </p>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {project.integrations.map((integration) => (
          <div key={integration.id} className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold">{integration.name}</h4>
              <Badge variant="simulated">{integration.simulated ? "Demo simulated" : "Live"}</Badge>
              <Badge>{integration.readinessStatus}</Badge>
            </div>

            <ul className="mt-2 space-y-1 text-xs text-[var(--apex-text-secondary)]">
              <li><span className="font-medium">Required for production:</span> {integration.requiredForProduction ? "Yes" : "No"}</li>
              <li><span className="font-medium">Credentials needed:</span> {integration.credentialsNeeded.join(", ") || "None"}</li>
              <li><span className="font-medium">Field mapping:</span> {integration.fieldMappingNeeded ? "Required" : "Not required"}</li>
              <li><span className="font-medium">API docs:</span> {integration.apiDocsNeeded ? "Needed" : "Optional"}</li>
              <li><span className="font-medium">Data pushed:</span> {integration.dataPushed.join(", ")}</li>
              <li><span className="font-medium">Failure fallback:</span> {integration.failureFallback}</li>
              <li><span className="font-medium">Complexity:</span> {integration.complexity}</li>
            </ul>

            <pre className="mt-2 overflow-x-auto rounded-lg bg-white p-2 text-[11px] text-[var(--apex-text-secondary)]">
{JSON.stringify(integration.samplePayload, null, 2)}
            </pre>

            <div className="mt-2 flex items-center justify-between gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => simulate(integration.id)}
                disabled={loading === integration.id}
              >
                <SendHorizonal className="h-4 w-4" />
                {loading === integration.id ? "Simulating..." : "Simulate test payload"}
              </Button>

              <span className="text-xs text-[var(--apex-text-secondary)]">{result[integration.id] ?? "Not simulated yet"}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
