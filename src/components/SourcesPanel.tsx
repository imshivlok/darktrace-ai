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
  unverified: "text-slate-400 bg-slate-500/10 border-slate-500/30",
  low: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  medium: "text-cyan-300 bg-cyan-500/10 border-cyan-500/30",
  high: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
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
    <section className="rounded-2xl border border-slate-700/50 bg-[#111214]/70 backdrop-blur-xl p-4 sm:p-6">
      <h2 className="mb-4 text-sm font-medium text-slate-300">Sources</h2>

      <ul className="space-y-2">
        {sources.map((source) => (
          <li
            key={source.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-700/40 bg-slate-900/30 px-4 py-3 transition-colors duration-200 hover:border-zinc-500/30"
          >
            <div className="min-w-0">
              <p className="truncate text-sm text-slate-200">{source.name}</p>
              <p className="text-xs text-slate-500">
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
