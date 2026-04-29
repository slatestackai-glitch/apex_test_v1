"use client";

import { CircleCheck, Gauge, ListChecks } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Table } from "@/components/ui/Table";
import { Textarea } from "@/components/ui/Textarea";
import {
  FieldMappingRow,
  JourneyTemplate,
  QualificationOverrideInput,
} from "@/lib/projectSchema";

export type QualificationOverride = QualificationOverrideInput;

export function getDefaultQualificationOverride(journey: JourneyTemplate): QualificationOverride {
  if (journey.id === "insurance-get-quote") {
    return {
      threshold: 70,
      crmEvent: "qualified_quote_lead",
      handoffDestination: "Engati CRM + WhatsApp Business",
      consentRequired: true,
      scoreModel: [
        { label: "Intent selected", points: 20 },
        { label: "Product type selected", points: 20 },
        { label: "Product-specific detail captured", points: 20 },
        { label: "City/location captured", points: 10 },
        { label: "Phone captured", points: 20 },
        { label: "Consent captured", points: 10 },
      ],
      humanHandoffTriggers:
        "Regulated advice request\nDispute resolution request\nClaim rejection explanation\nComplaint handling",
    };
  }

  return {
    threshold: 70,
    crmEvent: journey.crmEvent,
    handoffDestination: "Engati CRM",
    consentRequired: true,
    scoreModel: [
      { label: "Intent selected", points: 25 },
      { label: "Required context captured", points: 25 },
      { label: "Contact captured", points: 30 },
      { label: "Consent captured", points: 20 },
    ],
    humanHandoffTriggers: "Regulated advice request\nSensitive action request\nComplaint escalation",
  };
}

