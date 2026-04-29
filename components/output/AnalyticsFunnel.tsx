import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { ApexProject } from "@/lib/projectSchema";

const groups = ["Discovery", "Journey", "Qualification", "Handoff", "Fallback"] as const;

export function AnalyticsFunnel({ project }: { project: ApexProject }) {
  return (
    <Card>
      <h3 className="text-base font-semibold">Analytics Event Plan</h3>
      <p className="text-sm text-[var(--apex-text-secondary)]">
        Conversion funnel instrumentation grouped by discovery, journey, qualification, handoff, and fallback behavior.
      </p>

      <div className="mt-3 space-y-4">
        {groups.map((group) => {
          const events = project.analyticsEvents.filter((event) => event.group === group);

          return (
            <div key={group}>
              <h4 className="mb-2 text-sm font-semibold">{group}</h4>
              <Table
                headers={["Event", "Trigger", "Properties", "Business purpose", "Priority", "Owner"]}
                rows={events.map((event) => [
                  event.name,
                  event.trigger,
                  event.properties.join(", "),
                  event.businessPurpose,
                  event.priority,
                  event.owner,
                ])}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
