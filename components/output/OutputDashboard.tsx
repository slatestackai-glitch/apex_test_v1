"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ClipboardCopy,
  ExternalLink,
  FileText,
  Monitor,
  ShieldCheck,
} from "lucide-react";

import { PdfDownloadButton } from "@/components/pdf/PdfDownloadButton";
import { AnalyticsFunnel } from "@/components/output/AnalyticsFunnel";
import { ImplementationBrief } from "@/components/output/ImplementationBrief";
import { IntegrationPlan } from "@/components/output/IntegrationPlan";
import { MindMapPreview } from "@/components/output/MindMapPreview";
import { ProductionReadiness } from "@/components/output/ProductionReadiness";
import { ApexProject } from "@/lib/projectSchema";

export function OutputDashboard({ project }: { project: ApexProject }) {
  const [copied, setCopied] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const primaryModeName =
    project.experienceModes.find((m) => m.id === project.selectedPrimaryMode)?.name ??
    project.selectedPrimaryMode;

  async function onCopyDemoLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/demo/${project.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function toggleSection(key: string) {
    setExpandedSection((prev) => (prev === key ? null : key));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <div className="rounded-2xl border border-[#c8efda] bg-[#f3fbf7] px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-5 w-5 text-[var(--apex-success)]" />
              <span className="text-sm font-semibold text-[var(--apex-success)]">Package ready</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--apex-text-primary)]">
              Your APEX demo package is ready.
            </h1>
            <p className="mt-1 text-sm text-[var(--apex-text-secondary)] max-w-xl">
              {project.client} — {project.selectedJourneys.length} journey{project.selectedJourneys.length > 1 ? "s" : ""},
              {" "}{primaryModeName} as primary mode. Demo site, PDF mind map, and implementation brief are all generated.
            </p>
          </div>
        </div>

        {/* Key stats */}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
          {[
            { label: "Journeys", value: String(project.selectedJourneys.length) },
            { label: "Mode", value: primaryModeName },
            { label: "Analytics events", value: String(project.analyticsEvents.length) },
            { label: "Guardrails", value: String(project.guardrails.length) },
            { label: "Knowledge sources", value: String(project.knowledgeSources.length) },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-1.5 text-sm">
              <span className="text-[var(--apex-text-secondary)]">{label}:</span>
              <span className="font-semibold text-[var(--apex-text-primary)]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Three primary action cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Demo website */}
        <div className="rounded-2xl border-2 border-[var(--apex-blue)] bg-[var(--apex-surface)] p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#e8f1ff] flex items-center justify-center">
              <Monitor className="h-4 w-4 text-[var(--apex-blue)]" />
            </div>
            <p className="text-sm font-semibold text-[var(--apex-text-primary)]">Demo website</p>
          </div>
          <p className="text-xs text-[var(--apex-text-secondary)] leading-relaxed flex-1 mb-4">
            Interactive APEX experience — Overlay, Assist, and Page modes all reach a qualified lead state.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href={`/demo/${project.id}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-[var(--apex-blue)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#094cb0] transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Open demo
            </Link>
            <button
              type="button"
              onClick={onCopyDemoLink}
              className="flex items-center justify-center gap-2 rounded-xl border border-[var(--apex-border)] px-4 py-2 text-sm font-medium text-[var(--apex-text-secondary)] hover:bg-[var(--apex-section-bg)] transition-colors"
            >
              <ClipboardCopy className="h-4 w-4" />
              {copied ? "Link copied" : "Copy link"}
            </button>
          </div>
        </div>

        {/* PDF mind map */}
        <div className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)] p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[var(--apex-section-bg)] flex items-center justify-center">
              <FileText className="h-4 w-4 text-[var(--apex-text-secondary)]" />
            </div>
            <p className="text-sm font-semibold text-[var(--apex-text-primary)]">PDF mind map</p>
          </div>
          <p className="text-xs text-[var(--apex-text-secondary)] leading-relaxed flex-1 mb-4">
            Client-ready PDF with visual mind map, journey recommendations, qualification logic, analytics, and implementation roadmap.
          </p>
          <PdfDownloadButton project={project} />
        </div>

        {/* Implementation brief */}
        <div className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)] p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[var(--apex-section-bg)] flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-[var(--apex-text-secondary)]" />
            </div>
            <p className="text-sm font-semibold text-[var(--apex-text-primary)]">Implementation brief</p>
          </div>
          <p className="text-xs text-[var(--apex-text-secondary)] leading-relaxed flex-1 mb-4">
            Technical and operational handoff — scope, field mapping, CRM events, integration dependencies, risk matrix.
          </p>
          <button
            type="button"
            onClick={() => {
              toggleSection("brief");
              setTimeout(() => document.getElementById("section-brief")?.scrollIntoView({ behavior: "smooth" }), 100);
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-[var(--apex-border)] px-4 py-2.5 text-sm font-medium text-[var(--apex-text-secondary)] hover:bg-[var(--apex-section-bg)] transition-colors"
          >
            <FileText className="h-4 w-4" />
            View brief
          </button>
        </div>
      </div>

      {/* Journey scope */}
      <div className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)] p-5">
        <h2 className="text-sm font-semibold text-[var(--apex-text-primary)] mb-4">Selected journeys</h2>
        {project.selectedJourneys.length > 0 ? (
          <div className="grid gap-1.5 sm:grid-cols-2">
            {project.selectedJourneys.map((j) => (
              <div key={j.id} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--apex-success)] shrink-0" />
                <span className="text-sm text-[var(--apex-text-primary)]">{j.name}</span>
                <span className="ml-auto text-[10px] text-[var(--apex-text-secondary)]">{j.crmEvent}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--apex-text-secondary)]">No journeys selected.</p>
        )}
      </div>

      {/* Mind map preview */}
      <MindMapPreview project={project} />

      {/* Progressive disclosure sections */}
      {(
        [
          { key: "readiness", label: "Production readiness", content: <ProductionReadiness project={project} /> },
          { key: "analytics", label: "Analytics event plan", content: <AnalyticsFunnel project={project} /> },
          { key: "integration", label: "Integration plan", content: <IntegrationPlan project={project} /> },
          { key: "brief", label: "Implementation brief", content: <ImplementationBrief project={project} /> },
        ] as const
      ).map(({ key, label, content }) => (
        <div key={key} id={`section-${key}`} className="rounded-2xl border border-[var(--apex-border)] bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection(key)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--apex-section-bg)] transition-colors"
          >
            <span className="text-sm font-semibold text-[var(--apex-text-primary)]">{label}</span>
            <ChevronDown
              className={`h-4 w-4 text-[var(--apex-text-secondary)] transition-transform ${
                expandedSection === key ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSection === key && (
            <div className="border-t border-[var(--apex-border)] p-5">{content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
