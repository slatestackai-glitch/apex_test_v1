"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BarChart3, Compass, FileCheck2, Flag, LayoutTemplate, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Create Demo", href: "/studio", icon: Compass },
  { label: "Recent Demos", href: "/output", icon: LayoutTemplate },
  { label: "Demo Package", href: "/output", icon: FileCheck2 },
  { label: "Journey Library", href: "/journeys", icon: Compass },
  { label: "Guardrails", href: "/guardrails", icon: ShieldCheck },
  { label: "Analytics Events", href: "/analytics-events", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 border-r border-[var(--apex-border)] bg-white p-4 lg:block">
      <Link href="/" className="mb-7 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--apex-red)] text-sm font-semibold text-white">
          AX
        </span>
        <span>
          <strong className="block text-base leading-tight">APEX Studio</strong>
          <small className="text-xs text-[var(--apex-text-secondary)]">by Engati</small>
        </span>
      </Link>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#e8f1ff] text-[var(--apex-blue)]"
                  : "text-[var(--apex-text-secondary)] hover:bg-[var(--apex-section-bg)]"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <details className="mt-8 rounded-xl border border-dashed border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3" open={false}>
        <summary className="cursor-pointer list-none text-sm font-medium">
          Roadmap modules
        </summary>
        <div className="mt-3 space-y-2 text-xs text-[var(--apex-text-secondary)]">
          <div className="flex items-center justify-between">
            <span>Industry Packs</span>
            <Badge>Roadmap</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Export History</span>
            <Badge>Roadmap</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Client Portal</span>
            <Badge>Roadmap</Badge>
          </div>
        </div>
      </details>

      <div className="mt-6 rounded-xl border border-[var(--apex-border)] bg-[#fff4f6] p-3 text-xs text-[var(--apex-text-secondary)]">
        <p className="font-semibold text-[var(--apex-text-primary)]">Prototype mode</p>
        <p className="mt-1">Website analysis and integrations are simulated for demo readiness.</p>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-[var(--apex-text-secondary)]">
        <Flag className="h-3.5 w-3.5" />
        Turn website intent into qualified leads
      </div>
    </aside>
  );
}
