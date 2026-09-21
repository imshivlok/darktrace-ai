// USE: Placeholder shaped like the dossier dashboard, shown under the
// SearchProgress card while a query runs. Decorative only.

import type { ReactNode } from "react";

function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-card p-4 shadow-surface sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton mt-4 h-10 w-16 rounded-lg" />
            <div className="skeleton mt-4 h-3 w-32 rounded" />
          </Card>
        ))}
      </div>

      {/* Actor header */}
      <div className="rounded-[24px] border border-line bg-card p-6 shadow-surface">
        <div className="flex flex-col justify-between gap-6 lg:flex-row">
          <div className="flex-1 space-y-4">
            <div className="skeleton h-8 w-56 rounded-lg" />
            <div className="flex flex-wrap gap-2">
              <div className="skeleton h-6 w-36 rounded-md" />
              <div className="skeleton h-6 w-32 rounded-md" />
              <div className="skeleton h-6 w-28 rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="skeleton h-3 w-full max-w-2xl rounded" />
              <div className="skeleton h-3 w-4/5 max-w-xl rounded" />
            </div>
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-x-8 gap-y-4 lg:pl-8">
            <div className="skeleton h-9 w-24 rounded" />
            <div className="skeleton h-9 w-24 rounded" />
            <div className="skeleton col-span-2 h-9 w-32 rounded" />
          </div>
        </div>
      </div>

      {/* Intelligence cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="flex items-center justify-between">
              <div className="skeleton h-4 w-20 rounded" />
              <div className="skeleton h-5 w-7 rounded-full" />
            </div>
            <div className="mt-4 space-y-3">
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-5/6 rounded" />
              <div className="skeleton h-3 w-2/3 rounded" />
            </div>
          </Card>
        ))}
      </div>

      {/* Workspace */}
      <div className="overflow-hidden rounded-[24px] border border-line bg-card shadow-surface">
        <div className="flex gap-6 border-b border-line-faint px-5 py-4">
          {[28, 24, 20, 20, 16, 20].map((w, i) => (
            <div
              key={i}
              className="skeleton h-4 rounded"
              style={{ width: `${w * 4}px` }}
            />
          ))}
        </div>
        <div className="p-4 sm:p-5">
          <div className="skeleton h-72 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}