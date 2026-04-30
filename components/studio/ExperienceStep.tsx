"use client";

import { useState } from "react";
import { Layers, Bot, Globe } from "lucide-react";
import { AdvancedSettingsPanel } from "@/components/ui/AdvancedSettingsPanel";
import { cn } from "@/lib/utils";
import { ModeId, OverlayConfig, AssistConfig, PageConfig, BrandSettings, StudioInput } from "@/lib/projectSchema";

// ─── Visual mode previews ────────────────────────────────────────────────────

function OverlayPreview() {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 h-28 relative select-none">
      {/* Fake website behind */}
      <div className="h-6 bg-[#0A2540] flex items-center px-2 gap-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
        <div className="h-1 w-14 rounded bg-white/20" />
        <div className="ml-auto h-4 w-10 rounded bg-white/10" />
      </div>
      <div className="bg-gray-50 p-2 space-y-1">
        <div className="h-2 w-20 rounded bg-gray-200" />
        <div className="h-1.5 w-14 rounded bg-gray-200" />
        <div className="h-1.5 w-16 rounded bg-gray-200" />
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0A2540]/40 backdrop-blur-[1px] flex items-center justify-center">
        <div className="bg-white rounded-xl p-3 w-32 shadow-xl">
          <div className="h-1.5 w-4 rounded bg-[#C8102E] mb-1" />
          <div className="h-1.5 w-20 rounded bg-gray-200 mb-0.5" />
          <div className="h-1.5 w-16 rounded bg-gray-200 mb-0.5" />
          <div className="h-1.5 w-14 rounded bg-gray-200 mb-2" />
          <div className="h-5 w-20 rounded-lg bg-[#C8102E] flex items-center justify-center gap-1">
            <div className="h-0.5 w-8 rounded bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AssistPreview() {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 h-28 flex select-none">
      {/* Fake website content */}
      <div className="flex-1 bg-white p-2 space-y-1.5">
        <div className="h-5 rounded bg-[#0A2540] w-full" />
        <div className="h-1.5 w-16 rounded bg-gray-200" />
        <div className="h-1.5 w-12 rounded bg-gray-200" />
        <div className="h-6 w-16 rounded-lg bg-gray-200 mt-1" />
      </div>
      {/* Assist panel */}
      <div className="w-24 border-l border-gray-100 bg-[#F5F7FB] p-2 flex flex-col">
        <div className="h-1 w-6 rounded bg-[#C8102E] mb-1" />
        <div className="h-1 w-14 rounded bg-gray-200 mb-0.5" />
        <div className="h-1 w-10 rounded bg-gray-200 mb-0.5" />
        <div className="h-1 w-12 rounded bg-gray-200 mb-auto" />
        <div className="h-4 w-full rounded-lg bg-[#C8102E]/20 flex items-center px-1.5">
          <div className="h-0.5 w-6 rounded bg-[#C8102E]/50" />
        </div>
      </div>
    </div>
  );
}

function PagePreview() {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 h-28 select-none">
      {/* Dark hero */}
      <div className="h-18 bg-[#0A2540] p-2.5">
        <div className="h-5 w-full bg-[#0A2540]" />
        <div className="h-2 w-16 rounded bg-white/60 mb-0.5" />
        <div className="h-1.5 w-20 rounded bg-white/30 mb-1.5" />
        <div className="h-5 rounded-lg bg-white/95 flex items-center px-2 gap-1">
          <div className="h-2 w-2 rounded-full bg-[#C8102E] shrink-0" />
          <div className="h-1 w-12 rounded bg-gray-300" />
        </div>
      </div>
      {/* Below hero */}
      <div className="bg-white p-2 flex gap-1.5">
        {[1, 2, 3].map((i) => <div key={i} className="flex-1 h-4 rounded bg-gray-100" />)}
      </div>
    </div>
  );
}

// ─── Mode cards ──────────────────────────────────────────────────────────────

