"use client";

import { ArrowRight } from "lucide-react";
import type { V3Project, V3Industry } from "@/lib/v3/types";

const INDUSTRIES: { value: V3Industry; label: string }[] = [
  { value: "insurance", label: "Insurance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "banking", label: "Banking & Finance" },
  { value: "edtech", label: "Education & EdTech" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "other", label: "Other" },
];

interface Props {
  project: V3Project;
  onChange: (patch: Partial<V3Project>) => void;
  onNext: () => void;
}

export function ClientVisionStep({ project, onChange, onNext }: Props) {
  const canProceed = project.clientName.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-semibold text-[#C8102E] uppercase tracking-widest mb-2">Step 1 of 5</p>
        <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Client Vision</h1>
        <p className="text-gray-400 text-sm">Who is this demo for, and what does a qualified lead look like?</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 space-y-6">
        {/* Client name */}
        <div>
          <label className="block text-sm font-semibold text-[#0A2540] mb-2">
            Client name <span className="text-[#C8102E]">*</span>
          </label>
          <input
            type="text"
            value={project.clientName}
            onChange={(e) => onChange({ clientName: e.target.value })}
            placeholder="e.g. NovaSure Insurance"
            className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm text-[#0A2540] placeholder-gray-300 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/15 transition-all"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-semibold text-[#0A2540] mb-2">Industry</label>
          <select
            value={project.industry}
            onChange={(e) => onChange({ industry: e.target.value as V3Industry })}
            className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm text-[#0A2540] focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/15 transition-all bg-white"
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-semibold text-[#0A2540] mb-2">Website URL</label>
          <input
            type="url"
            value={project.website}
            onChange={(e) => onChange({ website: e.target.value })}
            placeholder="https://example.com"
            className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm text-[#0A2540] placeholder-gray-300 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/15 transition-all"
          />
        </div>

        {/* Business goal */}
        <div>
          <label className="block text-sm font-semibold text-[#0A2540] mb-2">
            What counts as a qualified lead?
          </label>
          <textarea
            value={project.businessGoal}
            onChange={(e) => onChange({ businessGoal: e.target.value })}
            rows={3}
            placeholder="e.g. A user who has selected a vehicle type, chosen a coverage tier, and submitted their phone number for a callback"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#0A2540] placeholder-gray-300 resize-none focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/15 transition-all"
          />
        </div>

        {/* Target audience */}
        <div>
          <label className="block text-sm font-semibold text-[#0A2540] mb-2">Target audience</label>
          <input
            type="text"
            value={project.targetAudience}
            onChange={(e) => onChange({ targetAudience: e.target.value })}
            placeholder="e.g. Urban professionals aged 25–45 buying their first car"
            className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm text-[#0A2540] placeholder-gray-300 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/15 transition-all"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#C8102E] px-6 text-sm font-semibold text-white hover:bg-[#a80e26] disabled:opacity-40 transition-colors"
        >
          Continue to Journeys
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
