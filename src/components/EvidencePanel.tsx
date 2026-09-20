// USE: Lists the reasoning/evidence behind detected relationships between
// identities — evidence type (stylometric, shared PGP/wallet, etc.) and
// confidence level. Sits below RelationshipGraph on the Investigation page.
import AttributionScore from "./AttributionScore";
import type { AttributionScoreBreakdown } from "../data/types";
import type {
  EvidenceItem,
  EvidenceType,
  AttributionConfidence,
} from "../data/types";

interface EvidencePanelProps {
  evidence: EvidenceItem[];
  attributionScore: AttributionScoreBreakdown;
}

const evidenceTypeLabel: Record<EvidenceType, string> = {
  stylometric: "Stylometric match",
  shared_pgp: "Shared PGP key",
  shared_wallet: "Shared wallet",
  temporal_correlation: "Temporal correlation",
  infrastructure_overlap: "Infrastructure overlap",
  manual_analyst: "Analyst assessment",
};

const confidenceStyles: Record<AttributionConfidence, string> = {
  low: "text-fg-subtle bg-fg/[0.04] border-line",
  medium: "text-warn bg-warn/10 border-warn/30",
  high: "text-accent bg-accent/10 border-accent/30",
  confirmed: "text-ok bg-ok/10 border-ok/30",
};

export default function EvidencePanel({
  evidence,
  attributionScore,
}: EvidencePanelProps) {
  return (
    <section className="rounded-2xl border border-line-faint bg-band/60 p-4 sm:p-6">
      <h2 className="mb-4 text-sm font-medium text-fg">
        Evidence &amp; reasoning
      </h2>
      <AttributionScore breakdown={attributionScore} />

      {evidence.length === 0 ? (
        <p className="text-sm text-fg-subtle">
          No supporting evidence recorded for this actor yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {evidence.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-line bg-card p-4 transition-colors duration-200 hover:border-line-strong"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs text-fg-muted">
                  {item.relationshipLabel}
                </span>
                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-line bg-fg/[0.04] px-2 py-0.5 text-[11px] text-fg-muted">
                    {evidenceTypeLabel[item.evidenceType]}
                  </span>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${confidenceStyles[item.confidence]}`}
                  >
                    {item.confidence}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}