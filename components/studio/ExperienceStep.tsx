"use client";

import { useState } from "react";
import { Check, Layers, Bot, Globe } from "lucide-react";

import { AdvancedSettingsPanel } from "@/components/ui/AdvancedSettingsPanel";
import { cn } from "@/lib/utils";
import {
  ModeId,
  OverlayConfig,
  AssistConfig,
  PageConfig,
  BrandSettings,
  StudioInput,
} from "@/lib/projectSchema";

const MODE_CARDS: Array<{
  id: ModeId;
  label: string;
  description: string;
  Icon: React.ElementType;
  color: string;
}> = [
  {
    id: "overlay",
    label: "APEX Overlay",
    description: "Modal layer over the client site. Guided conversion journey with journey menu.",
    Icon: Layers,
    color: "var(--apex-red)",
  },
  {
    id: "assist",
    label: "APEX Assist",
    description: "Embedded assistant alongside the native site. Before/after comparison.",
    Icon: Bot,
    color: "var(--apex-blue)",
  },
  {
    id: "page",
    label: "APEX Page",
    description: "Standalone AI-native landing page purpose-built for conversion.",
    Icon: Globe,
    color: "#7C3AED",
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
  const selectedModeIds = value.selectedModeIds ?? ["overlay"];
  const [configTab, setConfigTab] = useState<ModeId>(selectedModeIds[0] ?? "overlay");
  const overlayConfig = value.overlayConfig;
  const assistConfig = value.assistConfig;
  const pageConfig = value.pageConfig;
  const brand = value.brand;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      {/* Mode selector */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--apex-text-primary)] mb-1">Select APEX modes</h2>
        <p className="text-sm text-[var(--apex-text-secondary)] mb-4">
          Choose how APEX will be deployed. Select multiple to demo all modes.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {MODE_CARDS.map((card) => {
            const isSelected = selectedModeIds.includes(card.id);
            const isPrimary = value.selectedPrimaryMode === card.id;

            return (
              <div
                key={card.id}
                className={cn(
                  "relative rounded-2xl border-2 p-4 transition-all",
                  isSelected
                    ? "border-[var(--apex-red)] bg-[#fff4f6]"
                    : "border-[var(--apex-border)] bg-[var(--apex-surface)]"
                )}
              >
                <div
                  className="mb-3 h-14 rounded-xl border flex items-center justify-center"
                  style={{ backgroundColor: isSelected ? `${card.color}10` : "var(--apex-section-bg)" }}
                >
                  <card.Icon
                    className="h-6 w-6"
                    style={{ color: isSelected ? card.color : "#94a3b8" }}
                  />
                </div>

                <p className="text-sm font-semibold text-[var(--apex-text-primary)] mb-1">{card.label}</p>
                <p className="text-[11px] text-[var(--apex-text-secondary)] leading-relaxed mb-3">
                  {card.description}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleMode(card.id)}
                    className={cn(
                      "flex-1 rounded-xl py-1.5 text-xs font-semibold transition-colors",
                      isSelected
                        ? "bg-[var(--apex-red)] text-white"
                        : "border border-[var(--apex-border)] bg-[var(--apex-surface)] text-[var(--apex-text-secondary)] hover:bg-[var(--apex-section-bg)]"
                    )}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </button>
                  {isSelected && !isPrimary && (
                    <button
                      type="button"
                      onClick={() => onPrimaryMode(card.id)}
                      className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] px-2 py-1.5 text-[10px] font-semibold text-[var(--apex-text-secondary)] hover:bg-[var(--apex-section-bg)]"
                    >
                      Set primary
                    </button>
                  )}
                  {isPrimary && isSelected && (
                    <span className="flex items-center gap-1 rounded-xl border border-[var(--apex-success)]/30 bg-[#f2fbf7] px-2 py-1.5 text-[10px] font-semibold text-[var(--apex-success)]">
                      <Check className="h-3 w-3" />
                      Primary
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Brand essentials */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--apex-text-primary)] mb-1">Brand & tone</h2>
        <p className="text-sm text-[var(--apex-text-secondary)] mb-4">
          How APEX looks and sounds for this client.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Assistant name</span>
            <input
              value={brand.assistantName}
              onChange={(e) => onBrandChange({ assistantName: e.target.value })}
              className="h-10 w-full rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] px-3 text-sm outline-none focus:border-[var(--apex-red)] focus:ring-2 focus:ring-[var(--apex-red)]/15 transition"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Tone</span>
            <div className="flex flex-wrap gap-2">
              {TONE_OPTIONS.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => onBrandChange({ tone })}
                  className={cn(
                    "rounded-xl px-3 py-2 text-xs font-semibold border transition-colors",
                    brand.tone === tone
                      ? "border-[var(--apex-red)] bg-[#fff4f6] text-[var(--apex-red)]"
                      : "border-[var(--apex-border)] bg-[var(--apex-surface)] text-[var(--apex-text-secondary)] hover:bg-[var(--apex-section-bg)]"
                  )}
                >
                  {tone}
                </button>
              ))}
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Primary color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brand.primaryColor}
                onChange={(e) => onBrandChange({ primaryColor: e.target.value })}
                className="h-10 w-14 rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] p-1 cursor-pointer"
              />
              <input
                value={brand.primaryColor}
                onChange={(e) => onBrandChange({ primaryColor: e.target.value })}
                className="h-10 flex-1 rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] px-3 text-sm font-mono outline-none focus:border-[var(--apex-red)] focus:ring-2 focus:ring-[var(--apex-red)]/15 transition"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Secondary color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brand.secondaryColor}
                onChange={(e) => onBrandChange({ secondaryColor: e.target.value })}
                className="h-10 w-14 rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] p-1 cursor-pointer"
              />
              <input
                value={brand.secondaryColor}
                onChange={(e) => onBrandChange({ secondaryColor: e.target.value })}
                className="h-10 flex-1 rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] px-3 text-sm font-mono outline-none focus:border-[var(--apex-red)] focus:ring-2 focus:ring-[var(--apex-red)]/15 transition"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Welcome message</span>
            <textarea
              value={brand.welcomeMessage}
              onChange={(e) => onBrandChange({ welcomeMessage: e.target.value })}
              rows={2}
              className="w-full rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] px-3 py-2.5 text-sm resize-none outline-none focus:border-[var(--apex-red)] focus:ring-2 focus:ring-[var(--apex-red)]/15 transition"
            />
          </label>
        </div>
      </section>

      {/* Advanced: mode configs + layout controls */}
      <AdvancedSettingsPanel subtitle="Trigger timing, overlay size, animation, surface style, density, and mode-specific behavior.">
        {selectedModeIds.length > 0 && (
          <div className="flex flex-col gap-5">
            {/* Mode config tabs */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)] mb-3">Mode configuration</p>
              <div className="flex gap-1 mb-4 rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-1">
                {selectedModeIds.map((modeId) => (
                  <button
                    key={modeId}
                    type="button"
                    onClick={() => setConfigTab(modeId)}
                    className={cn(
                      "flex-1 rounded-lg py-2 text-xs font-semibold transition-colors",
                      configTab === modeId
                        ? "bg-[var(--apex-surface)] text-[var(--apex-text-primary)] shadow-sm"
                        : "text-[var(--apex-text-secondary)] hover:text-[var(--apex-text-primary)]"
                    )}
                  >
                    {modeId === "overlay" ? "Overlay" : modeId === "assist" ? "Assist" : "Page"}
                  </button>
                ))}
              </div>

              {configTab === "overlay" && overlayConfig && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Trigger</span>
                    <select
                      value={overlayConfig.triggerBehavior}
                      onChange={(e) => onOverlayConfig({ triggerBehavior: e.target.value as OverlayConfig["triggerBehavior"] })}
                      className="h-10 w-full rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] px-3 text-sm outline-none focus:border-[var(--apex-red)]"
                    >
                      <option value="auto-3s">Auto — 3 seconds</option>
                      <option value="auto-5s">Auto — 5 seconds</option>
                      <option value="cta-click">On CTA click</option>
                      <option value="scroll-depth">On scroll depth</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Size</span>
                    <div className="flex gap-2">
                      {(["70", "80", "full"] as const).map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => onOverlayConfig({ size })}
                          className={cn(
                            "flex-1 rounded-xl py-2 text-xs font-semibold border transition-colors",
                            overlayConfig.size === size
                              ? "border-[var(--apex-red)] bg-[#fff4f6] text-[var(--apex-red)]"
                              : "border-[var(--apex-border)] bg-[var(--apex-surface)] text-[var(--apex-text-secondary)]"
                          )}
                        >
                          {size === "full" ? "Full" : `${size}%`}
                        </button>
                      ))}
                    </div>
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Blur</span>
                    <div className="flex gap-1">
                      {(["none", "light", "medium", "strong"] as const).map((blur) => (
                        <button
                          key={blur}
                          type="button"
                          onClick={() => onOverlayConfig({ blur })}
                          className={cn(
                            "flex-1 rounded-lg py-2 text-xs font-medium border transition-colors capitalize",
                            overlayConfig.blur === blur
                              ? "border-[var(--apex-red)] bg-[#fff4f6] text-[var(--apex-red)]"
                              : "border-[var(--apex-border)] bg-[var(--apex-surface)] text-[var(--apex-text-secondary)]"
                          )}
                        >
                          {blur}
                        </button>
                      ))}
                    </div>
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Animation</span>
                    <div className="flex gap-2">
                      {(["fade", "fade-scale", "slide-up"] as const).map((anim) => (
                        <button
                          key={anim}
                          type="button"
                          onClick={() => onOverlayConfig({ animation: anim })}
                          className={cn(
                            "flex-1 rounded-xl py-2 text-xs font-medium border transition-colors",
                            overlayConfig.animation === anim
                              ? "border-[var(--apex-red)] bg-[#fff4f6] text-[var(--apex-red)]"
                              : "border-[var(--apex-border)] bg-[var(--apex-surface)] text-[var(--apex-text-secondary)]"
                          )}
                        >
                          {anim}
                        </button>
                      ))}
                    </div>
                  </label>

                  <label className="flex flex-col gap-1.5 sm:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Close behavior</span>
                    <div className="flex gap-2">
                      {(["allow-close", "minimize-pill", "reopen-cta"] as const).map((cb) => (
                        <button
                          key={cb}
                          type="button"
                          onClick={() => onOverlayConfig({ closeBehavior: cb })}
                          className={cn(
                            "flex-1 rounded-xl py-2 text-xs font-medium border transition-colors",
                            overlayConfig.closeBehavior === cb
                              ? "border-[var(--apex-red)] bg-[#fff4f6] text-[var(--apex-red)]"
                              : "border-[var(--apex-border)] bg-[var(--apex-surface)] text-[var(--apex-text-secondary)]"
                          )}
                        >
                          {cb === "allow-close" ? "Allow close" : cb === "minimize-pill" ? "Minimize to pill" : "Reopen on CTA"}
                        </button>
                      ))}
                    </div>
                  </label>
                </div>
              )}

              {configTab === "assist" && assistConfig && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Native journey type</span>
                    <select
                      value={assistConfig.nativeJourneyType}
                      onChange={(e) => onAssistConfig({ nativeJourneyType: e.target.value as AssistConfig["nativeJourneyType"] })}
                      className="h-10 w-full rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] px-3 text-sm outline-none focus:border-[var(--apex-red)]"
                    >
                      <option value="quote-form">Quote form</option>
                      <option value="renewal-form">Renewal form</option>
                      <option value="claim-tracker">Claim tracker</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Default state</span>
                    <div className="flex gap-2">
                      {(["native-first", "apex-first"] as const).map((state) => (
                        <button
                          key={state}
                          type="button"
                          onClick={() => onAssistConfig({ defaultState: state })}
                          className={cn(
                            "flex-1 rounded-xl py-2.5 text-xs font-semibold border transition-colors",
                            assistConfig.defaultState === state
                              ? "border-[var(--apex-red)] bg-[#fff4f6] text-[var(--apex-red)]"
                              : "border-[var(--apex-border)] bg-[var(--apex-surface)] text-[var(--apex-text-secondary)]"
                          )}
                        >
                          {state === "native-first" ? "Native first" : "APEX first"}
                        </button>
                      ))}
                    </div>
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Show comparison</span>
                    <div className="flex gap-2">
                      {([true, false] as const).map((val) => (
                        <button
                          key={String(val)}
                          type="button"
                          onClick={() => onAssistConfig({ showComparison: val })}
                          className={cn(
                            "flex-1 rounded-xl py-2.5 text-xs font-semibold border transition-colors",
                            assistConfig.showComparison === val
                              ? "border-[var(--apex-red)] bg-[#fff4f6] text-[var(--apex-red)]"
                              : "border-[var(--apex-border)] bg-[var(--apex-surface)] text-[var(--apex-text-secondary)]"
                          )}
                        >
                          {val ? "Yes" : "No"}
                        </button>
                      ))}
                    </div>
                  </label>
                </div>
              )}

              {configTab === "page" && pageConfig && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Page type</span>
                    <select
                      value={pageConfig.pageType}
                      onChange={(e) => onPageConfig({ pageType: e.target.value as PageConfig["pageType"] })}
                      className="h-10 w-full rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] px-3 text-sm outline-none focus:border-[var(--apex-red)]"
                    >
                      <option value="campaign">Campaign</option>
                      <option value="product">Product</option>
                      <option value="quote-journey">Quote journey</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Module position</span>
                    <div className="flex gap-1">
                      {(["hero", "mid-page", "sticky"] as const).map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => onPageConfig({ guidedModulePosition: pos })}
                          className={cn(
                            "flex-1 rounded-lg py-2 text-xs font-medium border transition-colors",
                            pageConfig.guidedModulePosition === pos
                              ? "border-[var(--apex-red)] bg-[#fff4f6] text-[var(--apex-red)]"
                              : "border-[var(--apex-border)] bg-[var(--apex-surface)] text-[var(--apex-text-secondary)]"
                          )}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </label>

                  <label className="flex flex-col gap-1.5 sm:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Hero headline</span>
                    <input
                      value={pageConfig.heroHeadline}
                      onChange={(e) => onPageConfig({ heroHeadline: e.target.value })}
                      className="h-10 w-full rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] px-3 text-sm outline-none focus:border-[var(--apex-red)] focus:ring-2 focus:ring-[var(--apex-red)]/15 transition"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 sm:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Primary CTA label</span>
                    <input
                      value={pageConfig.primaryCtaLabel}
                      onChange={(e) => onPageConfig({ primaryCtaLabel: e.target.value })}
                      className="h-10 w-full rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] px-3 text-sm outline-none focus:border-[var(--apex-red)] focus:ring-2 focus:ring-[var(--apex-red)]/15 transition"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        )}
      </AdvancedSettingsPanel>
    </div>
  );
}
