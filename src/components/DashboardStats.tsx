// USE: Row of four headline numbers at the top of the dashboard.
// Everything is computed from the InvestigationCase passed in.

import type { ReactNode } from "react";
import type { InvestigationCase } from "../data/types";
import { overallScore } from "../data/mockChat";

interface DashboardStatsProps {
  data: InvestigationCase;
}

function Tile({
  label,
  value,
  unit,
  foot,
  valueClass = "text-fg",
  children,
}: {
  label: string;
  value: string | number;
  unit?: string;
  foot: string;
  valueClass?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-card p-4 shadow-surface sm:p-5">
      <span className="font-mono text-[11px] uppercase tracking-widest text-fg-subtle">
        {label}
      </span>
      <div className="mt-3 flex items-baseline gap-1">
        <span className={`font-display text-5xl leading-none ${valueClass}`}>
          {value}
        </span>
        {unit && <span className="text-lg text-fg-subtle">{unit}</span>}
      </div>
      {children}
      <span className="mt-3 text-xs text-fg-subtle">{foot}</span>
    </div>
  );
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const score = overallScore(data);
  const platforms = new Set(data.actor.aliases.map((a) => a.platform)).size;
  const strongFindings = data.infrastructure.filter(
    (f) => f.confidence === "high" || f.confidence === "confirmed",
  ).length;
  const flagged = data.transactions.filter((t) => t.status === "flagged");

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <Tile
        label="Attribution score"
        value={score}
        unit="%"
        foot="Composite of 4 signals"
      >
        <div
          className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-fg/[0.07]"
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Attribution score"
        >
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${score}%` }}
          />
        </div>
      </Tile>

      <Tile
        label="Linked identities"
        value={data.actor.aliases.length}
        foot={`Aliases across ${platforms} platform${platforms === 1 ? "" : "s"}`}
      />

      <Tile
        label="Infrastructure"
        value={data.infrastructure.length}
        foot={`${strongFindings} high-confidence finding${strongFindings === 1 ? "" : "s"}`}
      />

      <Tile
        label="Flagged transactions"
        value={flagged.length}
        valueClass={flagged.length > 0 ? "text-danger" : "text-fg"}
        foot={`Of ${data.transactions.length} tracked${
          flagged.length > 0 ? ` · ${flagged.map((t) => t.amount).join(", ")}` : ""
        }`}
      />
    </div>
  );
}
