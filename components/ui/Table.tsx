import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Table({ headers, rows, className }: { headers: string[]; rows: ReactNode[][]; className?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-[var(--apex-border)]", className)}>
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-[var(--apex-section-bg)] text-left text-[var(--apex-text-secondary)]">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-3 py-2 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, rowIndex) => (
            <tr key={`row-${rowIndex}`} className="border-t border-[var(--apex-border)]">
              {cells.map((cell, cellIndex) => (
                <td key={`row-${rowIndex}-cell-${cellIndex}`} className="px-3 py-2 align-top text-[var(--apex-text-primary)]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
