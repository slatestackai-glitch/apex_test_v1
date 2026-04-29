"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { V3Project } from "@/lib/v3/types";
import { saveV3Project, loadV3Project } from "@/lib/v3/storage";
import { ClientVisionStep } from "@/components/v3/steps/ClientVisionStep";
import { JourneysStep } from "@/components/v3/steps/JourneysStep";
import { ExperienceStep } from "@/components/v3/steps/ExperienceStep";
import { IntelligenceStep } from "@/components/v3/steps/IntelligenceStep";
import { GenerateStep } from "@/components/v3/steps/GenerateStep";

const STEPS = [
  { n: 1, label: "Client Vision" },
  { n: 2, label: "Journeys" },
  { n: 3, label: "Experience" },
  { n: 4, label: "Intelligence" },
  { n: 5, label: "Generate" },
];

export default function StudioV3Page() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [project, setProject] = useState<V3Project | null>(null);

  useEffect(() => {
    setProject(loadV3Project());
  }, []);

  function update(patch: Partial<V3Project>) {
    setProject((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      saveV3Project(next);
      return next;
    });
  }

  function goNext() {
    setStep((s) => Math.min(s + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goPrev() {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleGenerate() {
    if (!project) return;
    const id = project.id || `proj-${Date.now().toString(36)}`;
    const final = { ...project, id, generatedAt: new Date().toISOString() };
    saveV3Project(final);
    router.push(`/v3/output/${id}`);
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {/* Sticky top nav */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-6 px-6 py-3">
          <Link href="/v3" className="flex items-center gap-2.5 shrink-0">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C8102E] text-[11px] font-bold text-white">
              AX
            </span>
            <span className="text-sm font-semibold text-[#0A2540] hidden sm:block">APEX Studio</span>
          </Link>

          {/* Step pills */}
          <div className="flex flex-1 items-center gap-1 overflow-x-auto">
            {STEPS.map((s) => (
              <button
                key={s.n}
                type="button"
                onClick={() => { setStep(s.n); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                  s.n === step
                    ? "bg-[#C8102E] text-white"
                    : s.n < step
                    ? "bg-[#C8102E]/10 text-[#C8102E] cursor-pointer"
                    : "bg-gray-100 text-gray-400 cursor-default"
                }`}
              >
                <span>{s.n}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Step content */}
      <main className="mx-auto max-w-4xl px-6 py-10">
        {step === 1 && (
          <ClientVisionStep project={project} onChange={update} onNext={goNext} />
        )}
        {step === 2 && (
          <JourneysStep project={project} onChange={update} onNext={goNext} onPrev={goPrev} />
        )}
        {step === 3 && (
          <ExperienceStep project={project} onChange={update} onNext={goNext} onPrev={goPrev} />
        )}
        {step === 4 && (
          <IntelligenceStep project={project} onChange={update} onNext={goNext} onPrev={goPrev} />
        )}
        {step === 5 && (
          <GenerateStep project={project} onGenerate={handleGenerate} onPrev={goPrev} />
        )}
      </main>
    </div>
  );
}
