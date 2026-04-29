"use client";

import { ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";

export function DemoShell({
  client,
  hero,
  subcopy,
  modeSwitcher,
  children,
}: {
  client: string;
  hero: string;
  subcopy: string;
  modeSwitcher: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-[var(--apex-border)] bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--apex-text-secondary)]">Generated APEX demo</p>
            <h1 className="mt-1 text-2xl font-semibold">{hero}</h1>
            <p className="mt-1 max-w-3xl text-sm text-[var(--apex-text-secondary)]">{subcopy}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="simulated">Client: {client}</Badge>
              <Badge variant="simulated">Demo simulated</Badge>
              <Badge variant="simulated">Turn website intent into qualified leads</Badge>
            </div>
          </div>
          <div className="min-w-[320px] max-w-full">{modeSwitcher}</div>
        </div>
      </section>

      {children}
    </div>
  );
}
