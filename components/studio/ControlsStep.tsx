"use client";

import { useState, useRef } from "react";
import {
  FileText, Link2, Globe, HelpCircle, BookOpen, DollarSign, MapPin,
  FolderOpen, HardDrive, Users, MessageCircle, Upload, X, Plus,
  CheckCircle2, Loader2, ToggleLeft, ToggleRight, Sparkles, Shield,
  Zap, AlertTriangle, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StudioInput, KnowledgeBaseConfig, AgentTrainingConfig } from "@/lib/projectSchema";
import { AdvancedSettingsPanel } from "@/components/ui/AdvancedSettingsPanel";

// ─── Enterprise source cards ────────────────────────────────────────────────

const ENTERPRISE_SOURCES = [
  { id: "website",        label: "Website",          icon: Globe,          desc: "Homepage and product pages" },
  { id: "faqs",          label: "FAQs",              icon: HelpCircle,     desc: "Frequently asked questions" },
  { id: "brochures",     label: "Brochures",         icon: BookOpen,       desc: "Product and policy brochures" },
  { id: "pricing",       label: "Pricing Sheets",    icon: DollarSign,     desc: "Pricing and rate cards" },
  { id: "policy-docs",   label: "Policy Docs",       icon: FileText,       desc: "Terms and conditions" },
  { id: "branch-data",   label: "Branch Data",       icon: MapPin,         desc: "Locations and contact info" },
  { id: "sharepoint",    label: "SharePoint",        icon: FolderOpen,     desc: "Enterprise document library" },
  { id: "google-drive",  label: "Google Drive",      icon: HardDrive,      desc: "Cloud document repository" },
  { id: "crm-knowledge", label: "CRM Knowledge",     icon: Users,          desc: "CRM-stored knowledge base" },
  { id: "chat-history",  label: "Chat History",      icon: MessageCircle,  desc: "Historical support conversations" },
];

const DOCUMENT_TYPES = [
  "FAQ document", "Product brochure", "Pricing sheet",
  "Policy document", "Terms & conditions", "Compliance guide", "Claims process guide",
];

// ─── Knowledge Base ──────────────────────────────────────────────────────────