const MODE_DEFS: Array<{
  id: ModeId;
  label: string;
  description: string;
  bestFor: string;
  Icon: React.ElementType;
  Preview: React.ComponentType;
}> = [
  {
    id: "overlay",
    label: "APEX Overlay",
    description: "A guided modal appears above the existing site after a trigger.",
    bestFor: "Insurance, banking — high-intent pages where a single journey needs focus.",
    Icon: Layers,
    Preview: OverlayPreview,
  },
  {
    id: "assist",
    label: "APEX Assist",
    description: "APEX embeds alongside the native page, improving the existing flow.",
    bestFor: "Quote forms, renewal pages — where the native experience should be enhanced, not replaced.",
    Icon: Bot,
    Preview: AssistPreview,
  },
  {
    id: "page",
    label: "APEX Page",
    description: "A dedicated AI-first landing page with a conversational entry point.",
    bestFor: "Campaign pages, product launches — where a full APEX-driven experience makes sense.",
    Icon: Globe,
    Preview: PagePreview,
  },
];

const TONE_OPTIONS = ["Professional", "Warm", "Direct", "Premium"];

export function ExperienceStep({
  value,
  onToggleMode,
  onPrimaryMode,
  onOverlayConfig,
  onAssistConfig,
  onPageConfig,
  onBrandChange,
}: {
  value: StudioInput;
  onToggleMode: (modeId: ModeId) => void;
  onPrimaryMode: (modeId: ModeId) => void;
  onOverlayConfig: (patch: Partial<OverlayConfig>) => void;
  onAssistConfig: (patch: Partial<AssistConfig>) => void;
  onPageConfig: (patch: Partial<PageConfig>) => void;
  onBrandChange: (patch: Partial<BrandSettings>) => void;
}) {
  const selectedModes = value.selectedModeIds ?? [];
  const primaryMode = value.selectedPrimaryMode;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#C8102E] mb-1">Step 4 — Experience</p>
        <h2 className="text-2xl font-bold text-[#0A2540]">Choose the APEX mode</h2>
        <p className="text-sm text-gray-400 mt-1">Select how APEX appears to the end user. One mode is primary.</p>
      </div>

      {/* Mode cards with visual previews */}
      <div className="space-y-4">
        {MODE_DEFS.map(({ id, label, description, bestFor, Icon, Preview }) => {
          const isSelected = selectedModes.includes(id);
          const isPrimary = primaryMode === id;
          return (
            <div key={id}
              className={cn("rounded-2xl border-2 bg-white overflow-hidden transition-all",
                isPrimary ? "border-[#C8102E]" : isSelected ? "border-gray-300" : "border-gray-100 hover:border-gray-200")}>
              {/* Visual preview */}
              <div className="px-5 pt-5 pb-3">
                <Preview />
              </div>

              {/* Card body */}
              <div className="px-5 pb-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl",
                      isPrimary ? "bg-[#C8102E]/10" : "bg-gray-100")}>
                      <Icon className={cn("h-4 w-4", isPrimary ? "text-[#C8102E]" : "text-gray-500")} />
                    </div>
                    <div>
                      <p className={cn("text-sm font-bold", isPrimary ? "text-[#C8102E]" : "text-[#0A2540]")}>{label}</p>
                      {isPrimary && <span className="text-[10px] font-semibold text-[#C8102E] uppercase tracking-wider">Primary mode</span>}
                    </div>
                  </div>
                  <button type="button" onClick={() => { onToggleMode(id); onPrimaryMode(id); }}
                    className={cn("h-8 rounded-xl px-3 text-xs font-semibold transition-all shrink-0",
                      isPrimary ? "bg-[#C8102E] text-white"
                        : "border border-gray-200 text-gray-500 hover:border-[#C8102E] hover:text-[#C8102E]")}>
                    {isPrimary ? "Selected" : "Select"}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-1">{description}</p>
                <p className="text-[11px] text-gray-400 italic">Best for: {bestFor}</p>
              </div>

              {/* Mode-specific config (shown for primary) */}
              {isPrimary && (
                <div className="border-t border-gray-100 bg-[#F5F7FB] px-5 py-4 space-y-3 animate-[slideUp_0.2s_ease]">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label} settings</p>

                  {id === "overlay" && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Trigger timing</label>
                        <select value={value.overlayConfig?.triggerBehavior ?? "auto-5s"}
                          onChange={(e) => onOverlayConfig({ triggerBehavior: e.target.value as OverlayConfig["triggerBehavior"] })}
                          className="w-full h-9 rounded-xl border border-gray-200 px-3 text-xs bg-white focus:outline-none focus:border-[#C8102E]">
                          <option value="auto-3s">After 3 seconds</option>
                          <option value="auto-5s">After 5 seconds</option>
                          <option value="cta-click">On CTA click</option>
                          <option value="scroll-depth">On scroll depth</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Overlay size</label>
                        <select value={value.overlayConfig?.size ?? "80"}
                          onChange={(e) => onOverlayConfig({ size: e.target.value as OverlayConfig["size"] })}
                          className="w-full h-9 rounded-xl border border-gray-200 px-3 text-xs bg-white focus:outline-none focus:border-[#C8102E]">
                          <option value="70">70% width</option>
                          <option value="80">80% width</option>
                          <option value="full">Full screen</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Background blur</label>
                        <select value={value.overlayConfig?.blur ?? "medium"}
                          onChange={(e) => onOverlayConfig({ blur: e.target.value as OverlayConfig["blur"] })}
                          className="w-full h-9 rounded-xl border border-gray-200 px-3 text-xs bg-white focus:outline-none focus:border-[#C8102E]">
                          <option value="none">None</option>
                          <option value="light">Light</option>
                          <option value="medium">Medium</option>
                          <option value="strong">Strong</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Entry animation</label>
                        <select value={value.overlayConfig?.animation ?? "fade-scale"}
                          onChange={(e) => onOverlayConfig({ animation: e.target.value as OverlayConfig["animation"] })}
                          className="w-full h-9 rounded-xl border border-gray-200 px-3 text-xs bg-white focus:outline-none focus:border-[#C8102E]">
                          <option value="fade">Fade</option>
                          <option value="fade-scale">Fade + scale</option>
                          <option value="slide-up">Slide up</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {id === "assist" && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Default state</label>
                        <select value={value.assistConfig?.defaultState ?? "apex-first"}
                          onChange={(e) => onAssistConfig({ defaultState: e.target.value as AssistConfig["defaultState"] })}
                          className="w-full h-9 rounded-xl border border-gray-200 px-3 text-xs bg-white focus:outline-none focus:border-[#C8102E]">
                          <option value="native-first">Native first</option>
                          <option value="apex-first">APEX first</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Assist behavior</label>
                        <select value={value.assistConfig?.assistBehavior ?? "toggle"}
                          onChange={(e) => onAssistConfig({ assistBehavior: e.target.value as AssistConfig["assistBehavior"] })}
                          className="w-full h-9 rounded-xl border border-gray-200 px-3 text-xs bg-white focus:outline-none focus:border-[#C8102E]">
                          <option value="toggle">Toggle</option>
                          <option value="replace">Replace</option>
                          <option value="inline">Inline</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {id === "page" && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Hero headline</label>
                        <input type="text" value={value.pageConfig?.heroHeadline ?? ""}
                          onChange={(e) => onPageConfig({ heroHeadline: e.target.value })}
                          placeholder="e.g. Insurance that moves with you."
                          className="w-full h-9 rounded-xl border border-gray-200 px-3 text-xs text-[#0A2540] focus:outline-none focus:border-[#C8102E]" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">AI input placeholder</label>
                        <input type="text" value={value.pageConfig?.primaryCtaLabel ?? ""}
                          onChange={(e) => onPageConfig({ primaryCtaLabel: e.target.value })}
                          placeholder="e.g. Ask anything about insurance…"
                          className="w-full h-9 rounded-xl border border-gray-200 px-3 text-xs text-[#0A2540] focus:outline-none focus:border-[#C8102E]" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Module position</label>
                        <select value={value.pageConfig?.guidedModulePosition ?? "hero"}
                          onChange={(e) => onPageConfig({ guidedModulePosition: e.target.value as PageConfig["guidedModulePosition"] })}
                          className="w-full h-9 rounded-xl border border-gray-200 px-3 text-xs bg-white focus:outline-none focus:border-[#C8102E]">
                          <option value="hero">Hero</option>
                          <option value="mid-page">Mid page</option>
                          <option value="sticky">Sticky</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Brand & tone */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
        <p className="text-sm font-semibold text-[#0A2540]">Client branding</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Assistant name</label>
            <input type="text" value={value.brand?.assistantName ?? ""}
              onChange={(e) => onBrandChange({ assistantName: e.target.value })}
              placeholder="e.g. Ava"
              className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm text-[#0A2540] focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Logo initials</label>
            <input type="text" value={value.brand?.logoInitials ?? ""}
              onChange={(e) => onBrandChange({ logoInitials: e.target.value })}
              placeholder="e.g. NS"
              className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm text-[#0A2540] focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Tone</label>
            <select value={value.brand?.tone ?? "Professional and clear"}
              onChange={(e) => onBrandChange({ tone: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm text-[#0A2540] bg-white focus:outline-none focus:border-[#C8102E] transition-all">
              {TONE_OPTIONS.map((t) => <option key={t} value={`${t} and clear`}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">UI density</label>
            <select value={value.brand?.uiDensity ?? "Balanced"}
              onChange={(e) => onBrandChange({ uiDensity: e.target.value as BrandSettings["uiDensity"] })}
              className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm text-[#0A2540] bg-white focus:outline-none focus:border-[#C8102E] transition-all">
              <option value="Compact">Compact</option>
              <option value="Balanced">Balanced</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced */}
      <AdvancedSettingsPanel>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Primary color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={value.brand?.primaryColor ?? "#C8102E"}
                onChange={(e) => onBrandChange({ primaryColor: e.target.value })}
                className="h-9 w-12 rounded-lg border border-gray-200 cursor-pointer" />
              <input type="text" value={value.brand?.primaryColor ?? "#C8102E"}
                onChange={(e) => onBrandChange({ primaryColor: e.target.value })}
                className="flex-1 h-9 rounded-xl border border-gray-200 px-3 text-sm text-[#0A2540] font-mono focus:outline-none focus:border-[#C8102E]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">CTA label</label>
            <input type="text" value={value.brand?.welcomeMessage ?? ""}
              onChange={(e) => onBrandChange({ welcomeMessage: e.target.value })}
              placeholder="e.g. Get a quote"
              className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm text-[#0A2540] focus:outline-none focus:border-[#C8102E]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Border radius</label>
            <select value={value.brand?.borderRadius ?? "Soft"}
              onChange={(e) => onBrandChange({ borderRadius: e.target.value as BrandSettings["borderRadius"] })}
              className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm bg-white focus:outline-none focus:border-[#C8102E]">
              <option value="Soft">Soft (rounded)</option>
              <option value="Medium">Medium</option>
              <option value="Sharp">Sharp</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">CTA style</label>
            <select value={value.brand?.ctaStyle ?? "Solid"}
              onChange={(e) => onBrandChange({ ctaStyle: e.target.value as BrandSettings["ctaStyle"] })}
              className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm bg-white focus:outline-none focus:border-[#C8102E]">
              <option value="Solid">Solid</option>
              <option value="Outline">Outline</option>
              <option value="Soft">Soft</option>
            </select>
          </div>
        </div>
      </AdvancedSettingsPanel>
    </div>
  );
}
