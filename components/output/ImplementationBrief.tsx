import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { ApexProject } from "@/lib/projectSchema";

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3">
      <h4 className="text-sm font-semibold">{title}</h4>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--apex-text-secondary)]">
        {items.length ? items.map((item) => <li key={item}>{item}</li>) : <li>None</li>}
      </ul>
    </div>
  );
}

export function ImplementationBrief({ project }: { project: ApexProject }) {
  const brief = project.implementationBrief;

  return (
    <Card>
      <h3 className="text-base font-semibold">Implementation Brief</h3>
      <p className="text-sm text-[var(--apex-text-secondary)]">
        Delivery-grade handoff for Engati solutioning, onboarding, and implementation teams.
      </p>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <ListSection title="1. Business Objective" items={[brief.businessObjective]} />
        <ListSection title="2. Core scope" items={brief.phase1Scope} />
        <ListSection title="3. Extended scope" items={brief.phase2Scope} />
        <ListSection title="4. Selected Journeys" items={brief.selectedJourneys.map((journey) => journey.name)} />
        <ListSection
          title="8. WhatsApp Handoff Copy"
          items={[brief.whatsappHandoffCopy]}
        />
        <ListSection title="9. Knowledge Sources Needed" items={brief.knowledgeSourcesNeeded} />
        <ListSection title="11. API Requirements" items={brief.apiRequirements} />
        <ListSection title="12. Guardrails" items={brief.guardrails} />
        <ListSection title="13. Fallback Behavior" items={brief.fallbackBehavior} />
        <ListSection title="18. Recommended Next Step" items={[brief.recommendedNextStep]} />
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-semibold">5. Lead Qualification Schema</h4>
          <Table
            headers={["Journey", "Threshold", "Required fields", "CRM Event", "Handoff"]}
            rows={brief.leadQualificationSchema.map((rule) => [
              rule.journeyName,
              String(rule.qualifiedThreshold),
              rule.requiredFields.join(", "),
              rule.crmEvent,
              rule.handoffDestinations.join(", "),
            ])}
          />
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">6. Field Mapping</h4>
          <Table
            headers={["APEX Field", "Required", "PII Level", "Validation", "CRM Field", "WhatsApp Field", "Notes"]}
            rows={brief.fieldMapping.map((row) => [
              row.apexField,
              row.required,
              row.piiLevel,
              row.validation,
              row.crmField,
              row.whatsappField,
              row.notes,
            ])}
          />
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">7. CRM Events</h4>
          <Table
            headers={["Event", "Trigger", "Required Fields", "Destination", "Failure Fallback"]}
            rows={brief.crmEvents.map((event) => [
              event.event,
              event.trigger,
              event.requiredFields.join(", "),
              event.destination,
              event.failureFallback,
            ])}
          />
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">10. Integration Dependencies</h4>
          <Table
            headers={["Integration", "Readiness", "Credentials", "Field Mapping", "Complexity"]}
            rows={brief.integrationDependencies.map((dependency) => [
              dependency.name,
              dependency.readinessStatus,
              dependency.credentialsNeeded.join(", ") || "None",
              dependency.fieldMappingNeeded ? "Yes" : "No",
              dependency.complexity,
            ])}
          />
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">14. Analytics Events</h4>
          <Table
            headers={["Event", "Trigger", "Priority"]}
            rows={brief.analyticsEvents.map((event) => [event.name, event.trigger, event.priority])}
          />
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">15. Production Readiness Checklist</h4>
          <Table
            headers={["Item", "Status", "Owner", "Dependency", "Mitigation"]}
            rows={brief.productionReadinessChecklist.map((item) => [
              item.label,
              item.status,
              item.owner,
              item.dependency,
              item.mitigation,
            ])}
          />
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">16. Risk & Dependency Matrix</h4>
          <Table
            headers={["Risk", "Impact", "Owner", "Mitigation", "Status"]}
            rows={brief.riskMatrix.map((risk) => [risk.risk, risk.impact, risk.owner, risk.mitigation, risk.status])}
          />
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">17. Open Questions</h4>
          <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--apex-text-secondary)]">
            {brief.openQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
