"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Layers, Bot, Globe, ChevronDown, ChevronUp } from "lucide-react";
import type { V3Project, V3Mode } from "@/lib/v3/types";

interface Props {
  project: V3Project;
  onChange: (patch: Partial<V3Project>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const MODES: { id: V3Mode; label: string; description: string; Icon: React.ElementType }[] = [
  {
    id: "overlay",
    label: "APEX Overlay",
    description: "A guided modal appears over the site after a brief delay.",
    Icon: Layers,
  },
  {
    id: "assist",
    label: "APEX Assist",
    description: "An AI assistant panel embeds inline, inside the page.",
    Icon: Bot,
  },
  {
    id: "page",
    label: "APEX Page",
    description: "The website has a central AI input bar. Conversation expands below.",
    Icon: Globe,
  },
];

export function ExperienceStep({ project, onChange, onNext, onPrev }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const canProceed = project.mode !== null;

  function selectMode(m: V3Mode) {
    onChange({ mode: m });
  }

  function updateModeConfig(
    mode: V3Mode,
    patch: Partial<V3Project["modeConfig"][typeof mode]>
  ) {
    onChange({
      modeConfig: {
        ...project.modeConfig,
        [mode]: { ...project.modeConfig[mode], ...patch },
      },
    });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-semibold text-[#C8102E] uppercase tracking-widest mb-2">Step 3 of 5</p>
        <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Experience</h1>
        <p className="text-gray-400 text-sm">Choose one APEX mode. Each delivers the same journey — the integration differs.</p>
      </div>

      {/* Mode selection */}
      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        {MODES.map(({ id, label, description, Icon }) => {
          const isSelected = project.mode === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => selectMode(id)}
              className={`flex flex-col rounded-2xl border-2 bg-white p-5 text-left transition-all ${
                isSelected ? "border-[#C8102E]" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl mb-4 transition-colors ${
                  isSelected ? "bg-[#C8102E]/10" : "bg-gray-100"
                }`}
              >
                <Icon
                  className={`transition-colors ${isSelected ? "text-[#C8102E]" : "text-gray-500"}`}
                  style={{ width: 18, height: 18 }}
                />
              </div>
              <p className="text-sm font-bold text-[#0A2540] mb-1.5">{label}</p>
              <p className="text-xs text-gray-400 leading-relaxed flex-1">{description}</p>
              <div className="mt-4 flex items-center gap-1.5">
                <div
                  className={`h-3.5 w-3.5 rounded-full border-2 transition-colors ${
                    isSelected ? "border-[#C8102E] bg-[#C8102E]" : "border-gray-300"
                  }`}
                />
                <span
                  className={`text-[11px] font-medium transition-colors ${
                    isSelected ? "text-[#C8102E]" : "text-gray-400"
                  }`}
                >
                  {isSelected ? "Selected" : "Select"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mode-specific config panel */}
      {project.mode && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-6 animate-[slideUp_0.2s_ease]">
          <p className="text-sm font-bold text-[#0A2540] mb-4">
            {MODES.find((m) => m.id === project.mode)?.label} settings
          </p>

          {project.mode === "overlay" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0A2540] mb-2">
                  Trigger delay: <strong>{project.modeConfig.overlay.delaySeconds}s</strong>
                </label>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={project.modeConfig.overlay.delaySeconds}
                  onChange={(e) =>
                    updateModeConfig("overlay", { delaySeconds: Number(e.target.value) })
                  }
                  className="w-full accent-[#C8102E]"
                />
                <div className="flex justify-between text-[10px] text-gray-300 mt-1">
                  <span>Immediately</span>
                  <span>10 seconds</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0A2540] mb-2">Opening greeting</label>
                <input
                  type="text"
                  value={project.modeConfig.overlay.greeting}
                  onChange={(e) => updateModeConfig("overlay", { greeting: e.target.value })}
                  className="w-full h-10 rounded-xl border border-gray-200 px-4 text-sm text-[#0A2540] focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/15 transition-all"
                />
              </div>
            </div>
          )}

          {project.mode === "assist" && (
            <div>
              <label className="block text-sm font-medium text-[#0A2540] mb-3">Placement</label>
              <div className="flex gap-3">
                {(["hero", "sticky"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => updateModeConfig("assist", { placement: p })}
                    className={`flex-1 h-10 rounded-xl border-2 text-sm font-medium transition-all ${
                      project.modeConfig.assist.placement === p
                        ? "border-[#C8102E] text-[#C8102E] bg-[#C8102E]/5"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {p === "hero" ? "Hero section" : "Sticky bar"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {project.mode === "page" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0A2540] mb-2">Input bar label</label>
                <input
                  type="text"
                  value={project.modeConfig.page.inputLabel}
                  onChange={(e) => updateModeConfig("page", { inputLabel: e.target.value })}
                  className="w-full h-10 rounded-xl border border-gray-200 px-4 text-sm text-[#0A2540] focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/15 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0A2540] mb-2">Suggestion chips</label>
                <div className="space-y-2">
                  {project.modeConfig.page.suggestions.map((s, i) => (
                    <input
                      key={i}
                      type="text"
                      value={s}
                      onChange={(e) => {
                        const updated = [...project.modeConfig.page.suggestions];
                        updated[i] = e.target.value;
                        updateModeConfig("page", { suggestions: updated });
                      }}
                      className="w-full h-9 rounded-xl border border-gray-200 px-4 text-sm text-[#0A2540] focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/15 transition-all"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Assistant name */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-4">
        <label className="block text-sm font-semibold text-[#0A2540] mb-2">AI assistant name</label>
        <input
          type="text"
          value={project.assistantName}
          onChange={(e) => onChange({ assistantName: e.target.value })}
          placeholder="e.g. Ava"
          className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm text-[#0A2540] placeholder-gray-300 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/15 transition-all"
        />
      </div>

      {/* Advanced settings (collapsed) */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden mb-6">
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex w-full items-center justify-between px-6 py-4 text-sm font-medium text-gray-500 hover:text-[#0A2540] transition-colors"
        >
          <span>Advanced settings</span>
          {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showAdvanced && (
          <div className="border-t border-gray-100 px-6 py-5">
            <label className="block text-sm font-medium text-[#0A2540] mb-2">Brand accent color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                defaultValue="#C8102E"
                className="h-10 w-14 rounded-lg border border-gray-200 cursor-pointer"
              />
              <span className="text-sm text-gray-400">Engati red — used for all primary UI elements</span>
            </div>
          </div>
        )}
      </div>

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
          disabled={!canProceed}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#C8102E] px-6 text-sm font-semibold text-white hover:bg-[#a80e26] disabled:opacity-40 transition-colors"
        >
          Continue to Intelligence
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
