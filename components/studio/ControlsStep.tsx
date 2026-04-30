"use client";

import { useState } from "react";
import {
  FileText, Link2, Cloud, Database, MessageCircle, Loader2,
  CheckCircle2, ToggleLeft, ToggleRight, ChevronDown, ChevronUp,
  Sparkles, Shield, Zap, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StudioInput, KnowledgeBaseConfig, AgentTrainingConfig } from "@/lib/projectSchema";
import { AdvancedSettingsPanel } from "@/components/ui/AdvancedSettingsPanel";

// ─── Knowledge Base ──────────────────────────────────────────────────────────

const KB_CATEGORIES = [
  {
    id: "documents",
    label: "Documents",
    icon: FileText,
    sources: ["FAQ document", "Product brochure", "Pricing sheet", "Policy document", "Terms & conditions", "Compliance guide", "Claims process guide"],
  },
  {
    id: "urls",
    label: "Web sources",
    icon: Link2,
    sources: ["Website homepage", "Product page", "Support page", "Pricing page", "Branch / location page"],
  },
  {
    id: "enterprise",
    label: "Enterprise repos",
    icon: Cloud,
    sources: ["SharePoint", "Google Drive", "OneDrive", "Confluence", "Notion"],
  },
  {
    id: "data",
    label: "Data systems",
    icon: Database,
    sources: ["Salesforce Knowledge", "HubSpot CRM", "Zoho CRM", "Database / table source", "Branch & location data"],
  },
  {
    id: "history",
    label: "Conversations",
    icon: MessageCircle,
    sources: ["WhatsApp transcripts", "Chat transcripts", "Call summaries", "Support tickets"],
  },
  {
    id: "notes",
    label: "Manual notes",
    icon: FileText,
    sources: ["Internal instructions", "Product notes", "Compliance notes", "Advisor guidelines"],
  },
];

