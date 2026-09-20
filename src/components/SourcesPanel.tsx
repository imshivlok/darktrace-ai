import type { Source, SourceType, Reliability } from "../data/types";

interface SourcesPanelProps {
  sources: Source[];
}

const sourceTypeLabel: Record<SourceType, string> = {
  marketplace: "Marketplace",
  forum: "Forum",
  telegram: "Telegram",
  paste_site: "Paste site",
  leak: "Leak",
  osint: "OSINT",
};

const reliabilityStyles: Record<Reliability, string> = {
  unverified: "text-fg-subtle bg-fg/[0.04] border-line",
  low: "text-warn bg-warn/10 border-warn/30",
  medium: "text-info bg-info/10 border-info/30",
  high: "text-ok bg-ok/10 border-ok/30",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function SourcesPanel({ sources }: SourcesPanelProps) {
  return (
    <section className="rounded-2xl border border-line-faint bg-band/60 p-4 sm:p-6">
      <h2 className="mb-4 text-sm font-medium text-fg">Sources</h2>

      <ul className="space-y-2">
        {sources.map((source) => (
          <li
            key={source.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-card px-4 py-3 transition-colors duration-200 hover:border-line-strong"
          >
            <div className="min-w-0">
              <p className="truncate text-sm text-fg">{source.name}</p>
              <p className="text-xs text-fg-subtle">
                {sourceTypeLabel[source.type]} · observed{" "}
                {formatDate(source.observedAt)}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-medium ${reliabilityStyles[source.reliability]}`}
            >
              {source.reliability} reliability
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}