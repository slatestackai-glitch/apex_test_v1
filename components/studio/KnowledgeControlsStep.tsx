"use client";

import { useState, useRef } from "react";
import { ChevronDown, ChevronUp, Cloud, Database, Edit2, Layers, Link2, Loader2, MessageCircle, Paperclip, Plus, Server, Table, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { detectIntent, generateSetupCard } from "@/lib/intentDetection";
import { KnowledgeFile, HandoffChannel, StudioInput } from "@/lib/projectSchema";

const UPLOAD_SLOTS = [
  { id: "faq", label: "Upload FAQ", accept: ".pdf,.doc,.docx,.txt" },
  { id: "brochure", label: "Upload product brochure", accept: ".pdf" },
  { id: "pricing", label: "Upload pricing sheet", accept: ".pdf,.xlsx,.csv" },
  { id: "policy", label: "Upload policy documents", accept: ".pdf" },
  { id: "website", label: "Add website content", accept: ".txt,.html" },
  { id: "notes", label: "Add notes", accept: ".txt,.md" },
];

const LOADING_STAGES = [
  "Reading instruction...",
  "Detecting intent...",
  "Finding missing setup details...",
];

const CHANNEL_OPTIONS = ["WhatsApp", "Email", "SMS"];
const CRM_OPTIONS = ["Engati CRM", "Salesforce", "HubSpot", "Zoho"];
const TRACKING_OPTIONS = ["PostHog", "GA4", "Mixpanel", "None"];
const TRIGGER_OPTIONS = ["lead qualified", "consent captured", "callback requested"];

const HANDOFF_CHANNEL_ICONS: Record<string, React.ElementType> = {
  "Engati CRM": Database,
  "WhatsApp Business": MessageCircle,
  "Salesforce": Cloud,
  "HubSpot": Layers,
  "Zoho": Server,
  "Google Sheets": Table,
  "Custom webhook": Link2,
};

export function KnowledgeControlsStep({
  value,
  onChange,
  onPromptChange,
}: {
  value: StudioInput;
  onChange: (patch: Partial<StudioInput>) => void;
  onPromptChange: (field: keyof StudioInput["prompts"], text: string) => void;
}) {
  // Behavior prompt state
  const [analyzeClicked, setAnalyzeClicked] = useState(false);
  const [loadingStage, setLoadingStage] = useState<number>(-1);
  const [intentDetected, setIntentDetected] = useState(false);

  // Setup card state
  const [cardChannel, setCardChannel] = useState("WhatsApp");
  const [cardCrm, setCardCrm] = useState("Engati CRM");
  const [cardTracking, setCardTracking] = useState("None");
  const [cardTrigger, setCardTrigger] = useState("lead qualified");
  const [cardConfirmed, setCardConfirmed] = useState(false);

  // Guardrails
  const [editingGuardrailIndex, setEditingGuardrailIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [addingGuardrail, setAddingGuardrail] = useState(false);
  const [newGuardrail, setNewGuardrail] = useState("");

  // Advanced prompts
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  async function handleAnalyze() {
    setAnalyzeClicked(true);
    setIntentDetected(false);
    setLoadingStage(0);

    for (let i = 0; i < LOADING_STAGES.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoadingStage(i + 1);
    }

    const detected = detectIntent(value.behaviorPrompt ?? "");
    const setupCard = generateSetupCard(detected);

    onChange({
      detectedIntent: detected.label,
      missingInputs: detected.missingInputs,
      confirmedSetupCard: {
        ...setupCard,
        fields: {
          channel: cardChannel,
          crm: cardCrm,
          tracking: cardTracking,
          handoffTrigger: cardTrigger,
        },
      },
    });
    setIntentDetected(true);
    setLoadingStage(-1);
  }

  function handleFileUpload(slotId: string, file: File) {
    const newFile: KnowledgeFile = {
      id: `${slotId}-${Date.now()}`,
      name: file.name,
      type: file.type,
      status: "uploaded",
    };
    onChange({ knowledgeFiles: [...(value.knowledgeFiles ?? []), newFile] });
  }

  function removeFile(fileId: string) {
    onChange({ knowledgeFiles: (value.knowledgeFiles ?? []).filter((f) => f.id !== fileId) });
  }

  function deleteGuardrail(index: number) {
    const updated = [...(value.editableGuardrails ?? [])];
    updated.splice(index, 1);
    onChange({ editableGuardrails: updated });
  }

  function saveGuardrailEdit(index: number) {
    const updated = [...(value.editableGuardrails ?? [])];
    updated[index] = editingText;
    onChange({ editableGuardrails: updated });
    setEditingGuardrailIndex(null);
    setEditingText("");
  }

  function addGuardrail() {
    if (!newGuardrail.trim()) return;
    onChange({ editableGuardrails: [...(value.editableGuardrails ?? []), newGuardrail.trim()] });
    setNewGuardrail("");
    setAddingGuardrail(false);
  }

  function toggleHandoffChannel(channelId: string) {
    const updated = (value.handoffChannels ?? []).map((ch) =>
      ch.id === channelId ? { ...ch, enabled: !ch.enabled } : ch
    );
    onChange({ handoffChannels: updated });
  }

  const requiredCaps = value.detectedIntent ? detectIntent(value.behaviorPrompt ?? "").requiredCapabilities : [];

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      {/* SECTION 1: Behavior prompt */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--apex-text-primary)] mb-1">Describe what APEX should do</h2>
        <p className="text-sm text-[var(--apex-text-secondary)] mb-4">
          Describe in plain language what you want APEX to do. APEX will detect the intent and generate the workflow setup.
        </p>

        <div className="flex flex-col gap-3">
          <textarea
            value={value.behaviorPrompt ?? ""}
            onChange={(e) => onChange({ behaviorPrompt: e.target.value })}
            rows={4}
            placeholder="Example: I want APEX to qualify insurance quote leads, capture phone and consent, continue on WhatsApp, and send qualified leads to CRM."
            className="w-full rounded-2xl border border-[var(--apex-border)] bg-white px-4 py-3 text-sm text-[var(--apex-text-primary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--apex-red)]/30"
          />

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzeClicked && loadingStage >= 0}
            className="self-start inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--apex-red)] px-5 text-sm font-semibold text-white hover:bg-[#a80e26] disabled:opacity-60 transition-colors"
          >
            {analyzeClicked && loadingStage >= 0 && <Loader2 className="h-4 w-4 animate-spin" />}
            {analyzeClicked && loadingStage >= 0 ? "Analyzing..." : "Analyze intent"}
          </button>
        </div>
      </section>

      {/* SECTION 2: Intent detection result */}
      {analyzeClicked && (
        <section>
          <h2 className="text-sm font-semibold text-[var(--apex-text-secondary)] uppercase tracking-wide mb-3">
            Intent detection
          </h2>

          {loadingStage >= 0 && !intentDetected ? (
            <div className="rounded-2xl border border-[var(--apex-border)] bg-white p-4 space-y-3">
              {LOADING_STAGES.map((stage, i) => (
                <div key={stage} className="flex items-center gap-3">
                  {i < loadingStage ? (
                    <div className="h-4 w-4 rounded-full bg-[var(--apex-success)] flex items-center justify-center">
                      <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ) : i === loadingStage ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[var(--apex-red)] shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-[var(--apex-border)] shrink-0" />
                  )}
                  <p className={cn("text-sm", i <= loadingStage ? "text-[var(--apex-text-primary)]" : "text-[var(--apex-text-secondary)]")}>
                    {stage}
                  </p>
                </div>
              ))}
            </div>
          ) : intentDetected && value.detectedIntent ? (
            <div className="rounded-2xl border border-[var(--apex-success)]/30 bg-[#f2fbf7] p-4">
              <p className="text-sm font-semibold text-[var(--apex-text-primary)] mb-3">
                Detected intent: <span className="text-[var(--apex-red)]">{value.detectedIntent}</span>
              </p>

              {requiredCaps.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-[var(--apex-text-secondary)] uppercase tracking-wide mb-2">Required capabilities:</p>
                  <div className="flex flex-wrap gap-2">
                    {requiredCaps.map((cap) => (
                      <span key={cap} className="rounded-full bg-[#e8f1ff] text-[var(--apex-blue)] px-3 py-1 text-xs font-medium">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(value.missingInputs ?? []).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[var(--apex-text-secondary)] uppercase tracking-wide mb-2">Missing inputs:</p>
                  <div className="flex flex-wrap gap-2">
                    {(value.missingInputs ?? []).map((input) => (
                      <span key={input} className="rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-xs font-medium">
                        {input}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </section>
      )}

      {/* SECTION 3: Generative UI Setup Card */}
      {intentDetected && (
        <section>
          <h2 className="text-lg font-semibold text-[var(--apex-text-primary)] mb-1">Workflow setup</h2>
          <p className="text-sm text-[var(--apex-text-secondary)] mb-4">
            Configure how APEX connects to your tools.
          </p>

          <div className="rounded-2xl border border-[var(--apex-border)] bg-white p-4">
            <div className="grid gap-4 sm:grid-cols-2 mb-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Channel</span>
                <select
                  value={cardChannel}
                  onChange={(e) => setCardChannel(e.target.value)}
                  disabled={cardConfirmed}
                  className="h-10 w-full rounded-xl border border-[var(--apex-border)] bg-white px-3 text-sm disabled:opacity-60"
                >
                  {CHANNEL_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">CRM</span>
                <select
                  value={cardCrm}
                  onChange={(e) => setCardCrm(e.target.value)}
                  disabled={cardConfirmed}
                  className="h-10 w-full rounded-xl border border-[var(--apex-border)] bg-white px-3 text-sm disabled:opacity-60"
                >
                  {CRM_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Tracking</span>
                <select
                  value={cardTracking}
                  onChange={(e) => setCardTracking(e.target.value)}
                  disabled={cardConfirmed}
                  className="h-10 w-full rounded-xl border border-[var(--apex-border)] bg-white px-3 text-sm disabled:opacity-60"
                >
                  {TRACKING_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Handoff trigger</span>
                <select
                  value={cardTrigger}
                  onChange={(e) => setCardTrigger(e.target.value)}
                  disabled={cardConfirmed}
                  className="h-10 w-full rounded-xl border border-[var(--apex-border)] bg-white px-3 text-sm disabled:opacity-60"
                >
                  {TRIGGER_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </label>
            </div>

            {!cardConfirmed ? (
              <button
                type="button"
                onClick={() => {
                  setCardConfirmed(true);
                  onChange({
                    confirmedSetupCard: {
                      id: `card-${Date.now()}`,
                      type: "workflow",
                      title: "Workflow setup",
                      confirmed: true,
                      fields: { channel: cardChannel, crm: cardCrm, tracking: cardTracking, handoffTrigger: cardTrigger },
                    },
                  });
                }}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--apex-red)] px-5 text-sm font-semibold text-white hover:bg-[#a80e26]"
              >
                Confirm setup
              </button>
            ) : (
              <div className="rounded-xl border border-[var(--apex-success)]/30 bg-[#f2fbf7] p-3">
                <p className="text-sm font-semibold text-[var(--apex-text-primary)] mb-2">What APEX will do:</p>
                <ul className="space-y-1 text-xs text-[var(--apex-text-secondary)]">
                  <li>• Qualify leads via {cardChannel}</li>
                  <li>• Push qualified leads to {cardCrm}</li>
                  {cardTracking !== "None" && <li>• Track events in {cardTracking}</li>}
                  <li>• Trigger handoff on: {cardTrigger}</li>
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SECTION 4: Knowledge Files */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--apex-text-primary)] mb-1">Knowledge files</h2>
        <p className="text-sm text-[var(--apex-text-secondary)] mb-4">
          Upload reference materials for APEX to use in conversations.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {UPLOAD_SLOTS.map((slot) => {
            const slotFiles = (value.knowledgeFiles ?? []).filter((f) => f.id.startsWith(slot.id));

            return (
              <div key={slot.id} className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => fileInputRefs.current[slot.id]?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter") fileInputRefs.current[slot.id]?.click(); }}
                >
                  <Paperclip className="h-4 w-4 text-[var(--apex-text-secondary)] shrink-0" />
                  <span className="text-xs font-medium text-[var(--apex-text-secondary)]">{slot.label}</span>
                </div>

                <input
                  ref={(el) => { fileInputRefs.current[slot.id] = el; }}
                  type="file"
                  accept={slot.accept}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(slot.id, file);
                    e.target.value = "";
                  }}
                />

                {slotFiles.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {slotFiles.map((f) => (
                      <div key={f.id} className="flex items-center gap-2 rounded-lg bg-white border border-[var(--apex-border)] px-2.5 py-1.5">
                        <span className="flex-1 min-w-0 text-[11px] font-medium truncate text-[var(--apex-text-primary)]">{f.name}</span>
                        <span className="text-[10px] text-[var(--apex-success)] font-semibold">uploaded</span>
                        <button
                          type="button"
                          onClick={() => removeFile(f.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-[11px] text-[var(--apex-text-secondary)]">
          Demo mode — files are not processed.
        </p>
      </section>

      {/* SECTION 5: Guardrails */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[var(--apex-text-primary)]">Guardrails</h2>
          {!addingGuardrail && (
            <button
              type="button"
              onClick={() => setAddingGuardrail(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--apex-red)] hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              Add guardrail
            </button>
          )}
        </div>

        <div className="space-y-2">
          {(value.editableGuardrails ?? []).map((guardrail, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-[var(--apex-border)] bg-white px-3 py-2.5">
              {editingGuardrailIndex === i ? (
                <>
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="flex-1 min-w-0 text-sm border-b border-[var(--apex-border)] focus:outline-none"
                    autoFocus
                  />
                  <button type="button" onClick={() => saveGuardrailEdit(i)} className="text-xs font-semibold text-[var(--apex-success)]">Save</button>
                  <button type="button" onClick={() => setEditingGuardrailIndex(null)} className="text-xs text-[var(--apex-text-secondary)]">Cancel</button>
                </>
              ) : (
                <>
                  <p className="flex-1 min-w-0 text-sm text-[var(--apex-text-primary)]">{guardrail}</p>
                  <button
                    type="button"
                    onClick={() => { setEditingGuardrailIndex(i); setEditingText(guardrail); }}
                    className="text-[var(--apex-text-secondary)] hover:text-[var(--apex-text-primary)]"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteGuardrail(i)}
                    className="text-[var(--apex-text-secondary)] hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {addingGuardrail && (
          <div className="mt-2 flex items-center gap-2">
            <input
              value={newGuardrail}
              onChange={(e) => setNewGuardrail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addGuardrail(); if (e.key === "Escape") setAddingGuardrail(false); }}
              placeholder="Enter guardrail text..."
              className="flex-1 h-10 rounded-xl border border-[var(--apex-border)] bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--apex-red)]/30"
              autoFocus
            />
            <Button onClick={addGuardrail} disabled={!newGuardrail.trim()}>Add</Button>
            <Button variant="outline" onClick={() => { setAddingGuardrail(false); setNewGuardrail(""); }}>Cancel</Button>
          </div>
        )}
      </section>

      {/* SECTION 6: Handoff channels */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--apex-text-primary)] mb-3">Handoff channels</h2>
        <div className="space-y-2">
          {(value.handoffChannels ?? []).map((channel) => {
            const ChannelIcon = HANDOFF_CHANNEL_ICONS[channel.label] ?? Link2;
            return (
              <div key={channel.id} className="flex items-center gap-3 rounded-xl border border-[var(--apex-border)] bg-white px-3 py-3">
                <button
                  type="button"
                  onClick={() => toggleHandoffChannel(channel.id)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                    channel.enabled ? "bg-[var(--apex-red)]" : "bg-gray-200"
                  )}
                  role="switch"
                  aria-checked={channel.enabled}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                      channel.enabled ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--apex-section-bg)]">
                  <ChannelIcon className="h-4 w-4 text-[var(--apex-text-secondary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--apex-text-primary)]">{channel.label}</p>
                  <p className="text-xs text-[var(--apex-text-secondary)]">{channel.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Advanced settings accordion — only after intent analysis */}
      {value.detectedIntent && (
      <section>
        <button
          type="button"
          onClick={() => setAdvancedOpen((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-[var(--apex-text-secondary)] hover:text-[var(--apex-text-primary)]"
        >
          {advancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Advanced settings
        </button>

        {advancedOpen && (
          <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-4">
            {(["systemBehaviorPrompt", "qualificationPrompt", "fallbackPrompt", "handoffPrompt"] as const).map((field) => (
              <label key={field} className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">
                  {field === "systemBehaviorPrompt" ? "System behavior prompt" :
                   field === "qualificationPrompt" ? "Qualification prompt" :
                   field === "fallbackPrompt" ? "Fallback prompt" : "Handoff prompt"}
                </span>
                <textarea
                  value={value.prompts[field]}
                  onChange={(e) => onPromptChange(field, e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-[var(--apex-border)] bg-white px-3 py-2.5 text-sm resize-none"
                />
              </label>
            ))}
          </div>
        )}
      </section>
      )}
    </div>
  );
}
