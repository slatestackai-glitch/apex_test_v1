import Link from "next/link";

import { PasswordGate } from "@/components/shell/PasswordGate";

import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  FileText,
  Globe,
} from "lucide-react";

import { DarkModeToggle } from "@/components/ui/DarkModeToggle";

export default function HomePage() {
  return (
    <PasswordGate>
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[var(--apex-border)] bg-[var(--apex-surface)]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--apex-red)] text-sm font-bold text-white tracking-tight">
              AX
            </span>
            <span>
              <strong className="block text-sm leading-tight">APEX Studio</strong>
              <small className="text-[11px] text-[var(--apex-text-secondary)]">by Engati</small>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/demo/sample-insurance"
              className="hidden text-sm font-medium text-[var(--apex-text-secondary)] hover:text-[var(--apex-text-primary)] sm:block"
            >
              View Sample
            </Link>
            <DarkModeToggle />
            <Link
              href="/studio"
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-[var(--apex-red)] px-4 text-sm font-semibold text-white hover:bg-[#a80e26] transition-colors"
            >
              Create Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-16 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-[var(--apex-text-primary)] mb-3">
            Experience <span className="text-[var(--apex-red)]">APEX.</span>
          </h1>
          <p className="text-xl font-semibold text-[var(--apex-text-secondary)] mb-3">
            Create client-ready AI journeys for enterprise websites.
          </p>
          <p className="text-base text-[var(--apex-text-secondary)] max-w-xl mx-auto mb-8">
            Define the lead, design the conversation, and generate a polished demo package.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <Link
              href="/studio"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-[var(--apex-red)] px-7 text-base font-semibold text-white hover:bg-[#a80e26] transition-colors"
            >
              Create Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/demo/sample-insurance"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] px-6 text-sm font-medium text-[var(--apex-text-primary)] hover:bg-[var(--apex-section-bg)] transition-colors"
            >
              View Sample
            </Link>
          </div>
        </section>

        {/* 3 value cards */}
        <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)] p-6">
              <p className="text-sm font-bold text-[var(--apex-text-primary)] mb-2">Define the lead</p>
              <p className="text-sm text-[var(--apex-text-secondary)]">Set what counts as a qualified contact.</p>
            </div>
            <div className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)] p-6">
              <p className="text-sm font-bold text-[var(--apex-text-primary)] mb-2">Shape the journey</p>
              <p className="text-sm text-[var(--apex-text-secondary)]">Build guided paths around that definition.</p>
            </div>
            <div className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)] p-6">
              <p className="text-sm font-bold text-[var(--apex-text-primary)] mb-2">Generate the demo</p>
              <p className="text-sm text-[var(--apex-text-secondary)]">Get a PDF, demo site, and implementation brief.</p>
            </div>
          </div>
        </section>

        {/* 5-step strip */}
        <section className="border-t border-[var(--apex-border)] bg-[var(--apex-section-bg)]">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="mb-2 text-xl font-bold text-center">5-step guided flow.</h2>
            <p className="mb-8 text-[var(--apex-text-secondary)] text-center text-sm">
              From client context to complete demo package in one sitting.
            </p>

            <div className="grid gap-3 sm:grid-cols-5">
              {[
                { n: "1", label: "Client Vision", desc: "Industry, vertical, client details, and lead definition" },
                { n: "2", label: "Journeys", desc: "Select journeys and configure qualification logic" },
                { n: "3", label: "Experience", desc: "APEX UI mode, brand colors, tone, and assistant name" },
                { n: "4", label: "Controls", desc: "Behavior prompt, files, guardrails, handoff channels" },
                { n: "5", label: "Generate", desc: "Review and generate the full demo package" },
              ].map((step) => (
                <div key={step.n} className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)] p-4">
                  <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--apex-red)] text-xs font-bold text-white">
                    {step.n}
                  </div>
                  <p className="text-sm font-semibold">{step.label}</p>
                  <p className="mt-1 text-xs text-[var(--apex-text-secondary)] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Package preview cards */}
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-xl font-bold text-center">What you get</h2>
          <p className="mb-8 text-sm text-[var(--apex-text-secondary)] text-center">
            Every run generates a complete, client-ready package.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border-2 border-[var(--apex-red)] bg-[var(--apex-surface)] p-5">
              <div className="mb-3 flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-[var(--apex-red)]" />
                <span className="text-sm font-bold text-[var(--apex-red)]">PDF Mind Map</span>
              </div>
              <p className="text-sm font-semibold mb-2">Visual journey architecture</p>
              <p className="text-sm text-[var(--apex-text-secondary)]">
                Nodes, branches, and qualification logic — ready to share with the client.
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-[var(--apex-text-secondary)]">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[var(--apex-success)]" />Journey map</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[var(--apex-success)]" />Lead score model</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[var(--apex-success)]" />Handoff flow</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)] p-5">
              <div className="mb-3 flex items-center gap-2">
                <Globe className="h-5 w-5 text-[var(--apex-blue)]" />
                <span className="text-sm font-bold text-[var(--apex-blue)]">Demo Website</span>
              </div>
              <p className="text-sm font-semibold mb-2">Interactive demo experience</p>
              <p className="text-sm text-[var(--apex-text-secondary)]">
                Live demo with APEX Overlay, Assist, and Page modes on a realistic site shell.
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-[var(--apex-text-secondary)]">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[var(--apex-success)]" />Overlay mode</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[var(--apex-success)]" />Assist mode</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[var(--apex-success)]" />Page mode</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)] p-5">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#7C3AED]" />
                <span className="text-sm font-bold text-[#7C3AED]">Implementation Brief</span>
              </div>
              <p className="text-sm font-semibold mb-2">Production roadmap</p>
              <p className="text-sm text-[var(--apex-text-secondary)]">
                Field mapping, CRM events, risk matrix, integration architecture, and readiness checklist.
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-[var(--apex-text-secondary)]">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[var(--apex-success)]" />CRM field mapping</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[var(--apex-success)]" />Production checklist</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[var(--apex-success)]" />Risk matrix</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
    </PasswordGate>
  );
}
