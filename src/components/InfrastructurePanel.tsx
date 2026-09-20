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
  low: "text-fg-subtle bg-fg/[0.04] border-line",
  medium: "text-warn bg-warn/10 border-warn/30",
  high: "text-accent bg-accent/10 border-accent/30",
  confirmed: "text-ok bg-ok/10 border-ok/30",
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
    <section className="rounded-2xl border border-line-faint bg-band/60 p-4 sm:p-6">
      <h2 className="mb-1 text-sm font-medium text-fg">
        Infrastructure findings
      </h2>
      <p className="mb-4 text-xs text-fg-subtle">
        Misconfigurations on hidden services and their inferred link to clearnet
        infrastructure.
      </p>

      {findings.length === 0 ? (
        <p className="text-sm text-fg-subtle">
          No infrastructure findings recorded yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {findings.map((finding) => (
            <li
              key={finding.id}
              className="rounded-xl border border-line bg-card p-4 transition-colors duration-200 hover:border-line-strong"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs text-fg-muted truncate">
                  {finding.onionAddress}
                </span>
                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-line bg-fg/[0.04] px-2 py-0.5 text-[11px] text-fg-muted">
                    {misconfigLabel[finding.misconfigurationType]}
                  </span>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${confidenceStyles[finding.confidence]}`}
                  >
                    {finding.confidence}
                  </span>
                </div>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {finding.description}
              </p>

              {(finding.likelyOriginIp || finding.likelyOriginDomain) && (
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-band px-3 py-2 text-xs">
                  <span className="text-fg-subtle">Likely origin:</span>
                  {finding.likelyOriginDomain && (
                    <span className="font-mono text-accent">
                      {finding.likelyOriginDomain}
                    </span>
                  )}
                  {finding.likelyOriginIp && (
                    <span className="font-mono text-fg-muted">
                      {finding.likelyOriginIp}
                    </span>
                  )}
                </div>
              )}

              <p className="mt-2 text-[11px] text-fg-subtle">
                Detected {formatDate(finding.detectedAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}