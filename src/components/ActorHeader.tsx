// USE: Top identity strip for the Investigation page.
// Shows the actor's handle, aliases, category, attribution confidence,
// and first/last seen dates. Pure presentational — pass a ThreatActor via props.

import type {
  ThreatActor,
  AttributionConfidence,
  ActorCategory,
} from "../data/types";

interface ActorHeaderProps {
  actor: ThreatActor;
}

const categoryLabels: Record<ActorCategory, string> = {
  vendor: "Vendor",
  forum_admin: "Forum admin",
  hacker: "Hacker",
  scammer: "Scammer",
  ransomware_operator: "Ransomware operator",
  unknown: "Unclassified",
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

export default function ActorHeader({ actor }: ActorHeaderProps) {
  return (
    <section className="rounded-2xl border border-slate-700/50 bg-[#111214]/70 backdrop-blur-xl p-5 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight truncate">
              {actor.handle}
            </h1>
            <span className="rounded-full border border-zinc-500/30 bg-zinc-500/10 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
              {categoryLabels[actor.category]}
            </span>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${confidenceStyles[actor.attributionConfidence]}`}
            >
              {actor.attributionConfidence} confidence
            </span>
          </div>

          {actor.aliases.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">Known aliases:</span>
              {actor.aliases.map((alias) => (
                <span
                  key={alias.handle}
                  className="rounded-md border border-slate-700/60 bg-slate-800/40 px-2 py-0.5 font-mono text-xs text-slate-300"
                  title={alias.platform}
                >
                  {alias.handle}
                </span>
              ))}
            </div>
          )}

          {actor.summary && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
              {actor.summary}
            </p>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 shrink-0 sm:text-right">
          <div>
            <dt className="text-xs text-slate-500">First seen</dt>
            <dd className="mt-0.5 font-mono text-sm text-slate-200">
              {formatDate(actor.firstSeen)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Last seen</dt>
            <dd className="mt-0.5 font-mono text-sm text-slate-200">
              {formatDate(actor.lastSeen)}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