function KnowledgeBase({ config, onChange }: {
  config: KnowledgeBaseConfig;
  onChange: (patch: Partial<KnowledgeBaseConfig>) => void;
}) {
  const [open, setOpen] = useState<string[]>(["documents"]);
  const [uploading, setUploading] = useState<string | null>(null);
  const selectedSources = [...config.enterpriseSources, ...config.dataSystems,
    ...config.historicalConversations, ...config.urls];

  function toggleSection(id: string) {
    setOpen((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function mockUpload(sourceId: string, name: string) {
    setUploading(sourceId);
    setTimeout(() => {
      onChange({
        documents: [...config.documents, { id: sourceId, type: name, name, status: "ready" }],
      });
      setUploading(null);
    }, 1200);
  }

  function toggleSource(listKey: "enterpriseSources" | "dataSystems" | "historicalConversations" | "urls", val: string) {
    const cur = config[listKey];
    const next = cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val];
    onChange({ [listKey]: next });
  }

  const listKeyFor: Record<string, "enterpriseSources" | "dataSystems" | "historicalConversations" | "urls"> = {
    enterprise: "enterpriseSources", data: "dataSystems",
    history: "historicalConversations", urls: "urls",
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-400">Add the sources APEX can reference when responding to users.</p>
      {KB_CATEGORIES.map(({ id, label, icon: Icon, sources }) => {
        const isOpen = open.includes(id);
        const listKey = listKeyFor[id];
        const docCount = id === "documents" ? config.documents.filter((d) => d.type !== "").length : 0;
        const selCount = listKey ? config[listKey].length : 0;
        const count = id === "documents" ? docCount : selCount;

        return (
          <div key={id} className="rounded-xl border border-gray-100 bg-white overflow-hidden">
            <button type="button" onClick={() => toggleSection(id)}
              className="flex w-full items-center gap-3 px-5 py-3.5 text-left hover:bg-gray-50 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 shrink-0">
                <Icon className="h-4 w-4 text-gray-400" />
              </div>
              <span className="flex-1 text-sm font-medium text-[#0A2540]">{label}</span>
              {count > 0 && (
                <span className="rounded-full bg-[#C8102E]/10 px-2 py-0.5 text-[11px] font-semibold text-[#C8102E]">{count} added</span>
              )}
              {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>

            {isOpen && (
              <div className="border-t border-gray-100 px-5 py-4">
                {id === "documents" ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {sources.map((src) => {
                      const added = config.documents.some((d) => d.type === src);
                      const isLoading = uploading === `${id}-${src}`;
                      return (
                        <button key={src} type="button"
                          onClick={() => !added && mockUpload(`${id}-${src}`, src)}
                          className={cn("flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm transition-all",
                            added ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-white")}>
                          {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                            : added ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              : <FileText className="h-3.5 w-3.5 text-gray-300 shrink-0" />}
                          {src}
                        </button>
                      );
                    })}
                  </div>
                ) : id === "urls" ? (
                  <div className="space-y-2">
                    {sources.map((src) => {
                      const added = config.urls.includes(src);
                      return (
                        <button key={src} type="button" onClick={() => toggleSource("urls", src)}
                          className={cn("flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm w-full text-left transition-all",
                            added ? "border-[#C8102E]/30 bg-[#fff4f6] text-[#C8102E]"
                              : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200")}>
                          <div className={cn("h-3 w-3 rounded-full border-2 shrink-0",
                            added ? "border-[#C8102E] bg-[#C8102E]" : "border-gray-300")} />
                          {src}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {sources.map((src) => {
                      const key = listKeyFor[id];
                      const added = key ? config[key].includes(src) : false;
                      return (
                        <button key={src} type="button" onClick={() => key && toggleSource(key, src)}
                          className={cn("rounded-full border px-3 py-1 text-xs font-medium transition-all",
                            added ? "border-[#C8102E] bg-[#fff4f6] text-[#C8102E]"
                              : "border-gray-200 text-gray-500 hover:border-gray-300")}>
                          {src}
                        </button>
                      );
                    })}
                  </div>
                )}
                {id === "notes" && (
                  <textarea value={config.manualNotes}
                    onChange={(e) => onChange({ manualNotes: e.target.value })}
                    rows={3} placeholder="Add internal notes, instructions, or compliance guidelines…"
                    className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0A2540] placeholder-gray-300 resize-none focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10" />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Agent Training ───────────────────────────────────────────────────────────

const DEFAULT_INSTRUCTIONS = `You are Ava, an insurance journey assistant for {clientName}.

Help users identify their intent, collect only the required details, avoid regulated advice, and hand off qualified users after consent.

Ask one question at a time. Confirm before collecting phone number. Always ask for consent before handoff.`;

const INTENT_CATS = [
  { id: "quote", label: "Quote / Buy" },
  { id: "renewal", label: "Policy Renewal" },
  { id: "claim", label: "Claim" },
  { id: "policy-copy", label: "Policy Copy" },
  { id: "callback", label: "Advisor Callback" },
  { id: "compare", label: "Compare Plans" },
  { id: "unclear", label: "Unclear intent" },
];

const TOOL_ACTIONS = [
  { id: "crm-lead", label: "CRM lead creation", trigger: "Qualified lead threshold reached", requiredInput: "name, phone, product", result: "Lead record created in CRM" },
  { id: "whatsapp", label: "WhatsApp handoff", trigger: "Consent given + contact captured", requiredInput: "phone, consent", result: "Conversation continues on WhatsApp" },
  { id: "callback", label: "Callback scheduling", trigger: "Callback preference collected", requiredInput: "phone, preferred time", result: "Slot booked in advisor calendar" },
  { id: "claim-status", label: "Claim status lookup", trigger: "User requests claim update", requiredInput: "policy number or claim ID", result: "Status returned from claims system" },
  { id: "quote-create", label: "Quote request", trigger: "Product selected + phone captured", requiredInput: "product type, phone", result: "Quote record created" },
  { id: "webhook", label: "Webhook trigger", trigger: "Custom event defined", requiredInput: "custom payload", result: "Payload sent to endpoint" },
];

const GUARDRAILS_LIST = [
  "Do not guarantee premium amounts",
  "Do not guarantee claim settlement",
  "Do not guarantee policy approval",
  "Do not collect OTP, PIN, CVV or passwords",
  "Escalate regulated financial advice to human",
  "Ask consent before any data handoff",
];

const MOCK_RESULTS: Record<string, { intent: string; nextQuestion: string }> = {
  default: { intent: "unclear", nextQuestion: "I can help you with a quote, renewal, claim or advisor callback. What brings you here today?" },
  renew: { intent: "renewal", nextQuestion: "Do you have your policy number or vehicle registration handy?" },
  quote: { intent: "quote / buy", nextQuestion: "What type of vehicle would you like to insure — car, SUV, or bike?" },
  claim: { intent: "claim", nextQuestion: "Could you describe what happened? I'll help you start the claim process." },
  advisor: { intent: "advisor callback", nextQuestion: "What's a good time to call you? I'll connect you with an advisor." },
};

function getTestResult(input: string) {
  const low = input.toLowerCase();
  if (/renew|renewal/i.test(low)) return MOCK_RESULTS.renew;
  if (/quote|buy|purchase/i.test(low)) return MOCK_RESULTS.quote;
  if (/claim|accident|damaged/i.test(low)) return MOCK_RESULTS.claim;
  if (/advisor|agent|human|speak|call/i.test(low)) return MOCK_RESULTS.advisor;
  return MOCK_RESULTS.default;
}

function AgentTraining({ config, onChange, onPromptChange, value }: {
  config: AgentTrainingConfig;
  onChange: (patch: Partial<AgentTrainingConfig>) => void;
  onPromptChange: (field: keyof StudioInput["prompts"], text: string) => void;
  value: StudioInput;
}) {
  const [testInput, setTestInput] = useState(config.testInput || "");
  const [testResult, setTestResult] = useState(config.testResult);
  const [testing, setTesting] = useState(false);

  function runTest() {
    if (!testInput.trim()) return;
    setTesting(true);
    setTimeout(() => {
      const result = getTestResult(testInput);
      setTestResult(result);
      onChange({ testInput, testResult: result });
      setTesting(false);
    }, 900);
  }

  function toggleGuardrail(g: string) {
    const cur = config.guardrails;
    onChange({ guardrails: cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g] });
  }

  function toggleIntent(id: string) {
    const cats = config.intentCategories.map((c) => c.id === id ? { ...c, enabled: !c.enabled } : c);
    onChange({ intentCategories: cats });
  }

  function toggleTool(id: string) {
    const tools = config.toolActions.map((t) => t.id === id ? { ...t, enabled: !t.enabled } : t);
    onChange({ toolActions: tools });
  }

  const Tog = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button type="button" onClick={onToggle} className="shrink-0">
      {on ? <ToggleRight className="h-5 w-5 text-[#C8102E]" /> : <ToggleLeft className="h-5 w-5 text-gray-300" />}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-[#C8102E]" />
          <p className="text-sm font-semibold text-[#0A2540]">Agent instructions</p>
        </div>
        <textarea value={config.instructions || DEFAULT_INSTRUCTIONS.replace("{clientName}", value.clientName || "your client")}
          onChange={(e) => onChange({ instructions: e.target.value })}
          rows={5}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0A2540] font-mono leading-relaxed resize-none focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10" />
      </div>

      {/* Behavior & tone */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
        <p className="text-sm font-semibold text-[#0A2540]">Behavior & tone</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {([
            { label: "Tone", key: "tone" as const, options: ["professional", "warm", "direct", "premium"] },
            { label: "Answer length", key: "answerLength" as const, options: ["short", "balanced", "detailed"] },
            { label: "Clarification style", key: "clarificationStyle" as const, options: ["one-at-a-time", "options", "mixed"] },
            { label: "User input style", key: "userInputStyle" as const, options: ["free-text", "guided", "mixed"] },
          ] as const).map(({ label, key, options }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
              <select value={config[key]}
                onChange={(e) => onChange({ [key]: e.target.value as typeof config[typeof key] })}
                className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm text-[#0A2540] bg-white focus:outline-none focus:border-[#C8102E] transition-all capitalize">
                {options.map((o) => <option key={o} value={o}>{o.replace(/-/g, " ")}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow rules */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <p className="text-sm font-semibold text-[#0A2540] mb-4">Conversation workflow</p>
        <div className="space-y-3">
          {([
            { key: "startWithIntentDetection" as const, label: "Start with intent detection" },
            { key: "askOneAtATime" as const, label: "Ask one question at a time" },
            { key: "confirmBeforePhone" as const, label: "Confirm before collecting phone number" },
            { key: "askConsentBeforeHandoff" as const, label: "Ask consent before handoff" },
            { key: "offerWhatsApp" as const, label: "Offer WhatsApp continuation" },
            { key: "offerCallback" as const, label: "Offer advisor callback" },
          ] as const).map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between gap-3 py-1">
              <span className="text-sm text-[#0A2540]">{label}</span>
              <Tog on={config.workflowRules[key]} onToggle={() =>
                onChange({ workflowRules: { ...config.workflowRules, [key]: !config.workflowRules[key] } })} />
            </div>
          ))}
        </div>
      </div>

      {/* Intent classification */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <p className="text-sm font-semibold text-[#0A2540] mb-1">Auto intent classification</p>
        <p className="text-xs text-gray-400 mb-4">Toggle the intents APEX should detect and route.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {config.intentCategories.map((cat) => (
            <div key={cat.id}
              className={cn("flex items-center justify-between gap-2 rounded-xl border px-4 py-2.5",
                cat.enabled ? "border-[#C8102E]/20 bg-[#fff4f6]" : "border-gray-100 bg-gray-50")}>
              <span className={cn("text-sm font-medium", cat.enabled ? "text-[#C8102E]" : "text-gray-500")}>{cat.label}</span>
              <Tog on={cat.enabled} onToggle={() => toggleIntent(cat.id)} />
            </div>
          ))}
        </div>
      </div>

      {/* Tool actions */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="h-4 w-4 text-[#C8102E]" />
          <p className="text-sm font-semibold text-[#0A2540]">Tool actions</p>
        </div>
        <p className="text-xs text-gray-400 mb-4">Enable the actions APEX can trigger during a conversation.</p>
        <div className="space-y-2">
          {config.toolActions.map((tool) => (
            <div key={tool.id}
              className={cn("rounded-xl border p-4 transition-all",
                tool.enabled ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50 opacity-60")}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0A2540]">{tool.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Triggers when: {tool.trigger}</p>
                  {tool.enabled && <p className="text-xs text-emerald-600 mt-0.5">Result: {tool.result}</p>}
                </div>
                <Tog on={tool.enabled} onToggle={() => toggleTool(tool.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guardrails */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-4 w-4 text-[#C8102E]" />
          <p className="text-sm font-semibold text-[#0A2540]">Guardrails</p>
        </div>
        <p className="text-xs text-gray-400 mb-4">Rules APEX always follows. Toggle to enable or disable.</p>
        <div className="space-y-2">
          {GUARDRAILS_LIST.map((g) => {
            const enabled = config.guardrails.includes(g);
            return (
              <div key={g} className={cn("flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5",
                enabled ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50 opacity-60")}>
                <span className="text-sm text-[#0A2540]">{g}</span>
                <Tog on={enabled} onToggle={() => toggleGuardrail(g)} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Fallback behavior */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="h-4 w-4 text-[#C8102E]" />
          <p className="text-sm font-semibold text-[#0A2540]">Fallback behavior</p>
        </div>
        {([
          { key: "unclearIntent" as const, label: "Unclear intent", options: ["Ask clarifying question", "Show journey menu", "Offer advisor callback"] },
          { key: "missingInfo" as const, label: "Missing information", options: ["Ask once more", "Skip and continue", "Offer callback"] },
          { key: "apiFailure" as const, label: "API / system failure", options: ["Notify user politely", "Offer callback", "Try again silently"] },
          { key: "humanHandoff" as const, label: "Human handoff trigger", options: ["After 2 failed attempts", "On user request", "After 3 turns"] },
        ] as const).map(({ key, label, options }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
            <select value={config.fallbackBehavior[key]}
              onChange={(e) => onChange({ fallbackBehavior: { ...config.fallbackBehavior, [key]: e.target.value } })}
              className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm text-[#0A2540] bg-white focus:outline-none focus:border-[#C8102E]">
              {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Test preview */}
      <div className="rounded-2xl border border-[#C8102E]/20 bg-[#fff4f6] p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-[#C8102E]" />
          <p className="text-sm font-semibold text-[#C8102E]">Test agent behavior</p>
        </div>
        <p className="text-xs text-gray-500 mb-3">Type a user message to preview how APEX would respond.</p>
        <div className="flex gap-2 mb-3">
          <input type="text" value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runTest()}
            placeholder='e.g. "I want to renew my car insurance"'
            className="flex-1 h-10 rounded-xl border border-gray-200 px-3 text-sm bg-white text-[#0A2540] focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10" />
          <button type="button" onClick={runTest} disabled={!testInput.trim() || testing}
            className="h-10 rounded-xl bg-[#C8102E] px-4 text-sm font-semibold text-white hover:bg-[#a80e26] disabled:opacity-40 transition-colors">
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Test"}
          </button>
        </div>
        {testResult && !testing && (
          <div className="rounded-xl bg-white border border-gray-100 p-4 space-y-2 animate-[slideUp_0.2s_ease]">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Detected intent</span>
              <span className="rounded-full bg-purple-100 text-purple-700 px-2 py-0.5 text-[11px] font-medium">{testResult.intent}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">APEX next question</span>
              <p className="text-sm text-[#0A2540] italic">&ldquo;{testResult.nextQuestion}&rdquo;</p>
            </div>
          </div>
        )}
      </div>

      {/* Advanced */}
      <AdvancedSettingsPanel>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">System behavior prompt</label>
            <textarea value={value.prompts?.systemBehaviorPrompt ?? ""}
              onChange={(e) => onPromptChange("systemBehaviorPrompt", e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0A2540] font-mono resize-none focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Handoff prompt</label>
            <textarea value={value.prompts?.handoffPrompt ?? ""}
              onChange={(e) => onPromptChange("handoffPrompt", e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0A2540] font-mono resize-none focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10" />
          </div>
        </div>
      </AdvancedSettingsPanel>
    </div>
  );
}

// ─── Default configs ──────────────────────────────────────────────────────────

export function defaultKBConfig(): KnowledgeBaseConfig {
  return { documents: [], urls: [], enterpriseSources: [], dataSystems: [], historicalConversations: [], manualNotes: "" };
}

export function defaultAgentTrainingConfig(): AgentTrainingConfig {
  return {
    instructions: "",
    tone: "professional",
    answerLength: "balanced",
    clarificationStyle: "one-at-a-time",
    userInputStyle: "mixed",
    workflowRules: {
      startWithIntentDetection: true,
      askOneAtATime: true,
      confirmBeforePhone: true,
      askConsentBeforeHandoff: true,
      offerWhatsApp: true,
      offerCallback: true,
    },
    intentCategories: INTENT_CATS.map((c) => ({ ...c, enabled: true, destination: "journey-router" })),
    toolActions: TOOL_ACTIONS.map((t) => ({ ...t, enabled: ["crm-lead", "whatsapp", "callback"].includes(t.id) })),
    guardrails: GUARDRAILS_LIST,
    fallbackBehavior: {
      unclearIntent: "Ask clarifying question",
      missingInfo: "Ask once more",
      apiFailure: "Notify user politely",
      humanHandoff: "After 2 failed attempts",
    },
    testInput: "",
    testResult: null,
  };
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ControlsStep({
  value,
  onChange,
  onPromptChange,
}: {
  value: StudioInput;
  onChange: (patch: Partial<StudioInput>) => void;
  onPromptChange: (field: keyof StudioInput["prompts"], text: string) => void;
}) {
  const [tab, setTab] = useState<"kb" | "training">("kb");

  const kbConfig: KnowledgeBaseConfig = value.knowledgeBaseConfig ?? defaultKBConfig();
  const atConfig: AgentTrainingConfig = value.agentTrainingConfig ?? defaultAgentTrainingConfig();

  function updateKB(patch: Partial<KnowledgeBaseConfig>) {
    onChange({ knowledgeBaseConfig: { ...kbConfig, ...patch } });
  }

  function updateAT(patch: Partial<AgentTrainingConfig>) {
    onChange({ agentTrainingConfig: { ...atConfig, ...patch } });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#C8102E] mb-1">Step 3 — Controls</p>
        <h2 className="text-2xl font-bold text-[#0A2540]">Knowledge & agent training</h2>
        <p className="text-sm text-gray-400 mt-1">Configure what APEX can reference and how it should behave.</p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl border border-gray-200 bg-white p-1 gap-1">
        {([
          { key: "kb" as const, label: "Knowledge Base" },
          { key: "training" as const, label: "Agent Training" },
        ]).map(({ key, label }) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={cn("flex-1 rounded-lg py-2 text-sm font-semibold transition-all",
              tab === key ? "bg-[#C8102E] text-white shadow-sm" : "text-gray-500 hover:text-[#0A2540]")}>
            {label}
          </button>
        ))}
      </div>

      {tab === "kb" ? (
        <KnowledgeBase config={kbConfig} onChange={updateKB} />
      ) : (
        <AgentTraining config={atConfig} onChange={updateAT} onPromptChange={onPromptChange} value={value} />
      )}
    </div>
  );
}
