"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import type { V3Project } from "@/lib/v3/types";

const DEFAULT_PROMPT = `You are a friendly and knowledgeable AI assistant for a leading insurance provider.

Your goal is to help users find the right insurance plan by understanding their needs, qualifying them through a short conversation, and connecting them with the right product or advisor.

Stay focused on insurance topics. Do not discuss competitors. Always be honest about what's covered and what isn't. When you've collected the key qualification criteria, offer to send the quote to the user's phone.`;

const ANALYSIS_STEPS = [
  "Parsing behavior instructions…",
  "Identifying qualification triggers…",
  "Mapping conversation branches…",
  "Validating guardrail coverage…",
  "Configuring handoff conditions…",
];

const SETUP_CHECKS = [
  "Lead qualification logic configured",
  "Conversation branches mapped",
  "Guardrails applied to sensitive topics",
  "Handoff conditions set",
  "Response tone calibrated",
];

interface Props {
  project: V3Project;
  onChange: (patch: Partial<V3Project>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function IntelligenceStep({ project, onChange, onNext, onPrev }: Props) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const prompt = project.prompt || DEFAULT_PROMPT;

  async function handleAnalyze() {
    if (analyzing) return;
    setAnalyzing(true);
    setAnalysisStep(0);
    onChange({ analyzed: false });

    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setAnalysisStep(i);
      await sleep(700 + Math.random() * 400);
    }

    setAnalyzing(false);
    onChange({ analyzed: true });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-semibold text-[#C8102E] uppercase tracking-widest mb-2">Step 4 of 5</p>
        <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Intelligence</h1>
        <p className="text-gray-400 text-sm">
          Define how the AI should behave, then analyze to generate the setup profile.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-4">
        <label className="block text-sm font-semibold text-[#0A2540] mb-3">Behavior prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => onChange({ prompt: e.target.value, analyzed: false })}
          rows={9}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#0A2540] font-mono leading-relaxed resize-none focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/15 transition-all"
        />
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Describe the AI persona, focus areas, and what to avoid.
          </p>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing || !prompt.trim()}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#0A2540] px-4 text-sm font-semibold text-white hover:bg-[#0a1f35] disabled:opacity-50 transition-colors"
          >
            {analyzing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {analyzing ? "Analyzing…" : "Analyze"}
          </button>
        </div>
      </div>

      {/* Analysis progress */}
      {analyzing && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-4 animate-[slideUp_0.2s_ease]">
          <div className="space-y-2">
            {ANALYSIS_STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                {i < analysisStep ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : i === analysisStep ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#C8102E] shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-200 shrink-0" />
                )}
                <span className={`text-sm ${i <= analysisStep ? "text-[#0A2540]" : "text-gray-300"}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Setup card (post-analysis) */}
      {project.analyzed && !analyzing && (
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6 mb-4 animate-[slideUp_0.25s_ease]">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0A2540]">Intelligence configured</p>
              <p className="text-xs text-gray-500">Ready to generate the demo</p>
            </div>
          </div>
          <div className="space-y-2">
            {SETUP_CHECKS.map((check) => (
              <div key={check} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="text-xs text-gray-600">{check}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-gray-200 px-5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!project.analyzed}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#C8102E] px-6 text-sm font-semibold text-white hover:bg-[#a80e26] disabled:opacity-40 transition-colors"
        >
          Review & Generate
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
