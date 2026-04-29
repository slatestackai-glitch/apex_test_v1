"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Globe, Map, FileText, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import type { V3Project } from "@/lib/v3/types";
import { loadV3ProjectById } from "@/lib/v3/storage";
import { MindMapV3 } from "@/components/v3/mindmap/MindMapV3";

export function OutputPageV3({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<V3Project | null>(null);
  const [showMindMap, setShowMindMap] = useState(false);

  useEffect(() => {
    const p = loadV3ProjectById(projectId);
    setProject(p);
  }, [projectId]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-3">Demo not found.</p>
          <Link href="/v3/studio" className="text-sm font-medium text-[#C8102E] hover:underline">
            Build a new demo
          </Link>
        </div>
      </div>
    );
  }

  const selectedJourneys = project.journeys.filter((j) => j.selected);
  const clientName = project.clientName || "Client";

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {/* Nav */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/v3" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C8102E] text-[11px] font-bold text-white">
              AX
            </span>
            <span className="text-sm font-semibold text-[#0A2540]">APEX Studio</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/v3/studio"
              className="text-sm font-medium text-gray-500 hover:text-[#0A2540] transition-colors"
            >
              Edit demo
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 mb-6">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Demo generated
          </div>
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">{clientName}</h1>
          <p className="text-gray-400 text-sm">
            {selectedJourneys.length} journey{selectedJourneys.length !== 1 ? "s" : ""} &middot;{" "}
            {project.mode ? project.mode.charAt(0).toUpperCase() + project.mode.slice(1) : "—"} mode &middot;{" "}
            Assistant: {project.assistantName}
          </p>
        </div>

        {/* 3 output cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          {/* Demo Website — primary */}
          <div className="md:col-span-1 rounded-2xl border-2 border-[#C8102E] bg-white p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C8102E]/10 mb-5">
              <Globe className="h-5 w-5 text-[#C8102E]" />
            </div>
            <p className="text-base font-bold text-[#0A2540] mb-2">Demo Site</p>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Live interactive demo with real conversations and the full APEX experience.
            </p>
            <Link
              href={`/v3/demo/${projectId}`}
              className="inline-flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-[#C8102E] text-sm font-semibold text-white hover:bg-[#a80e26] transition-colors"
            >
              Open Demo
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mind Map */}
          <div className="md:col-span-1 rounded-2xl border border-gray-200 bg-white p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A2540]/5 mb-5">
              <Map className="h-5 w-5 text-[#0A2540]" />
            </div>
            <p className="text-base font-bold text-[#0A2540] mb-2">Journey Map</p>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Visual architecture of how leads move from intent to qualified handoff.
            </p>
            <button
              type="button"
              onClick={() => setShowMindMap((v) => !v)}
              className="inline-flex w-full h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 text-sm font-medium text-[#0A2540] hover:bg-gray-50 transition-colors"
            >
              {showMindMap ? "Hide map" : "View map"}
              <ArrowRight
                className={`h-3.5 w-3.5 transition-transform ${showMindMap ? "rotate-90" : ""}`}
              />
            </button>
          </div>

          {/* Implementation Brief */}
          <div className="md:col-span-1 rounded-2xl border border-gray-200 bg-white p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#7C3AED]/10 mb-5">
              <FileText className="h-5 w-5 text-[#7C3AED]" />
            </div>
            <p className="text-base font-bold text-[#0A2540] mb-2">Implementation Brief</p>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              CRM field mapping, integration checklist, and production readiness overview.
            </p>
            <button
              type="button"
              className="inline-flex w-full h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 text-sm font-medium text-[#0A2540] hover:bg-gray-50 transition-colors"
              onClick={() => {
                const el = document.getElementById("brief-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View brief
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Mind map panel */}
        {showMindMap && (
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden mb-10 animate-[slideUp_0.25s_ease]">
            <div className="border-b border-gray-100 px-6 py-4">
              <p className="text-sm font-semibold text-[#0A2540]">Journey architecture</p>
              <p className="text-xs text-gray-400">Lead Definition → Intents → Conversation → Qualification → Handoff</p>
            </div>
            <div style={{ height: 480 }}>
              <MindMapV3 project={project} />
            </div>
          </div>
        )}

        {/* Implementation Brief section */}
        <div id="brief-section" className="rounded-2xl border border-gray-200 bg-white p-8">
          <h2 className="text-lg font-bold text-[#0A2540] mb-6">Implementation Brief</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Journeys */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Journeys configured</p>
              {selectedJourneys.length === 0 ? (
                <p className="text-sm text-gray-400">None</p>
              ) : (
                <ul className="space-y-2">
                  {selectedJourneys.map((j) => (
                    <li key={j.id} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-[#0A2540]">{j.name}</p>
                        <p className="text-xs text-gray-400">Qualifies: {j.qualifies}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Integration checklist */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Integration checklist</p>
              <ul className="space-y-2">
                {[
                  "Connect CRM (Salesforce / HubSpot)",
                  "Configure WhatsApp Business API",
                  "Set up webhook for lead handoff",
                  "Map qualification fields to CRM",
                  "Test conversation flows in staging",
                  "Enable analytics event tracking",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="h-3.5 w-3.5 rounded border border-gray-300 shrink-0" />
                    <span className="text-sm text-gray-500">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lead definition */}
            <div className="sm:col-span-2 border-t border-gray-100 pt-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Lead definition</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {project.businessGoal || "Not specified — edit the demo to add a lead definition."}
              </p>
            </div>

            {/* Target audience */}
            {project.targetAudience && (
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Target audience</p>
                <p className="text-sm text-gray-600">{project.targetAudience}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
