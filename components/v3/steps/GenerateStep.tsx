"use client";

import { ArrowLeft, Layers, Bot, Globe, Sparkles } from "lucide-react";
import type { V3Project } from "@/lib/v3/types";

interface Props {
  project: V3Project;
  onGenerate: () => void;
  onPrev: () => void;
}

const MODE_LABELS: Record<string, string> = {
  overlay: "APEX Overlay",
  assist: "APEX Assist",
  page: "APEX Page",
};

const MODE_ICONS: Record<string, React.ElementType> = {
  overlay: Layers,
  assist: Bot,
  page: Globe,
};

export function GenerateStep({ project, onGenerate, onPrev }: Props) {
  const selectedJourneys = project.journeys.filter((j) => j.selected);
  const ModeIcon = project.mode ? MODE_ICONS[project.mode] : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-semibold text-[#C8102E] uppercase tracking-widest mb-2">Step 5 of 5</p>
        <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Generate</h1>
        <p className="text-gray-400 text-sm">Review your configuration and generate the client demo package.</p>
      </div>

      {/* Summary card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-6">
        <h2 className="text-sm font-bold text-[#0A2540] mb-5 uppercase tracking-wider">Summary</h2>

        <div className="space-y-5">
          {/* Client */}
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-gray-400 shrink-0">Client</p>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#0A2540]">{project.clientName || "—"}</p>
              {project.industry && (
                <p className="text-xs text-gray-400 capitalize">{project.industry}</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Goal */}
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-gray-400 shrink-0">Lead definition</p>
            <p className="text-sm font-medium text-[#0A2540] text-right max-w-xs">
              {project.businessGoal || "Not specified"}
            </p>
          </div>

          <div className="border-t border-gray-100" />

          {/* Journeys */}
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-gray-400 shrink-0">Journeys</p>
            <div className="text-right">
              {selectedJourneys.length === 0 ? (
                <p className="text-sm text-gray-400">None selected</p>
              ) : (
                <div className="flex flex-wrap justify-end gap-1.5">
                  {selectedJourneys.map((j) => (
                    <span
                      key={j.id}
                      className="rounded-full bg-[#C8102E]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#C8102E]"
                    >
                      {j.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Mode */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-400">APEX Mode</p>
            {project.mode && ModeIcon ? (
              <div className="flex items-center gap-2">
                <ModeIcon className="h-4 w-4 text-[#C8102E]" />
                <p className="text-sm font-semibold text-[#0A2540]">{MODE_LABELS[project.mode]}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Not selected</p>
            )}
          </div>

          <div className="border-t border-gray-100" />

          {/* Assistant */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-400">AI assistant</p>
            <p className="text-sm font-semibold text-[#0A2540]">{project.assistantName || "Ava"}</p>
          </div>

          <div className="border-t border-gray-100" />

          {/* Intelligence */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-400">Intelligence</p>
            <div className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full ${project.analyzed ? "bg-emerald-500" : "bg-gray-300"}`} />
              <p className={`text-sm font-medium ${project.analyzed ? "text-emerald-600" : "text-gray-400"}`}>
                {project.analyzed ? "Configured" : "Not analyzed"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What you'll get */}
      <div className="rounded-2xl border border-gray-100 bg-[#F5F7FB] p-6 mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">What you&apos;ll get</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { label: "Live Demo", desc: "Interactive insurance site with APEX AI" },
            { label: "Mind Map", desc: "Visual journey architecture" },
            { label: "Brief", desc: "Implementation roadmap" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-white border border-gray-100 p-4">
              <p className="text-xs font-bold text-[#0A2540] mb-1">{item.label}</p>
              <p className="text-[11px] text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
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
          onClick={onGenerate}
          className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#C8102E] px-8 text-base font-semibold text-white hover:bg-[#a80e26] shadow-sm shadow-[#C8102E]/30 transition-all hover:shadow-md hover:shadow-[#C8102E]/20"
        >
          <Sparkles className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
          Generate Demo
        </button>
      </div>
    </div>
  );
}
