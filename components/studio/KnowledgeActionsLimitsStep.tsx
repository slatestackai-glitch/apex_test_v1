"use client";

import { ReactNode } from "react";
import { CheckCircle2, DatabaseZap, FileWarning, Handshake, SlidersHorizontal } from "lucide-react";

import { Textarea } from "@/components/ui/Textarea";
import { actionOptions, knowledgeSourceOptions } from "@/lib/industries";
import { StudioInput } from "@/lib/projectSchema";

const DEFAULT_GUARDRAILS = [
  "Do not guarantee premium or policy approval.",
  "Do not guarantee claim settlement timelines.",
  "Do not collect OTP, PIN, password, or CVV.",
  "Do not provide regulated financial or legal advice.",
  "Capture explicit consent before CRM or WhatsApp handoff.",
  "Escalate regulated advice requests to a human advisor.",
];

function ToggleChip({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm text-left transition-colors ${
        checked
          ? "border-[var(--apex-blue)] bg-[#e8f1ff] text-[var(--apex-blue)]"
          : "border-[var(--apex-border)] bg-white text-[var(--apex-text-secondary)] hover:border-[var(--apex-blue)]/40"
      }`}
    >
      <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 ${
        checked ? "border-[var(--apex-blue)] bg-[var(--apex-blue)]" : "border-slate-300"
      }`}>
        {checked && <CheckCircle2 className="h-3 w-3 text-white" />}
      </div>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function SectionLabel({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <p className="text-sm font-semibold text-[var(--apex-text-primary)]">{label}</p>
    </div>
  );
}

export function KnowledgeActionsLimitsStep({
  value,
  onKnowledgeToggle,
  onActionToggle,
  onPromptChange,
  isAdvanced,
}: {
  value: StudioInput;
  onKnowledgeToggle: (name: string) => void;
  onActionToggle: (name: string) => void;
  onPromptChange: (field: keyof StudioInput["prompts"], text: string) => void;
  isAdvanced?: boolean;
}) {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--apex-text-primary)]">Knowledge & guardrails</h2>
        <p className="text-sm text-[var(--apex-text-secondary)] mt-1">
          Choose what APEX can answer from, what actions it can take, and where it must stop.
          All integrations are simulated in this prototype.
        </p>
      </div>

      {/* Knowledge sources */}
      <div>
        <SectionLabel
          icon={<DatabaseZap className="h-4 w-4 text-[var(--apex-blue)]" />}
          label="Knowledge sources (simulated)"
        />
        <div className="grid gap-2 sm:grid-cols-2">
          {knowledgeSourceOptions.map((option) => (
            <ToggleChip
              key={option}
              label={option}
              checked={value.knowledgeSources.includes(option)}
              onToggle={() => onKnowledgeToggle(option)}
            />
          ))}
        </div>
        <p className="mt-2 text-[11px] text-[var(--apex-text-secondary)]">
          Selected: {value.knowledgeSources.length} source{value.knowledgeSources.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Actions */}
      <div>
        <SectionLabel
          icon={<Handshake className="h-4 w-4 text-[var(--apex-blue)]" />}
          label="Actions APEX can take"
        />
        <div className="grid gap-2 sm:grid-cols-2">
          {actionOptions.map((option) => (
            <ToggleChip
              key={option}
              label={option}
              checked={value.actions.includes(option)}
              onToggle={() => onActionToggle(option)}
            />
          ))}
        </div>
        <p className="mt-2 text-[11px] text-[var(--apex-text-secondary)]">
          Selected: {value.actions.length} action{value.actions.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Guardrails — always visible, read-only in simple */}
      <div>
        <SectionLabel
          icon={<FileWarning className="h-4 w-4 text-[var(--apex-blue)]" />}
          label="Guardrails (industry defaults)"
        />
        <div className="grid gap-2 sm:grid-cols-2">
          {DEFAULT_GUARDRAILS.map((rule) => (
            <div
              key={rule}
              className="flex items-start gap-2 rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] px-3 py-2.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--apex-success)] mt-0.5" />
              <span className="text-xs text-[var(--apex-text-secondary)] leading-relaxed">{rule}</span>
            </div>
          ))}
        </div>
        {!isAdvanced && (
          <p className="mt-2 text-[11px] text-[var(--apex-text-secondary)]">
            Industry defaults applied. Enable Advanced mode to edit guardrail triggers and fallbacks.
          </p>
        )}
      </div>

      {/* Prompt settings — Advanced only */}
      {isAdvanced && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="h-4 w-4 text-[var(--apex-blue)]" />
            <p className="text-sm font-semibold text-[var(--apex-text-primary)]">Prompt overrides</p>
            <span className="ml-1 rounded-full bg-[var(--apex-blue)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--apex-blue)]">
              Advanced
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {(
              [
                { key: "systemBehaviorPrompt", label: "System behavior" },
                { key: "conversationStylePrompt", label: "Conversation style" },
                { key: "qualificationPrompt", label: "Qualification logic" },
                { key: "fallbackPrompt", label: "Fallback behavior" },
                { key: "handoffPrompt", label: "Handoff trigger" },
              ] as Array<{ key: keyof StudioInput["prompts"]; label: string }>
            ).map(({ key, label }) => (
              <label key={key} className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-[var(--apex-text-secondary)] uppercase tracking-wide">
                  {label}
                </span>
                <Textarea
                  value={value.prompts[key]}
                  onChange={(e) => onPromptChange(key, e.target.value)}
                  className="min-h-16 text-sm"
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
