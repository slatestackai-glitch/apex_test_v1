"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { V3Project } from "@/lib/v3/types";
import { loadV3ProjectById } from "@/lib/v3/storage";
import { InsuranceSiteShell } from "@/components/demo/InsuranceSiteShell";
import { ApexOverlayModal } from "@/components/demo/ApexOverlayModal";
import { ApexAssistDemo } from "@/components/demo/ApexAssistDemo";
import { ApexPageDemo } from "@/components/demo/ApexPageDemo";

const SAMPLE_PROJECT: V3Project = {
  id: "sample",
  clientName: "NovaSure Insurance",
  industry: "insurance",
  website: "https://novasure.example.com",
  businessGoal: "User selects vehicle type, coverage tier, and submits phone number",
  targetAudience: "Urban professionals aged 25–45",
  journeys: [
    { id: "buy-insurance", name: "Buy Insurance", intent: "Purchase a new policy", qualifies: "Vehicle type, coverage, phone", selected: true },
    { id: "renew-policy", name: "Renew Policy", intent: "Renew an expiring policy", qualifies: "Policy number, contact", selected: true },
  ],
  mode: "overlay",
  modeConfig: {
    overlay: { delaySeconds: 4, greeting: "Hi! I can help you find the right plan." },
    assist: { placement: "hero" },
    page: { inputLabel: "Ask anything about insurance", suggestions: ["Buy car insurance", "Renew my policy", "Talk to an advisor"] },
  },
  assistantName: "Ava",
  prompt: "",
  analyzed: true,
  generatedAt: new Date().toISOString(),
};

export function DemoExperienceV3({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<V3Project | null>(null);

  useEffect(() => {
    if (projectId === "sample") {
      setProject(SAMPLE_PROJECT);
      return;
    }
    const p = loadV3ProjectById(projectId);
    setProject(p ?? SAMPLE_PROJECT);
  }, [projectId]);

  if (!project) return null;

  const clientName = project.clientName || "NovaSure Insurance";
  const assistantName = project.assistantName || "Ava";
  const mode = project.mode ?? "overlay";

  return (
    <div>
      {/* Thin "back" bar so the presenter can navigate */}
      <div className="fixed top-0 left-0 right-0 z-[100] border-b border-gray-200 bg-white/90 backdrop-blur-sm px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#C8102E] text-[9px] font-bold text-white">
            AX
          </span>
          <span className="text-xs font-semibold text-[#0A2540]">APEX Demo</span>
          <span className="text-[11px] text-gray-400 hidden sm:inline">· {clientName}</span>
        </div>
        <Link
          href={`/v3/output/${projectId}`}
          className="text-[11px] font-medium text-gray-400 hover:text-[#0A2540] transition-colors"
        >
          ← Back to output
        </Link>
      </div>

      {/* Spacer for the bar */}
      <div className="h-10" />

      {mode === "overlay" && (
        <div className="relative">
          <InsuranceSiteShell clientName={clientName} onIntent={() => {}} />
          <ApexOverlayModal clientName={clientName} assistantName={assistantName} />
        </div>
      )}

      {mode === "assist" && (
        <ApexAssistDemo clientName={clientName} assistantName={assistantName} />
      )}

      {mode === "page" && (
        <ApexPageDemo clientName={clientName} assistantName={assistantName} />
      )}
    </div>
  );
}
