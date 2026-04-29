"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Plus, X, Check } from "lucide-react";
import type { V3Project, V3Journey } from "@/lib/v3/types";
import { PRESET_JOURNEYS } from "@/lib/v3/mockJourneys";

interface Props {
  project: V3Project;
  onChange: (patch: Partial<V3Project>) => void;
  onNext: () => void;
  onPrev: () => void;
}

function initJourneys(existing: V3Journey[]): V3Journey[] {
  const existingIds = new Set(existing.map((j) => j.id));
  const presets: V3Journey[] = PRESET_JOURNEYS.map((p) => ({
    ...p,
    selected: existing.find((e) => e.id === p.id)?.selected ?? false,
  }));
  const custom = existing.filter((e) => e.isCustom && !existingIds.has(e.id));
  return [...presets, ...custom];
}

export function JourneysStep({ project, onChange, onNext, onPrev }: Props) {
  const [journeys, setJourneys] = useState<V3Journey[]>(() =>
    initJourneys(project.journeys)
  );
  const [showModal, setShowModal] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customIntent, setCustomIntent] = useState("");
  const [customQualifies, setCustomQualifies] = useState("");

  const selectedCount = journeys.filter((j) => j.selected).length;
  const canProceed = selectedCount > 0;

  function toggle(id: string) {
    setJourneys((prev) =>
      prev.map((j) => (j.id === id ? { ...j, selected: !j.selected } : j))
    );
  }

  function addCustom() {
    if (!customName.trim()) return;
    const newJourney: V3Journey = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      intent: customIntent.trim() || "User needs help with a custom flow",
      qualifies: customQualifies.trim() || "Contact details collected",
      isCustom: true,
      selected: true,
    };
    setJourneys((prev) => [...prev, newJourney]);
    setCustomName("");
    setCustomIntent("");
    setCustomQualifies("");
    setShowModal(false);
  }

  function removeCustom(id: string) {
    setJourneys((prev) => prev.filter((j) => j.id !== id));
  }

  function handleNext() {
    onChange({ journeys });
    onNext();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-semibold text-[#C8102E] uppercase tracking-widest mb-2">Step 2 of 5</p>
        <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Journeys</h1>
        <p className="text-gray-400 text-sm">Select the user flows APEX will handle on the demo site.</p>
      </div>

      <div className="space-y-3 mb-4">
        {journeys.map((j) => {
          const isSelected = j.selected;
          return (
            <button
              key={j.id}
              type="button"
              onClick={() => toggle(j.id)}
              className={`w-full flex items-start gap-4 rounded-2xl border-2 bg-white p-5 text-left transition-all ${
                isSelected ? "border-[#C8102E]" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  isSelected ? "border-[#C8102E] bg-[#C8102E]" : "border-gray-300"
                }`}
              >
                {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#0A2540]">{j.name}</p>
                  {j.isCustom && (
                    <span className="rounded-full bg-[#C8102E]/10 px-2 py-0.5 text-[10px] font-semibold text-[#C8102E]">
                      Custom
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{j.intent}</p>
                <p className="text-[11px] text-gray-300 mt-1">Qualifies: {j.qualifies}</p>
              </div>
              {j.isCustom && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeCustom(j.id); }}
                  className="text-gray-300 hover:text-gray-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-4 text-sm font-medium text-gray-400 hover:border-[#C8102E]/40 hover:text-[#C8102E] transition-all"
      >
        <Plus className="h-4 w-4" />
        Add custom journey
      </button>

      {selectedCount > 0 && (
        <p className="mt-3 text-center text-xs text-gray-400">
          {selectedCount} journey{selectedCount !== 1 ? "s" : ""} selected
        </p>
      )}

      <div className="mt-6 flex items-center justify-between">
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
          onClick={handleNext}
          disabled={!canProceed}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#C8102E] px-6 text-sm font-semibold text-white hover:bg-[#a80e26] disabled:opacity-40 transition-colors"
        >
          Continue to Experience
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Custom journey modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2540]/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#0A2540]">Custom journey</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">
                  Journey name <span className="text-[#C8102E]">*</span>
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Compare Plans"
                  className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm text-[#0A2540] placeholder-gray-300 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/15 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">User intent</label>
                <input
                  type="text"
                  value={customIntent}
                  onChange={(e) => setCustomIntent(e.target.value)}
                  placeholder="e.g. User wants to compare multiple plans"
                  className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm text-[#0A2540] placeholder-gray-300 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/15 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">What it qualifies</label>
                <input
                  type="text"
                  value={customQualifies}
                  onChange={(e) => setCustomQualifies(e.target.value)}
                  placeholder="e.g. Budget range, coverage tier, contact details"
                  className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm text-[#0A2540] placeholder-gray-300 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/15 transition-all"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addCustom}
                disabled={!customName.trim()}
                className="flex-1 h-11 rounded-xl bg-[#C8102E] text-sm font-semibold text-white hover:bg-[#a80e26] disabled:opacity-40 transition-colors"
              >
                Add Journey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
