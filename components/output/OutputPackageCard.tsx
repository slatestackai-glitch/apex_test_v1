import { ReactNode } from "react";

import { Card } from "@/components/ui/Card";

export function OutputPackageCard({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions: ReactNode;
}) {
  return (
    <Card className="flex h-full flex-col justify-between">
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-[var(--apex-text-secondary)]">{description}</p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">{actions}</div>
    </Card>
  );
}
