// USE: "What is DarkTrace" section — a short paragraph explaining the
// project's purpose, followed by a compact vertical flowchart of the full
// pipeline (Tor scraper → storage → AI analysis → graph → dashboard).
// Connectors are thicker "pipes" with a looping animated ray (pure CSS).

const flowSteps = [
  {
    title: "Tor scraper",
    body: "Scrapy-based crawler resolves .onion sites via a SOCKS5 proxy, secured with a VPN layer.",
  },
  {
    title: "Storage",
    body: "Extracted handles, PGP keys, and wallets are structured into a PostgreSQL database.",
  },
  {
    title: "AI-based analysis",
    body: "Claude Sonnet 5 (via AWS Bedrock, with a local fallback) runs stylometric and behavioral analysis.",
  },
  {
    title: "Relationship mapping",
    body: "Connects handles, keys, and wallets into one relationship graph per actor.",
  },
  {
    title: "Investigation dashboard",
    body: "Backend returns JSON; the frontend renders it into a searchable, exportable dashboard.",
  },
];

function Connector() {
  return (
    <div className="relative mx-auto h-6 w-1 overflow-hidden rounded-full bg-slate-700/50">
      <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-linear-to-b from-transparent via-cyan-400 to-transparent animate-[flowDown_0.9s_linear_infinite]" />
      <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-linear-to-b from-transparent via-cyan-400 to-transparent animate-[flowDown_0.9s_linear_infinite_-0.45s]" />
    </div>
  );
}

export default function ProjectOverview() {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          What Dark<span className="text-cyan-400">Trace</span> does
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
          DarkTrace is an end-to-end dark-web threat actor intelligence
          platform. A Scrapy-based Tor scraper, routed through a SOCKS5 proxy
          and secured with a VPN layer, collects data from publicly accessible
          dark-web sources — extracting identifiers like handles, PGP keys, and
          wallet addresses into a PostgreSQL database. A Node.js backend then
          feeds this data to an AI model (Claude Sonnet 5 via AWS Bedrock, with
          a local fallback) for stylometric and behavioral analysis, linking
          rebranded or migrated personas back to known actors. The result is a
          single relationship graph per actor — connecting aliases, keys,
          wallets, and infrastructure — returned as structured JSON that this
          dashboard renders for investigators to query, evaluate, and export.
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-xs flex-col items-center">
        {flowSteps.map((step, i) => (
          <div key={step.title} className="flex w-full flex-col items-center">
            <div className="w-full rounded-xl border border-gray-300/30 bg-[#111214] px-4 py-3 text-center">
              <span className="font-mono text-[10px] text-cyan-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-0.5 text-xs font-medium text-slate-100">
                {step.title}
              </h3>
              <p className="mt-1 text-[11px] leading-snug text-slate-500">
                {step.body}
              </p>
            </div>
            {i < flowSteps.length - 1 && <Connector />}
          </div>
        ))}
      </div>
    </div>
  );
}