function KnowledgeBase({ config, onChange }: {
  config: KnowledgeBaseConfig;
  onChange: (patch: Partial<KnowledgeBaseConfig>) => void;
}) {
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function mockUpload(name: string) {
    const id = `doc-${Date.now()}`;
    setUploading(id);
    setTimeout(() => {
      onChange({ documents: [...config.documents, { id, type: name, name, status: "ready" }] });
      setUploading(null);
    }, 1100);
  }

  function removeDoc(id: string) {
    onChange({ documents: config.documents.filter((d) => d.id !== id) });
  }

  function addUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed || config.urls.includes(trimmed)) return;
    onChange({ urls: [...config.urls, trimmed] });
    setUrlInput("");
  }

  function removeUrl(url: string) {
    onChange({ urls: config.urls.filter((u) => u !== url) });
  }

  function toggleSource(id: string) {
    const cur = config.enterpriseSources;
    onChange({ enterpriseSources: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
  }

  const totalSelected = config.documents.length + config.urls.length + config.enterpriseSources.length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">Add the sources APEX can reference when responding to users.</p>
        {totalSelected > 0 && (
          <span className="rounded-full bg-[#C8102E]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#C8102E]">
            {totalSelected} source{totalSelected !== 1 ? "s" : ""} added
          </span>
        )}
      </div>

      {/* Upload documents */}
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-3.5">
          <p className="text-sm font-semibold text-[#0A2540]">Upload documents</p>
          <p className="text-xs text-gray-400 mt-0.5">PDF, DOCX, CSV, TXT supported</p>
        </div>
        <div className="p-5 space-y-4">
          {/* Drop zone */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-[#C8102E]/40 hover:bg-[#fff4f6]/50 transition-all py-8 flex flex-col items-center gap-2 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 group-hover:bg-[#C8102E]/10 transition-colors">
              <Upload className="h-5 w-5 text-gray-400 group-hover:text-[#C8102E] transition-colors" />
            </div>
            <p className="text-sm font-medium text-gray-500 group-hover:text-[#C8102E] transition-colors">
              Click to upload or drag files here
            </p>
            <p className="text-xs text-gray-400">PDF, DOCX, CSV, TXT</p>
          </button>
          <input ref={fileInputRef} type="file" className="hidden" multiple accept=".pdf,.docx,.csv,.txt"
            onChange={() => mockUpload("Uploaded document")} />

          {/* Quick-add document types */}
          <div>
            <p className="text-xs font-medium text-gray-400 mb-2">Or add by type</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {DOCUMENT_TYPES.map((src) => {
                const added = config.documents.some((d) => d.type === src);
                const isLoading = uploading === `qt-${src}`;
                return (
                  <button key={src} type="button"
                    onClick={() => {
                      if (!added) {
                        const id = `qt-${src}`;
                        setUploading(id);
                        setTimeout(() => {
                          onChange({ documents: [...config.documents, { id, type: src, name: src, status: "ready" }] });
                          setUploading(null);
                        }, 900);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-all text-left",
                      added
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 cursor-default"
                        : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-white"
                    )}>
                    {isLoading
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0 text-gray-400" />
                      : added
                        ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        : <FileText className="h-3.5 w-3.5 text-gray-300 shrink-0" />}
                    <span className="text-xs">{src}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Uploaded file chips */}
          {config.documents.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {config.documents.map((doc) => (
                <div key={doc.id}
                  className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 pl-3 pr-2 py-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span className="text-xs font-medium text-emerald-700">{doc.name}</span>
                  <button type="button" onClick={() => removeDoc(doc.id)}
                    className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-emerald-200 transition-colors">
                    <X className="h-2.5 w-2.5 text-emerald-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {uploading && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing…
            </div>
          )}
        </div>
      </div>

      {/* Add URLs */}
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-3.5">
          <p className="text-sm font-semibold text-[#0A2540]">Web sources</p>
          <p className="text-xs text-gray-400 mt-0.5">Add URLs APEX should reference</p>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addUrl()}
                placeholder="https://example.com/product"
                className="w-full h-10 rounded-xl border border-gray-200 pl-9 pr-3 text-sm text-[#0A2540] placeholder-gray-300 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 transition-all"
              />
            </div>
            <button type="button" onClick={addUrl}
              className="flex h-10 items-center gap-1.5 rounded-xl bg-[#0A2540] px-4 text-sm font-semibold text-white hover:bg-[#0d3260] transition-colors shrink-0">
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          {config.urls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {config.urls.map((url) => (
                <div key={url}
                  className="flex items-center gap-1.5 rounded-full border border-[#C8102E]/20 bg-[#fff4f6] pl-3 pr-2 py-1 max-w-full">
                  <Globe className="h-3 w-3 text-[#C8102E] shrink-0" />
                  <span className="text-xs font-medium text-[#C8102E] truncate max-w-[200px]">{url}</span>
                  <button type="button" onClick={() => removeUrl(url)}
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full hover:bg-[#C8102E]/20 transition-colors">
                    <X className="h-2.5 w-2.5 text-[#C8102E]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enterprise source cards */}
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-3.5">
          <p className="text-sm font-semibold text-[#0A2540]">Enterprise sources</p>
          <p className="text-xs text-gray-400 mt-0.5">Connect repositories and data systems</p>
        </div>
        <div className="p-5">
          <div className="grid gap-2.5 sm:grid-cols-2">
            {ENTERPRISE_SOURCES.map(({ id, label, icon: Icon, desc }) => {
              const selected = config.enterpriseSources.includes(id);
              return (
                <button key={id} type="button" onClick={() => toggleSource(id)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all",
                    selected
                      ? "border-[#C8102E]/30 bg-[#fff4f6]"
                      : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
                  )}>
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                    selected ? "bg-[#C8102E]/10" : "bg-white border border-gray-100"
                  )}>
                    <Icon className={cn("h-4 w-4", selected ? "text-[#C8102E]" : "text-gray-400")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-xs font-semibold leading-tight", selected ? "text-[#C8102E]" : "text-[#0A2540]")}>
                      {label}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{desc}</p>
                  </div>
                  {selected && <Check className="h-3.5 w-3.5 text-[#C8102E] shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <p className="text-sm font-semibold text-[#0A2540] mb-3">Manual notes</p>
        <textarea value={config.manualNotes}
          onChange={(e) => onChange({ manualNotes: e.target.value })}
          rows={3}
          placeholder="Add internal instructions, product notes, or compliance guidelines…"
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0A2540] placeholder-gray-300 resize-none focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10" />
      </div>

      <p className="text-[11px] text-gray-300 text-center">Demo mode — sources are not processed or stored.</p>
    </div>
  );
}

// ─── Agent Training ───────────────────────────────────────────────────────────

const DEFAULT_INSTRUCTIONS = `You are Ava, an insurance journey assistant for {clientName}.

Help users identify their intent, collect only the required details, avoid regulated advice, and hand off qualified users after consent.

Ask one question at a time. Confirm before collecting phone number. Always ask for consent before handoff.`;

const INTENT_CATS = [
  { id: "quote",       label: "Quote / Buy" },
  { id: "renewal",     label: "Policy Renewal" },
  { id: "claim",       label: "Claim" },
  { id: "policy-copy", label: "Policy Copy" },
  { id: "callback",    label: "Advisor Callback" },
  { id: "compare",     label: "Compare Plans" },
  { id: "unclear",     label: "Unclear intent" },
];

const TOOL_ACTIONS = [
  { id: "crm-lead",    label: "CRM lead creation",    trigger: "Qualified lead threshold reached",   requiredInput: "name, phone, product",            result: "Lead record created in CRM" },
  { id: "whatsapp",    label: "WhatsApp handoff",      trigger: "Consent given + contact captured",   requiredInput: "phone, consent",                  result: "Conversation continues on WhatsApp" },
  { id: "callback",    label: "Callback scheduling",   trigger: "Callback preference collected",       requiredInput: "phone, preferred time",            result: "Slot booked in advisor calendar" },
  { id: "claim-status",label: "Claim status lookup",   trigger: "User requests claim update",          requiredInput: "policy number or claim ID",        result: "Status returned from claims system" },
  { id: "quote-create",label: "Quote request",         trigger: "Product selected + phone captured",   requiredInput: "product type, phone",             result: "Quote record created" },
  { id: "webhook",     label: "Webhook trigger",       trigger: "Custom event defined",                requiredInput: "custom payload",                  result: "Payload sent to endpoint" },
];

const GUARDRAILS_LIST = [
  "Do not guarantee premium amounts",
  "Do not guarantee claim settlement",
  "Do not guarantee policy approval",
  "Do not collect OTP, PIN, CVV or passwords",
  "Escalate regulated financial advice to human",
  "Ask consent before any data handoff",
];

const MOCK_RESULTS: Record<string, { intent: string; nextQuestion: string; requiredData: string[]; suggestedAction: string }> = {
  default:  { intent: "unclear",           nextQuestion: "I can help you with a quote, renewal, claim or advisor callback. What brings you here today?", requiredData: ["User intent", "Name or policy reference"],                           suggestedAction: "Present journey menu to identify intent" },
  renew:    { intent: "renewal",           nextQuestion: "Do you have your policy number or vehicle registration handy?",                                  requiredData: ["Policy number or vehicle reg.", "Phone number", "Consent to process"], suggestedAction: "Continue through WhatsApp or advisor callback" },
  quote:    { intent: "quote / buy",       nextQuestion: "What type of vehicle would you like to insure — car, SUV, or bike?",                              requiredData: ["Vehicle type", "Name", "Phone number", "Consent"],                  suggestedAction: "Route to quote journey → CRM lead creation" },
  claim:    { intent: "claim",             nextQuestion: "Could you describe what happened? I'll help you start the claim process.",                         requiredData: ["Incident description", "Policy number", "Contact number"],           suggestedAction: "Open claim ticket → advisor callback scheduled" },
  advisor:  { intent: "advisor callback",  nextQuestion: "What's a good time to call you? I'll connect you with an advisor.",                               requiredData: ["Phone number", "Preferred callback time", "Consent"],               suggestedAction: "Schedule callback → push to advisor queue" },
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
  const [testInput, setTestInput] = useState("I want to renew my car insurance.");
  const [testResult, setTestResult] = useState<typeof MOCK_RESULTS[string] | null>(null);
  const [testing, setTesting] = useState(false);
  const [testError, setTestError] = useState(false);

  function runTest() {
    if (!testInput.trim()) { setTestError(true); return; }
    setTestError(false);
    setTesting(true);
    setTimeout(() => {
      setTestResult(getTestResult(testInput));
      setTesting(false);
    }, 900);
  }

  function toggleGuardrail(g: string) {
    const cur = config.guardrails;
    onChange({ guardrails: cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g] });
  }

  function toggleIntent(id: string) {
    onChange({ intentCategories: config.intentCategories.map((c) => c.id === id ? { ...c, enabled: !c.enabled } : c) });
  }

  function toggleTool(id: string) {
    onChange({ toolActions: config.toolActions.map((t) => t.id === id ? { ...t, enabled: !t.enabled } : t) });
  }

  const Tog = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button type="button" onClick={onToggle} className="shrink-0">
      {on ? <ToggleRight className="h-5 w-5 text-[#C8102E]" /> : <ToggleLeft className="h-5 w-5 text-gray-300" />}
    </button>
  );

  return (
    <div className="space-y-5">

      {/* TEST AGENT BEHAVIOUR — prominent, at top */}
      <div className="rounded-2xl border-2 border-[#C8102E]/20 bg-gradient-to-br from-[#fff4f6] to-white overflow-hidden">
        <div className="border-b border-[#C8102E]/10 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C8102E]/10">
              <Sparkles className="h-4 w-4 text-[#C8102E]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0A2540]">Test Agent Behaviour</p>
              <p className="text-xs text-gray-400">Type a sample user message and preview APEX's response.</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={testInput}
              onChange={(e) => { setTestInput(e.target.value); setTestError(false); setTestResult(null); }}
              onKeyDown={(e) => e.key === "Enter" && runTest()}
              placeholder="e.g. I want to renew my car insurance."
              className={cn(
                "flex-1 h-10 rounded-xl border px-3 text-sm bg-white text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/10 transition-all",
                testError ? "border-red-300" : "border-gray-200 focus:border-[#C8102E]"
              )}
            />
            <button type="button" onClick={runTest}
              disabled={testing}
              className="h-10 rounded-xl bg-[#C8102E] px-5 text-sm font-semibold text-white hover:bg-[#a80e26] disabled:opacity-50 transition-colors shrink-0 flex items-center gap-1.5">
              {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
              {testing ? "Testing…" : "Test behaviour"}
            </button>
          </div>
          {testError && (
            <p className="text-xs text-red-500">Enter a sample user message to test behaviour.</p>
          )}

          {testResult && !testing && (
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden animate-[slideUp_0.2s_ease]">
              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                <div className="p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Detected intent</p>
                  <span className="inline-block rounded-full bg-purple-100 text-purple-700 px-2.5 py-0.5 text-xs font-semibold">
                    {testResult.intent}
                  </span>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-3 mb-1">Next best question</p>
                  <p className="text-sm text-[#0A2540] italic leading-snug">&ldquo;{testResult.nextQuestion}&rdquo;</p>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Required data</p>
                  <ul className="space-y-1 mb-3">
                    {testResult.requiredData.map((d) => (
                      <li key={d} className="flex items-center gap-1.5 text-xs text-[#0A2540]">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#C8102E] shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Suggested next action</p>
                  <p className="text-xs text-[#0A2540]">{testResult.suggestedAction}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-[#C8102E]" />
          <p className="text-sm font-semibold text-[#0A2540]">Agent instructions</p>
        </div>
        <textarea
          value={config.instructions || DEFAULT_INSTRUCTIONS.replace("{clientName}", value.clientName || "your client")}
          onChange={(e) => onChange({ instructions: e.target.value })}
          rows={5}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0A2540] font-mono leading-relaxed resize-none focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10" />
      </div>

      {/* Behavior & tone */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4">
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

      {/* Conversation workflow */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <p className="text-sm font-semibold text-[#0A2540] mb-4">Conversation workflow</p>
        <div className="space-y-3">
          {([
            { key: "startWithIntentDetection" as const, label: "Start with intent detection" },
            { key: "askOneAtATime" as const,            label: "Ask one question at a time" },
            { key: "confirmBeforePhone" as const,       label: "Confirm before collecting phone number" },
            { key: "askConsentBeforeHandoff" as const,  label: "Ask consent before handoff" },
            { key: "offerWhatsApp" as const,            label: "Offer WhatsApp continuation" },
            { key: "offerCallback" as const,            label: "Offer advisor callback" },
          ] as const).map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between gap-3 py-1">
              <span className="text-sm text-[#0A2540]">{label}</span>
              <Tog on={config.workflowRules[key]}
                onToggle={() => onChange({ workflowRules: { ...config.workflowRules, [key]: !config.workflowRules[key] } })} />
            </div>
          ))}
        </div>
      </div>

      {/* Intent classification */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <p className="text-sm font-semibold text-[#0A2540] mb-1">Auto intent classification</p>
        <p className="text-xs text-gray-400 mb-4">Toggle the intents APEX should detect and route.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {config.intentCategories.map((cat) => (
            <div key={cat.id}
              className={cn("flex items-center justify-between gap-2 rounded-xl border px-4 py-2.5 transition-all",
                cat.enabled ? "border-[#C8102E]/20 bg-[#fff4f6]" : "border-gray-100 bg-gray-50")}>
              <span className={cn("text-sm font-medium", cat.enabled ? "text-[#C8102E]" : "text-gray-500")}>
                {cat.label}
              </span>
              <Tog on={cat.enabled} onToggle={() => toggleIntent(cat.id)} />
            </div>
          ))}
        </div>
      </div>

      {/* Tool actions */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
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
                  {tool.enabled && <p className="text-xs text-emerald-600 mt-0.5">→ {tool.result}</p>}
                </div>
                <Tog on={tool.enabled} onToggle={() => toggleTool(tool.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guardrails */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-4 w-4 text-[#C8102E]" />
          <p className="text-sm font-semibold text-[#0A2540]">Guardrails</p>
        </div>
        <p className="text-xs text-gray-400 mb-4">Rules APEX always follows. Toggle to enable or disable.</p>
        <div className="space-y-2">
          {GUARDRAILS_LIST.map((g) => {
            const enabled = config.guardrails.includes(g);
            return (
              <div key={g}
                className={cn("flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 transition-all",
                  enabled ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50 opacity-60")}>
                <span className="text-sm text-[#0A2540]">{g}</span>
                <Tog on={enabled} onToggle={() => toggleGuardrail(g)} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Fallback behavior */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-[#C8102E]" />
          <p className="text-sm font-semibold text-[#0A2540]">Fallback behavior</p>
        </div>
        {([
          { key: "unclearIntent" as const,  label: "Unclear intent",       options: ["Ask clarifying question", "Show journey menu", "Offer advisor callback"] },
          { key: "missingInfo" as const,    label: "Missing information",   options: ["Ask once more", "Skip and continue", "Offer callback"] },
          { key: "apiFailure" as const,     label: "API / system failure",  options: ["Notify user politely", "Offer callback", "Try again silently"] },
          { key: "humanHandoff" as const,   label: "Human handoff trigger", options: ["After 2 failed attempts", "On user request", "After 3 turns"] },
        ] as const).map(({ key, label, options }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
            <select value={config.fallbackBehavior[key]}
              onChange={(e) => onChange({ fallbackBehavior: { ...config.fallbackBehavior, [key]: e.target.value } })}
              className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm text-[#0A2540] bg-white focus:outline-none focus:border-[#C8102E] transition-all">
              {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Advanced: raw prompts */}
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
  const kbConfig: KnowledgeBaseConfig = value.knowledgeBaseConfig ?? defaultKBConfig();
  const atConfig: AgentTrainingConfig = value.agentTrainingConfig ?? defaultAgentTrainingConfig();

  function updateKB(patch: Partial<KnowledgeBaseConfig>) {
    onChange({ knowledgeBaseConfig: { ...kbConfig, ...patch } });
  }

  function updateAT(patch: Partial<AgentTrainingConfig>) {
    onChange({ agentTrainingConfig: { ...atConfig, ...patch } });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#C8102E] mb-1">Step 3 — Controls</p>
        <h2 className="text-2xl font-bold text-[#0A2540]">Knowledge & agent training</h2>
        <p className="text-sm text-gray-400 mt-1">Configure what APEX can reference and how it should behave.</p>
      </div>

      {/* ── Knowledge Base ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-100" />
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0A2540] text-[10px] font-bold text-white">1</div>
            <span className="text-sm font-bold text-[#0A2540] uppercase tracking-wide">Knowledge Base</span>
          </div>
          <div className="h-px flex-1 bg-gray-100" />
        </div>
        <KnowledgeBase config={kbConfig} onChange={updateKB} />
      </section>

      {/* ── Agent Training ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-100" />
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C8102E] text-[10px] font-bold text-white">2</div>
            <span className="text-sm font-bold text-[#0A2540] uppercase tracking-wide">Agent Training</span>
          </div>
          <div className="h-px flex-1 bg-gray-100" />
        </div>
        <AgentTraining config={atConfig} onChange={updateAT} onPromptChange={onPromptChange} value={value} />
      </section>
    </div>
  );
}
