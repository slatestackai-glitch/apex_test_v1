"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { Compass, FileCheck2, LayoutTemplate, Menu, ShieldCheck, X } from "lucide-react";

import { DarkModeToggle } from "@/components/ui/DarkModeToggle";

const NAV_LINKS = [
  { label: "Create Demo", href: "/studio", icon: Compass },
  { label: "Recent Demos", href: "/output", icon: LayoutTemplate },
  { label: "Journey Library", href: "/journeys", icon: FileCheck2 },
  { label: "Guardrails", href: "/guardrails", icon: ShieldCheck },
];

export function Header({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="mb-6 rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] text-[var(--apex-text-secondary)] hover:bg-[var(--apex-border)] transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
              </div>
              {subtitle ? <p className="max-w-3xl text-sm text-[var(--apex-text-secondary)]">{subtitle}</p> : null}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Drawer backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-in drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-[var(--apex-surface)] shadow-2xl transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navigation drawer"
      >
        <div className="flex items-center justify-between border-b border-[var(--apex-border)] bg-[var(--apex-surface)] px-5 py-4">
          <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--apex-red)] text-sm font-bold text-white">
              AX
            </span>
            <span>
              <strong className="block text-sm leading-tight">APEX Studio</strong>
              <small className="text-[11px] text-[var(--apex-text-secondary)]">by Engati</small>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--apex-border)] text-[var(--apex-text-secondary)] hover:bg-[var(--apex-section-bg)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href + label}
              href={href}
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--apex-text-secondary)] hover:bg-[var(--apex-section-bg)] hover:text-[var(--apex-text-primary)] transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
