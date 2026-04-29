import { CircleAlert, CircleCheckBig } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { ApexProject } from "@/lib/projectSchema";

export function ProductionReadiness({ project }: { project: ApexProject }) {
  return (
    <Card>
      <h3 className="text-base font-semibold">Production Readiness</h3>
      <div className="mt-3 space-y-2">
        {project.productionReadiness.map((item) => {
          const ready = item.status === "Ready for demo";

          return (
            <div
              key={item.id}
              className={`rounded-xl border px-3 py-2 text-sm ${
                ready ? "border-[#c8efda] bg-[#f3fbf7]" : "border-[#f5e7c4] bg-[#fff9ee]"
              }`}
            >
              <div className="flex items-center gap-2 font-medium">
                {ready ? (
                  <CircleCheckBig className="h-4 w-4 text-[var(--apex-success)]" />
                ) : (
                  <CircleAlert className="h-4 w-4 text-[var(--apex-warning)]" />
                )}
                <span>{item.label}</span>
                <span className="ml-auto text-xs text-[var(--apex-text-secondary)]">{item.status}</span>
              </div>
              <p className="mt-1 text-xs text-[var(--apex-text-secondary)]">
                Owner: {item.owner} | Dependency: {item.dependency}
              </p>
              <p className="mt-1 text-xs text-[var(--apex-text-secondary)]">Mitigation: {item.mitigation}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
