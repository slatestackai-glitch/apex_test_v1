"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { SlidersHorizontal, Zap } from "lucide-react";

import { Header } from "@/components/shell/Header";
import { AppShell } from "@/components/shell/AppShell";
import { ClientVisionStep } from "@/components/studio/ClientVisionStep";
import { JourneysStep } from "@/components/studio/JourneysStep";
import { ExperienceStep } from "@/components/studio/ExperienceStep";
import { KnowledgeControlsStep } from "@/components/studio/KnowledgeControlsStep";
import { GenerateStep } from "@/components/studio/GenerateStep";
import { StickyActionFooter } from "@/components/studio/StickyActionFooter";
import { studioSteps, StudioStepper } from "@/components/studio/StudioStepper";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createDefaultStudioInput, validatePrimaryMode } from "@/lib/projectGenerator";
import {
  AssistConfig,
  BrandSettings,
  IndustryId,
  ModeId,
  OverlayConfig,
  PageConfig,
  Phase,
  StudioInput,
} from "@/lib/projectSchema";

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default function StudioPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [draft, setDraft] = useState<StudioInput>(() => createDefaultStudioInput("insurance"));
  const [generating, setGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState(0);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isAdvanced, setIsAdvanced] = useState(false);

  const readyToGenerate = useMemo(() => {
    return Boolean(
      draft.clientName &&
      draft.websiteUrl &&
      draft.pageUrl &&
      draft.selectedJourneyIds.length > 0 &&
      draft.selectedModeIds.length > 0 &&
      draft.selectedModeIds.includes(draft.selectedPrimaryMode) &&
      draft.brand.clientName &&
      draft.brand.assistantName &&
      draft.brand.primaryColor &&
      (draft.leadDefinition?.normalizedSignals?.length ?? 0) > 0
    );
  }, [draft]);

  function patchDraft(patch: Partial<StudioInput>) {
    setDraft((previous) => ({ ...previous, ...patch }));
  }

  function onIndustryChange(industryId: IndustryId) {
    setDraft(createDefaultStudioInput(industryId));
    setCurrentStep(0);
  }

  function toggleJourney(journeyId: string) {
    setDraft((previous) => {
      const selected = previous.selectedJourneyIds.includes(journeyId);
      const selectedJourneyIds = selected
        ? previous.selectedJourneyIds.filter((id) => id !== journeyId)
        : [...previous.selectedJourneyIds, journeyId];
      return { ...previous, selectedJourneyIds };
    });
  }

  function setJourneyPhase(journeyId: string, phase: Phase) {
    setDraft((previous) => ({
      ...previous,
      journeyPhases: { ...previous.journeyPhases, [journeyId]: phase },
    }));
  }

  function onAddCustomJourney(journey: StudioInput["customJourneys"][0]) {
    setDraft((previous) => ({
      ...previous,
      customJourneys: [...(previous.customJourneys ?? []), journey],
      selectedJourneyIds: [...previous.selectedJourneyIds, journey.id],
      journeyPhases: { ...previous.journeyPhases, [journey.id]: journey.phase },
    }));
  }

  function toggleMode(modeId: ModeId) {
    setDraft((previous) => {
      const selected = previous.selectedModeIds.includes(modeId);
      const nextModeIds = selected
        ? previous.selectedModeIds.filter((id) => id !== modeId)
        : [...previous.selectedModeIds, modeId];
      const safePrimary = validatePrimaryMode(nextModeIds, previous.selectedPrimaryMode);
      return { ...previous, selectedModeIds: nextModeIds, selectedPrimaryMode: safePrimary };
    });
  }

  function setPrimaryMode(modeId: ModeId) {
    setDraft((previous) => ({
      ...previous,
      selectedPrimaryMode: modeId,
      selectedModeIds: previous.selectedModeIds.includes(modeId)
        ? previous.selectedModeIds
        : [...previous.selectedModeIds, modeId],
    }));
  }

  function onOverlayConfig(patch: Partial<OverlayConfig>) {
    setDraft((previous) => ({
      ...previous,
      overlayConfig: { ...previous.overlayConfig, ...patch },
    }));
  }

  function onAssistConfig(patch: Partial<AssistConfig>) {
    setDraft((previous) => ({
      ...previous,
      assistConfig: { ...previous.assistConfig, ...patch },
    }));
  }

  function onPageConfig(patch: Partial<PageConfig>) {
    setDraft((previous) => ({
      ...previous,
      pageConfig: { ...previous.pageConfig, ...patch },
    }));
  }

  function onBrandChange(patch: Partial<BrandSettings>) {
    setDraft((previous) => ({
      ...previous,
      brand: { ...previous.brand, ...patch },
    }));
  }

  function onPromptChange(field: keyof StudioInput["prompts"], text: string) {
    setDraft((previous) => ({
      ...previous,
      prompts: { ...previous.prompts, [field]: text },
    }));
  }

  function onSaveDraft() {
    localStorage.setItem("apex-studio-draft", JSON.stringify(draft));
    setLastSavedAt(new Date().toLocaleTimeString());
  }

  async function onGenerate() {
    if (!readyToGenerate) return;
    setGenerating(true);
    setGenerationStage(0);

    for (let stage = 0; stage < 7; stage += 1) {
      setGenerationStage(stage);
      await sleep(420);
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!response.ok) throw new Error("Failed to generate project package");
      const payload = (await response.json()) as { projectId: string };
      router.push(`/output/${payload.projectId}`);
    } catch {
      setGenerating(false);
      alert("Generation failed. Please retry.");
    }
  }

  function canContinueCurrentStep() {
    switch (currentStep) {
      case 0:
        return Boolean(
          draft.clientName &&
          draft.websiteUrl &&
          draft.pageUrl &&
          (draft.leadDefinition?.normalizedSignals?.length ?? 0) > 0
        );
      case 1:
        return draft.selectedJourneyIds.length > 0;
      case 2:
        return (
          draft.selectedModeIds.length > 0 &&
          Boolean(draft.brand.assistantName && draft.brand.clientName)
        );
      case 3:
        return true;
      case 4:
        return readyToGenerate;
      default:
        return false;
    }
  }

  const activeStep = (() => {
    switch (currentStep) {
      case 0:
        return (
          <ClientVisionStep
            value={draft}
            onChange={patchDraft}
            onIndustryChange={onIndustryChange}
          />
        );
      case 1:
        return (
          <JourneysStep
            value={draft}
            onToggleJourney={toggleJourney}
            onPhaseChange={setJourneyPhase}
            onAddCustomJourney={onAddCustomJourney}
            isAdvanced={isAdvanced}
          />
        );
      case 2:
        return (
          <ExperienceStep
            value={draft}
            onToggleMode={toggleMode}
            onPrimaryMode={setPrimaryMode}
            onOverlayConfig={onOverlayConfig}
            onAssistConfig={onAssistConfig}
            onPageConfig={onPageConfig}
            onBrandChange={onBrandChange}
          />
        );
      case 3:
        return (
          <KnowledgeControlsStep
            value={draft}
            onChange={patchDraft}
            onPromptChange={onPromptChange}
          />
        );
      case 4:
        return (
          <GenerateStep
            value={draft}
            generating={generating}
            generationStage={generationStage}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <>
      <AppShell>
        <main>
          <Header
            title="APEX Studio"
            subtitle="Build a client-ready demo package in 5 steps."
            actions={
              <>
                {lastSavedAt ? <Badge variant="success">Saved at {lastSavedAt}</Badge> : null}
                <button
                  type="button"
                  onClick={() => setIsAdvanced((v) => !v)}
                  className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors ${
                    isAdvanced
                      ? "border-[var(--apex-red)] bg-[#fff4f6] text-[var(--apex-red)]"
                      : "border-[var(--apex-border)] bg-[var(--apex-surface)] text-[var(--apex-text-secondary)] hover:bg-[var(--apex-section-bg)]"
                  }`}
                >
                  {isAdvanced ? <SlidersHorizontal className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                  {isAdvanced ? "Advanced" : "Simple"}
                </button>
                <Button variant="outline" onClick={onSaveDraft}>
                  Save Draft
                </Button>
              </>
            }
          />

          <StudioStepper currentStep={currentStep} onJump={setCurrentStep} />

          <section className="mt-6 pb-24">{activeStep}</section>
        </main>
      </AppShell>

      <StickyActionFooter
        canGoBack={currentStep > 0}
        canContinue={canContinueCurrentStep()}
        isFinalStep={currentStep === studioSteps.length - 1}
        onBack={() => setCurrentStep((step) => Math.max(0, step - 1))}
        onSave={onSaveDraft}
        onContinue={() => setCurrentStep((step) => Math.min(studioSteps.length - 1, step + 1))}
        onGenerate={onGenerate}
        generating={generating}
      />
    </>
  );
}
