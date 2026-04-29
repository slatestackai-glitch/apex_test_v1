"use client";

import { LayoutPanelTop, Layers, MonitorCog, ToggleLeft, ToggleRight } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { experienceModes } from "@/lib/experienceModes";
import { ModeId, StudioInput } from "@/lib/projectSchema";

export function ExperienceModeStep({
  value,
  onToggleMode,
  onPrimaryMode,
}: {
  value: StudioInput;
  onToggleMode: (modeId: ModeId) => void;
  onPrimaryMode: (modeId: ModeId) => void;
}) {
  const selectedModes = new Set(value.selectedModeIds);

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-xl font-semibold">APEX Experience Modes</h2>
        <p className="text-sm text-[var(--apex-text-secondary)]">
          Choose how APEX appears on the client website and how it will be demonstrated.
        </p>
      </Card>

      <div className="grid gap-3 lg:grid-cols-3">
        {experienceModes.map((mode) => {
          const selected = selectedModes.has(mode.id);
          const primary = value.selectedPrimaryMode === mode.id;

          return (
            <Card key={mode.id} className="space-y-3">
              <div className="flex items-center gap-2">
                {mode.id === "overlay" ? (
                  <LayoutPanelTop className="h-4 w-4 text-[var(--apex-blue)]" />
                ) : mode.id === "assist" ? (
                  <MonitorCog className="h-4 w-4 text-[var(--apex-blue)]" />
                ) : (
                  <Layers className="h-4 w-4 text-[var(--apex-blue)]" />
                )}
                <h3 className="text-base font-semibold">{mode.name}</h3>
                {primary ? <Badge variant="success">Primary</Badge> : null}
              </div>

              <p className="text-sm text-[var(--apex-text-secondary)]">{mode.description}</p>

              <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3 text-xs text-[var(--apex-text-secondary)]">
                <p><span className="font-semibold">Best for:</span> {mode.bestFor}</p>
                <p className="mt-1"><span className="font-semibold">Engineering effort:</span> {mode.engineeringEffort}</p>
                <p className="mt-1"><span className="font-semibold">Conversion value:</span> {mode.conversionValue}</p>
                <p className="mt-1"><span className="font-semibold">Demo strength:</span> {mode.demoStrength}</p>
                <p className="mt-1"><span className="font-semibold">Production dependency:</span> {mode.productionDependency}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleMode(mode.id)}
                  className="inline-flex items-center gap-1 rounded-xl border border-[var(--apex-border)] px-2 py-1 text-sm"
                >
                  {selected ? <ToggleRight className="h-4 w-4 text-[var(--apex-blue)]" /> : <ToggleLeft className="h-4 w-4 text-slate-400" />}
                  {selected ? "Included" : "Not included"}
                </button>

                <button
                  type="button"
                  onClick={() => onPrimaryMode(mode.id)}
                  disabled={!selected}
                  className="rounded-xl border border-[var(--apex-border)] px-2 py-1 text-sm disabled:opacity-50"
                >
                  Set primary
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <h3 className="text-base font-semibold">Mode comparison</h3>
        <Table
          headers={[
            "Mode",
            "Best for",
            "UX behavior",
            "Engineering effort",
            "Conversion value",
            "Production dependency",
            "Demo strength",
            "Recommended use case",
          ]}
          rows={experienceModes.map((mode) => [
            mode.name,
            mode.bestFor,
            mode.description,
            mode.engineeringEffort,
            mode.conversionValue,
            mode.productionDependency,
            mode.demoStrength,
            mode.recommendedUseCase,
          ])}
        />
      </Card>
    </div>
  );
}
