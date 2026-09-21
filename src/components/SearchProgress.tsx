// USE: "Searching…" card shown at the top of the dashboard while a query
// runs. Purely presentational: the page passes the current step and progress.

import { IconCheck } from "./icons";

interface SearchProgressProps {
  query: string;
  steps: string[];
  /** Index of the step currently running. */
  stepIndex: number;
  /** 0 to 1 */
  progress: number;
}

export default function SearchProgress({
  query,
  steps,
  stepIndex,
  progress,
}: SearchProgressProps) {
  const pct = Math.round(progress * 100);

  return (
    <div
      role="status"
      aria-live="polite"
      className="reveal relative overflow-hidden rounded-[24px] border border-line bg-card p-6 shadow-surface sm:p-8"
    >
      <span
        className="scan-line pointer-events-none absolute left-0 top-0 h-px w-2/5"
        aria-hidden="true"
      />

      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-accent/25 border-t-accent motion-reduce:animate-none"
            aria-hidden="true"
          />
          <p className="min-w-0 truncate font-mono text-xs text-fg-subtle">
            Query: <span className="text-fg">{query}</span>
          </p>
        </div>
        <span className="shrink-0 font-mono text-xs text-fg-muted">{pct}%</span>
      </div>

      <div
        className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-fg/[0.07]"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Search progress"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-150 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ol className="mt-6 space-y-3">
        {steps.map((label, i) => {
          const state =
            i < stepIndex ? "done" : i === stepIndex ? "active" : "pending";
          return (
            <li key={label} className="flex items-center gap-3 text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                {state === "done" && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ok/15 text-ok">
                    <IconCheck className="h-3 w-3" />
                  </span>
                )}
                {state === "active" && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent/25 border-t-accent motion-reduce:animate-none" />
                )}
                {state === "pending" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-fg-faint" />
                )}
              </span>
              <span
                className={
                  state === "active"
                    ? "text-fg"
                    : state === "done"
                      ? "text-fg-muted"
                      : "text-fg-faint"
                }
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
