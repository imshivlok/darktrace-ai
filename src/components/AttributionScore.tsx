// USE: Circular attribution-confidence gauge shown at the top of the
// EvidencePanel. Overall score is a weighted combination of 4 parameters
// (PGP key match, wallet reuse, stylometry, temporal correlation). Ring
// color interpolates green (low) -> red (high) based on the score.

import type { AttributionScoreBreakdown } from "../data/types";

interface AttributionScoreProps {
  breakdown: AttributionScoreBreakdown;
}

const WEIGHTS = {
  pgpKeyMatch: 0.35,
  walletReuse: 0.3,
  stylometricSimilarity: 0.2,
  temporalCorrelation: 0.15,
};

const PARAM_LABELS: { key: keyof AttributionScoreBreakdown; label: string }[] =
  [
    { key: "pgpKeyMatch", label: "PGP key match" },
    { key: "walletReuse", label: "Wallet reuse" },
    { key: "stylometricSimilarity", label: "Stylometric similarity" },
    { key: "temporalCorrelation", label: "Temporal correlation" },
  ];

function scoreToColor(score: number): string {
  // 0 -> green (hue 142), 100 -> red (hue 0)
  const hue = 142 - (142 * score) / 100;
  return `hsl(${hue}, 75%, 55%)`;
}

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function AttributionScore({ breakdown }: AttributionScoreProps) {
  const overall = Math.round(
    breakdown.pgpKeyMatch * WEIGHTS.pgpKeyMatch +
      breakdown.walletReuse * WEIGHTS.walletReuse +
      breakdown.stylometricSimilarity * WEIGHTS.stylometricSimilarity +
      breakdown.temporalCorrelation * WEIGHTS.temporalCorrelation,
  );
  const color = scoreToColor(overall);
  const offset = CIRCUMFERENCE - (overall / 100) * CIRCUMFERENCE;

  return (
    <div className="mb-6 flex flex-col items-center gap-6 rounded-2xl border border-slate-700/50 bg-[#111214]/70 p-5 sm:flex-row sm:items-center">
      <div className="relative h-32 w-32 shrink-0">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke="#1e293b"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{
              transition:
                "stroke-dashoffset 0.6s ease-out, stroke 0.6s ease-out",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-slate-100">
            {overall}%
          </span>
          <span className="text-[10px] text-slate-500">confidence</span>
        </div>
      </div>

      <div className="w-full space-y-2.5">
        <h3 className="text-sm font-medium text-slate-300">
          Attribution score breakdown
        </h3>
        {PARAM_LABELS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="w-40 shrink-0 text-xs text-slate-500">
              {label}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${breakdown[key]}%`,
                  backgroundColor: scoreToColor(breakdown[key]),
                }}
              />
            </div>
            <span className="w-10 shrink-0 text-right font-mono text-xs text-slate-400">
              {breakdown[key]}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
