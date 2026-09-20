import type { ThreatActor, AttributionConfidence } from "../data/types";

interface ActorHeaderProps {
  actor: ThreatActor;
}

const confidenceBadge: Record<AttributionConfidence, string> = {
  low: "text-fg-subtle border-line bg-fg/[0.04]",
  medium: "text-warn border-warn/30 bg-warn/10",
  high: "text-accent border-accent/30 bg-accent/10",
  confirmed: "text-ok border-ok/30 bg-ok/10",
};

export default function ActorHeader({ actor }: ActorHeaderProps) {
  return (
    <div className="rounded-[24px] border border-line bg-card p-6 shadow-surface">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-2xl font-medium text-fg tracking-tight">
              {actor.handle}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 border font-mono text-[11px] uppercase ${confidenceBadge[actor.attributionConfidence]}`}>
              {actor.attributionConfidence} CONFIDENCE
            </span>
          </div>

          {actor.aliases.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="text-fg-subtle">KNOWN ALIASES:</span>
              {actor.aliases.map((al) => (
                <span key={al.handle} className="rounded-md border border-line bg-band px-2 py-0.5 text-fg-muted">
                  {al.handle} <span className="text-fg-subtle">({al.platform})</span>
                </span>
              ))}
            </div>
          )}

          {actor.summary && (
            <p className="text-sm text-fg-muted leading-relaxed max-w-3xl pt-1">
              {actor.summary}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 border-t lg:border-t-0 lg:border-l border-line-faint pt-4 lg:pt-0 lg:pl-8 shrink-0 font-mono text-xs">
          <div>
            <div className="text-fg-subtle uppercase text-[10px]">First Observed</div>
            <div className="text-fg mt-0.5">{actor.firstSeen}</div>
          </div>
          <div>
            <div className="text-fg-subtle uppercase text-[10px]">Last Intercept</div>
            <div className="text-fg mt-0.5">{actor.lastSeen}</div>
          </div>
          <div className="col-span-2">
            <div className="text-fg-subtle uppercase text-[10px]">Active Verification Scan</div>
            <div className="text-accent mt-0.5">{actor.lastScanDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
