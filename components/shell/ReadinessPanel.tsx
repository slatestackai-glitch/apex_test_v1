import { CheckCircle2, CircleDot, Layers, Palette, ShieldCheck, WandSparkles } from "lucide-react";
import { ReactNode } from "react";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export interface ReadinessStatus {
  key: string;
  label: string;
  ready: boolean;
  detail: string;
}

export function ReadinessPanel({
  statuses,
  readyToGenerate,
}: {
  statuses: ReadinessStatus[];
  readyToGenerate: boolean;
}) {
  const iconMap: Record<string, ReactNode> = {
    client: <CircleDot className="h-4 w-4" />,
    analysis: <WandSparkles className="h-4 w-4" />,
    journeys: <Layers className="h-4 w-4" />,
    qualification: <CheckCircle2 className="h-4 w-4" />,
    modes: <Layers className="h-4 w-4" />,
    brand: <Palette className="h-4 w-4" />,
    limits: <ShieldCheck className="h-4 w-4" />,
  };

  return (
    <Card className="sticky top-4 p-4">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Demo Package Readiness</h3>
        <p className="text-xs text-[var(--apex-text-secondary)]">This panel updates as configuration becomes generation-ready.</p>
      </div>

      <div className="space-y-2">
        {statuses.map((status) => (
          <div
            key={status.key}
            className={cn(
              "rounded-xl border px-3 py-2",
              status.ready ? "border-[#c8efda] bg-[#f3fbf7]" : "border-[#f2dfb2] bg-[#fff9eb]"
            )}
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              {iconMap[status.key] ?? <CircleDot className="h-4 w-4" />}
              <span>{status.label}</span>
              <span className={cn("ml-auto text-xs", status.ready ? "text-[var(--apex-success)]" : "text-[var(--apex-warning)]")}>
                {status.ready ? "Ready" : "Pending"}
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--apex-text-secondary)]">{status.detail}</p>
          </div>
        ))}
      </div>

      <div
        className={cn(
          "mt-3 rounded-xl border px-3 py-2 text-sm",
          readyToGenerate ? "border-[#c8efda] bg-[#f3fbf7]" : "border-[var(--apex-border)] bg-[var(--apex-section-bg)]"
        )}
      >
        <p className="font-semibold">{readyToGenerate ? "Ready to generate" : "Configuration in progress"}</p>
        <p className="text-xs text-[var(--apex-text-secondary)]">
          {readyToGenerate
            ? "All critical sections are configured for a demo package build."
            : "Complete required sections to unlock the final package generation."}
        </p>
      </div>
    </Card>
  );
}
