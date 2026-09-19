import type {
  InfrastructureFinding,
  MisconfigurationType,
  AttributionConfidence,
} from "../data/types";

interface InfrastructurePanelProps {
  findings: InfrastructureFinding[];
}

const misconfigLabel: Record<MisconfigurationType, string> = {
  exposed_server_status: "Exposed server-status page",
  ssl_certificate_reuse: "SSL certificate reuse",
  default_banner: "Default service banner",
  descriptor_inconsistency: "Descriptor inconsistency",
  shared_favicon_hash: "Shared favicon hash",
  leaked_header: "Leaked HTTP header",
};

const confidenceStyles: Record<AttributionConfidence, string> = {
  low: "text-slate-400 bg-slate-500/10 border-slate-500/30",
  medium: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  high: "text-cyan-300 bg-cyan-500/10 border-cyan-500/30",
  confirmed: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function InfrastructurePanel({
  findings,
}: InfrastructurePanelProps) {
  return (
    <section className="rounded-2xl border border-slate-700/50 bg-[#111214]/70 backdrop-blur-xl p-4 sm:p-6">
      <h2 className="mb-1 text-sm font-medium text-slate-300">
        Infrastructure findings
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        Misconfigurations on hidden services and their inferred link to clearnet
        infrastructure.
      </p>

      {findings.length === 0 ? (
        <p className="text-sm text-slate-500">
          No infrastructure findings recorded yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {findings.map((finding) => (
            <li
              key={finding.id}
              className="rounded-xl border border-slate-700/40 bg-slate-900/30 p-4 transition-colors duration-200 hover:border-zinc-500/30"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs text-slate-300 truncate">
                  {finding.onionAddress}
                </span>
                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-slate-700/60 bg-slate-800/40 px-2 py-0.5 text-[11px] text-slate-400">
                    {misconfigLabel[finding.misconfigurationType]}
                  </span>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${confidenceStyles[finding.confidence]}`}
                  >
                    {finding.confidence}
                  </span>
                </div>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {finding.description}
              </p>

              {(finding.likelyOriginIp || finding.likelyOriginDomain) && (
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-slate-800/30 px-3 py-2 text-xs">
                  <span className="text-slate-500">Likely origin:</span>
                  {finding.likelyOriginDomain && (
                    <span className="font-mono text-cyan-300">
                      {finding.likelyOriginDomain}
                    </span>
                  )}
                  {finding.likelyOriginIp && (
                    <span className="font-mono text-slate-300">
                      {finding.likelyOriginIp}
                    </span>
                  )}
                </div>
              )}

              <p className="mt-2 text-[11px] text-slate-500">
                Detected {formatDate(finding.detectedAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