function toSnakeCase(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function detectPiiLevel(field: string): "Low" | "Medium" | "High" {
  const normalized = field.toLowerCase();
  if (normalized.includes("phone") || normalized.includes("email")) return "Medium";
  if (normalized.includes("policy number") || normalized.includes("registration")) return "Medium";
  return "Low";
}

function getValidationHint(field: string) {
  const normalized = field.toLowerCase();
  if (normalized.includes("phone")) return "Valid mobile format";
  if (normalized.includes("email")) return "Valid email format";
  if (normalized.includes("consent")) return "Explicit yes";
  if (normalized.includes("date")) return "Valid date format";
  return "Required by journey criteria";
}

function getFieldMappingRows(journey: JourneyTemplate): FieldMappingRow[] {
  if (journey.id === "insurance-get-quote") {
    return [
      {
        apexField: "Product Type",
        required: "Yes",
        piiLevel: "Low",
        validation: "Must match allowed product",
        crmField: "lead_product_type",
        whatsappField: "product_type",
        notes: "Used for quote routing",
      },
      {
        apexField: "City / Location",
        required: "Yes",
        piiLevel: "Low",
        validation: "City string",
        crmField: "lead_city",
        whatsappField: "city",
        notes: "Used for advisor routing",
      },
      {
        apexField: "Phone Number",
        required: "Yes",
        piiLevel: "Medium",
        validation: "Valid mobile format",
        crmField: "lead_phone",
        whatsappField: "phone",
        notes: "Required for callback/handoff",
      },
      {
        apexField: "Consent",
        required: "Yes",
        piiLevel: "Low",
        validation: "Explicit yes",
        crmField: "consent_flag",
        whatsappField: "consent",
        notes: "Block handoff if missing",
      },
    ];
  }

  const requiredRows = journey.requiredFields.map((field, index) => ({
    apexField: field,
    required: "Yes" as const,
    piiLevel: detectPiiLevel(field),
    validation: getValidationHint(field),
    crmField: `required_${toSnakeCase(field) || `field_${index + 1}`}`,
    whatsappField: toSnakeCase(field) || `field_${index + 1}`,
    notes: "Required before qualification threshold",
  }));

  const optionalRows = journey.optionalFields.map((field, index) => ({
    apexField: field,
    required: "No" as const,
    piiLevel: detectPiiLevel(field),
    validation: "Optional",
    crmField: `optional_${toSnakeCase(field) || `field_${index + 1}`}`,
    whatsappField: toSnakeCase(field) || `optional_${index + 1}`,
    notes: "Capture only when user provides",
  }));

  return [...requiredRows, ...optionalRows];
}

export function LeadQualificationStep({
  journeys,
  overrides,
  onOverride,
  isAdvanced = true,
}: {
  journeys: JourneyTemplate[];
  overrides: Record<string, QualificationOverride>;
  onOverride: (journeyId: string, value: QualificationOverride) => void;
  isAdvanced?: boolean;
}) {
  if (journeys.length === 0) {
    return (
      <Card>
        <h2 className="text-xl font-semibold">Lead Qualification Logic</h2>
        <p className="mt-2 text-sm text-[var(--apex-text-secondary)]">Select at least one journey to configure qualification logic.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-xl font-semibold">Lead Qualification Logic</h2>
        <p className="text-sm text-[var(--apex-text-secondary)]">
          Define when a visitor becomes a qualified, handoff-ready lead.
        </p>
      </Card>

      {journeys.map((journey) => {
        const value = overrides[journey.id] ?? getDefaultQualificationOverride(journey);
        const scoreTotal = value.scoreModel.reduce((sum, item) => sum + item.points, 0);
        const fieldMappingRows = getFieldMappingRows(journey);

        return (
          <Card key={journey.id} className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold">{journey.name}</h3>
              <Badge variant="info">Qualification builder</Badge>
              {!isAdvanced && <Badge variant="simulated">Defaults applied — Advanced mode to override</Badge>}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-3">
                <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3">
                  <p className="text-xs font-semibold text-[var(--apex-text-secondary)]">Lead stages</p>
                  <ol className="mt-2 grid gap-2 text-sm">
                    {(journey.id === "insurance-get-quote"
                      ? [
                          "Visitor",
                          "Intent detected",
                          "Product selected",
                          "Product detail captured",
                          "Contact captured",
                          "Consent captured",
                          "Qualified lead",
                          "Handoff completed",
                        ]
                      : [
                          "Visitor",
                          "Intent detected",
                          "Context captured",
                          "Contact captured",
                          "Consent captured",
                          "Qualified lead",
                          "Handoff completed",
                        ]
                    ).map((stage, index) => (
                      <li key={stage} className="flex items-center gap-2">
                        <CircleCheck className="h-4 w-4 text-[var(--apex-blue)]" />
                        <span>
                          {index + 1}. {stage}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                {isAdvanced ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="space-y-1 text-sm">
                      <span className="font-medium">Qualified threshold</span>
                      <Input
                        type="number"
                        value={value.threshold}
                        onChange={(event) =>
                          onOverride(journey.id, {
                            ...value,
                            threshold: Number(event.target.value) || 0,
                          })
                        }
                      />
                    </label>

                    <label className="space-y-1 text-sm">
                      <span className="font-medium">CRM event</span>
                      <Input
                        value={value.crmEvent}
                        onChange={(event) =>
                          onOverride(journey.id, {
                            ...value,
                            crmEvent: event.target.value,
                          })
                        }
                      />
                    </label>

                    <label className="space-y-1 text-sm sm:col-span-2">
                      <span className="font-medium">Handoff destination</span>
                      <Input
                        value={value.handoffDestination}
                        onChange={(event) =>
                          onOverride(journey.id, {
                            ...value,
                            handoffDestination: event.target.value,
                          })
                        }
                      />
                    </label>

                    <label className="flex items-center gap-2 rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] px-3 py-2 text-sm sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={value.consentRequired}
                        onChange={(event) =>
                          onOverride(journey.id, {
                            ...value,
                            consentRequired: event.target.checked,
                          })
                        }
                      />
                      Consent required before CRM/WhatsApp handoff
                    </label>

                    <label className="space-y-1 text-sm sm:col-span-2">
                      <span className="font-medium">Human handoff trigger list</span>
                      <Textarea
                        value={value.humanHandoffTriggers}
                        onChange={(event) =>
                          onOverride(journey.id, {
                            ...value,
                            humanHandoffTriggers: event.target.value,
                          })
                        }
                      />
                    </label>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3 text-sm space-y-1">
                    <div className="flex gap-2"><span className="text-[var(--apex-text-secondary)]">Threshold:</span><span className="font-semibold">{value.threshold} pts</span></div>
                    <div className="flex gap-2"><span className="text-[var(--apex-text-secondary)]">CRM event:</span><code className="text-[var(--apex-blue)]">{value.crmEvent}</code></div>
                    <div className="flex gap-2"><span className="text-[var(--apex-text-secondary)]">Handoff:</span><span>{value.handoffDestination}</span></div>
                    <div className="flex gap-2"><span className="text-[var(--apex-text-secondary)]">Consent required:</span><span className="font-semibold">{value.consentRequired ? "Yes" : "No"}</span></div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-[var(--apex-border)] p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Gauge className="h-4 w-4 text-[var(--apex-blue)]" />
                    Score model ({scoreTotal} points)
                  </div>

                  {isAdvanced ? (
                    <div className="mt-2 space-y-2">
                      {value.scoreModel.map((scoreItem, index) => (
                        <div key={`${journey.id}-${scoreItem.label}`} className="grid grid-cols-[minmax(0,1fr)_80px] gap-2">
                          <Input
                            value={scoreItem.label}
                            onChange={(event) => {
                              const nextModel = [...value.scoreModel];
                              nextModel[index] = { ...nextModel[index], label: event.target.value };
                              onOverride(journey.id, { ...value, scoreModel: nextModel });
                            }}
                          />
                          <Input
                            type="number"
                            value={scoreItem.points}
                            onChange={(event) => {
                              const nextModel = [...value.scoreModel];
                              nextModel[index] = {
                                ...nextModel[index],
                                points: Number(event.target.value) || 0,
                              };
                              onOverride(journey.id, { ...value, scoreModel: nextModel });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 space-y-1 text-sm text-[var(--apex-text-secondary)]">
                      {value.scoreModel.map((item) => (
                        <div key={item.label} className="flex justify-between">
                          <span>{item.label}</span>
                          <span className="font-semibold">{item.points} pts</span>
                        </div>
                      ))}
                      <p className="mt-1 text-xs">Total: {scoreTotal} pts. Threshold: {value.threshold}.</p>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3">
                  <p className="text-xs font-semibold text-[var(--apex-text-secondary)]">Fallback rules</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--apex-text-secondary)]">
                    <li>If phone missing, continue journey but mark as partial lead.</li>
                    <li>If consent missing, do not push to CRM or WhatsApp.</li>
                    <li>If API fails, queue lead and notify sales owner.</li>
                    <li>If required field is incomplete, ask one clarification question before fallback.</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3">
                  <p className="text-xs font-semibold text-[var(--apex-text-secondary)]">Operational impact</p>
                  <p className="mt-2 text-sm text-[var(--apex-text-secondary)]">
                    This configuration directly updates the implementation brief, CRM event mapping, analytics trigger
                    definition, and PDF qualification section.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <ListChecks className="h-4 w-4 text-[var(--apex-blue)]" />
                Field mapping table
              </div>
              <Table
                headers={["APEX Field", "Required", "PII Level", "Validation", "CRM Field", "WhatsApp Field", "Notes"]}
                rows={fieldMappingRows.map((row) => [
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
          </Card>
        );
      })}
    </div>
  );
}
