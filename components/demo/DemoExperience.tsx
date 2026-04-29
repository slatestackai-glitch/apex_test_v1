"use client";

import { useState } from "react";
import { Layers, Bot, Globe, Shield } from "lucide-react";

import { ApexAssistDemo } from "@/components/demo/ApexAssistDemo";
import { ApexOverlayModal } from "@/components/demo/ApexOverlayModal";
import { ApexPageDemo } from "@/components/demo/ApexPageDemo";
import { InsuranceSiteShell } from "@/components/demo/InsuranceSiteShell";
import { PasswordGate } from "@/components/shell/PasswordGate";
import { ApexProject, ModeId } from "@/lib/projectSchema";

const MODE_META: Record<ModeId, { label: string; description: string; Icon: React.ElementType }> = {
  overlay: {
    label: "APEX Overlay",
    description: "A guided modal appears over the site after a few seconds.",
    Icon: Layers,
  },
  assist: {
    label: "APEX Assist",
    description: "An AI assistant embeds inline, directly inside the page.",
    Icon: Bot,
  },
  page: {
    label: "APEX Page",
    description: "The website has a central AI input bar. Conversation unfolds below.",
    Icon: Globe,
  },
};

export function DemoExperience({ project }: { project: ApexProject }) {
  const availableModes = (project.selectedModeIds?.length ? project.selectedModeIds : ["overlay", "assist", "page"]) as ModeId[];
  const [hoveredMode, setHoveredMode] = useState<ModeId | null>(null);
  const [selectedMode, setSelectedMode] = useState<ModeId | null>(null);

  const clientName = project.client || "NovaSure Insurance";
  const assistantName = project.brand?.assistantName || "Ava";
  const shortName = clientName.replace(/insurance/i, "").trim();

  function content() {
  // Mode picker — light, clean, radio-style
  if (!selectedMode) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex flex-col">
        {/* Minimal top bar */}
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C8102E]">
                <Shield className="text-white" style={{ width: 16, height: 16 }} />
              </div>
              <span className="text-sm font-bold text-[#0A2540]">{shortName || clientName}</span>
            </div>
            <span className="rounded-full bg-[#C8102E]/10 px-3 py-1 text-[11px] font-semibold text-[#C8102E] uppercase tracking-wider">
              APEX Demo
            </span>
          </div>
        </header>

        {/* Picker body */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#0A2540] mb-2 tracking-tight">
              How would you like to experience APEX?
            </h1>
            <p className="text-gray-400 text-sm">
              Select one mode. Each delivers the same journey — the integration differs.
            </p>
          </div>

          <div className="grid gap-4 w-full max-w-2xl sm:grid-cols-3">
            {availableModes.map((modeId) => {
              const meta = MODE_META[modeId];
              const Icon = meta.Icon;
              const isHovered = hoveredMode === modeId;
              return (
                <button
                  key={modeId}
                  type="button"
                  onClick={() => setSelectedMode(modeId)}
                  onMouseEnter={() => setHoveredMode(modeId)}
                  onMouseLeave={() => setHoveredMode(null)}
                  className={`flex flex-col rounded-2xl border-2 bg-white p-5 text-left transition-all duration-150 ${
                    isHovered
                      ? "border-[#C8102E] shadow-sm"
                      : "border-gray-200 hover:border-[#C8102E]/40"
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl mb-4 transition-colors ${
                    isHovered ? "bg-[#C8102E]/10" : "bg-gray-100"
                  }`}>
                    <Icon className={`h-4.5 w-4.5 transition-colors ${isHovered ? "text-[#C8102E]" : "text-gray-500"}`} style={{ width: 18, height: 18 }} />
                  </div>
                  <p className="text-sm font-bold text-[#0A2540] mb-1.5">{meta.label}</p>
                  <p className="text-xs text-gray-400 leading-relaxed flex-1">{meta.description}</p>

                  {/* Radio indicator */}
                  <div className="mt-4 flex items-center gap-1.5">
                    <div className={`h-3.5 w-3.5 rounded-full border-2 transition-colors ${
                      isHovered ? "border-[#C8102E] bg-[#C8102E]" : "border-gray-300"
                    }`}>
                      {isHovered && <div className="h-full w-full rounded-full bg-white scale-[0.4] block" />}
                    </div>
                    <span className={`text-[11px] font-medium transition-colors ${isHovered ? "text-[#C8102E]" : "text-gray-400"}`}>
                      {isHovered ? "Select" : "Click to select"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="mt-8 text-[11px] text-gray-400">
            Powered by Engati APEX · {clientName}
          </p>
        </div>
      </div>
    );
  }

  // Overlay: real website + overlay modal
  if (selectedMode === "overlay") {
    return (
      <div className="relative">
        <InsuranceSiteShell
          clientName={clientName}
          onIntent={() => {}}
        />
        <ApexOverlayModal
          clientName={clientName}
          assistantName={assistantName}
        />
      </div>
    );
  }

  // Assist: inline embedded experience
  if (selectedMode === "assist") {
    return (
      <ApexAssistDemo
        clientName={clientName}
        assistantName={assistantName}
      />
    );
  }

  // Page: full conversational interface
  return (
    <ApexPageDemo
      clientName={clientName}
      assistantName={assistantName}
    />
  );
  } // end content()

  return <PasswordGate>{content()}</PasswordGate>;
}
