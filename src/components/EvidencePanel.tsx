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
  low: "text-slate-400 bg-slate-500/10 border-slate-500/30",
  medium: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  high: "text-cyan-300 bg-cyan-500/10 border-cyan-500/30",
  confirmed: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
};

export default function EvidencePanel({
  evidence,
  attributionScore,
}: EvidencePanelProps) {
  return (
    <section className="rounded-2xl border border-slate-700/50 bg-[#111214]/70 backdrop-blur-xl p-4 sm:p-6">
      <h2 className="mb-4 text-sm font-medium text-slate-300">
        Evidence &amp; reasoning
      </h2>
      <AttributionScore breakdown={attributionScore} />

      {evidence.length === 0 ? (
        <p className="text-sm text-slate-500">
          No supporting evidence recorded for this actor yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {evidence.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-slate-700/40 bg-slate-900/30 p-4 transition-colors duration-200 hover:border-zinc-500/30"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs text-slate-300">
                  {item.relationshipLabel}
                </span>
                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-slate-700/60 bg-slate-800/40 px-2 py-0.5 text-[11px] text-slate-400">
                    {evidenceTypeLabel[item.evidenceType]}
                  </span>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${confidenceStyles[item.confidence]}`}
                  >
                    {item.confidence}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
