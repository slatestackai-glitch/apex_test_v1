import { ReactNode } from "react";

export function AppShell({ children, rightPanel }: { children: ReactNode; rightPanel?: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--apex-bg,#ffffff)]">
      <div className="mx-auto w-full max-w-[1100px] px-4 pb-16 pt-4 sm:px-6">
        {rightPanel ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">{children}<aside>{rightPanel}</aside></div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
