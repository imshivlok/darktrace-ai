// USE: Vertical chronological feed of actor-related intelligence events
// (first observed, PGP key changes, cross-platform links, leaks, etc.).
// Events are sorted by date automatically — just pass the raw array.

import type { TimelineEvent, Source } from "../data/types";

interface TimelineProps {
  events: TimelineEvent[];
  sources?: Source[]; // optional, used to resolve sourceId -> name
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Timeline({ events, sources = [] }: TimelineProps) {
  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const sourceName = (id?: string) => sources.find((s) => s.id === id)?.name;

  return (
    <section className="rounded-2xl border border-line-faint bg-band/60 p-4 sm:p-6">
      <h2 className="mb-5 text-sm font-medium text-fg">Timeline</h2>

      <ol className="relative border-l border-line pl-6">
        {sorted.map((event) => (
          <li key={event.id} className="mb-6 last:mb-0">
            <span className="absolute -left-1.25 mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-band bg-accent" />
            <div className="flex flex-wrap items-baseline gap-x-3">
              <time className="font-mono text-xs text-fg-subtle">
                {formatDate(event.date)}
              </time>
              <h3 className="text-sm font-medium text-fg">
                {event.title}
              </h3>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-fg-muted">
              {event.description}
            </p>
            {sourceName(event.sourceId) && (
              <span className="mt-1 inline-block text-[11px] text-fg-subtle">
                Source: {sourceName(event.sourceId)}
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}