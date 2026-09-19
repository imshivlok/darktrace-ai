// USE: Main investigation view. Reads the ?q= search param, checks it
// against the mock actor's handle/aliases/identifiers, and either shows
// the full case (all sections + export toolbar) or a "no results" empty state.
// Swap the matching logic here with a real API call later.

import { useSearchParams, useNavigate } from "react-router-dom";
import ActorHeader from "../components/ActorHeader";
import IntelligenceCards from "../components/IntelligenceCards";
import InfrastructurePanel from "../components/InfrastructurePanel";
import RelationshipGraph from "../components/RelationshipGraph";
import EvidencePanel from "../components/EvidencePanel";
import Timeline from "../components/Timeline";
import TransactionsTable from "../components/TransactionsTable";
import SourcesPanel from "../components/SourcesPanel";
import SearchBar from "../components/SearchBar";
import ExportToolbar from "../components/ExportToolbar";
import { mockCase } from "../data/mockData";

function matchesQuery(query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;

  const { actor } = mockCase;
  const candidates = [
    actor.handle,
    ...actor.aliases.map((a) => a.handle),
    ...actor.identifiers.map((i) => i.value),
    ...actor.pgpKeys.map((k) => k.keyId),
    ...actor.wallets.map((w) => w.address),
  ].map((v) => v.toLowerCase());

  return candidates.some((c) => c.includes(q));
}

const Investigation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") ?? "";
  const found = matchesQuery(query);

  const {
    actor,
    sources,
    infrastructure,
    relationships,
    evidence,
    timeline,
    transactions,
    attributionScore,
  } = mockCase;

  const handleSearch = (newQuery: string) => {
    navigate(`/investigation?q=${encodeURIComponent(newQuery)}`);
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-6xl mx-auto">
      <SearchBar
        onSearch={handleSearch}
        defaultValue={query}
        placeholder="Search another handle, PGP key, wallet or domain..."
      />

      {!found ? (
        <div className="rounded-2xl border border-slate-700/50 bg-[#111214]/70 backdrop-blur-xl p-10 text-center">
          <p className="text-lg font-medium text-slate-200">
            {query
              ? `No results found for "${query}"`
              : "Enter a search above to begin an investigation"}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {query
              ? "Try a known handle, alias, PGP key ID, or wallet address."
              : "Search a handle, PGP key, wallet address, or domain to view actor intelligence."}
          </p>
        </div>
      ) : (
        <>
          <section id="overview" className="space-y-6 scroll-mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xs uppercase tracking-wide text-slate-500">
                Case overview
              </h2>
              <ExportToolbar data={mockCase} />
            </div>
            <ActorHeader actor={actor} />
            <IntelligenceCards
              pgpKeys={actor.pgpKeys}
              wallets={actor.wallets}
              identifiers={actor.identifiers}
              sources={sources}
            />
          </section>

          <section id="infrastructure" className="scroll-mt-6">
            <InfrastructurePanel findings={infrastructure} />
          </section>

          <section id="relationships" className="scroll-mt-6">
            <RelationshipGraph data={relationships} />
          </section>

          <section id="evidence" className="scroll-mt-6">
            <EvidencePanel
              evidence={evidence}
              attributionScore={attributionScore}
            />
          </section>

          <section id="timeline" className="scroll-mt-6">
            <Timeline events={timeline} sources={sources} />
          </section>

          <section id="wallets" className="scroll-mt-6">
            <TransactionsTable transactions={transactions} />
          </section>

          <section id="sources" className="scroll-mt-6">
            <SourcesPanel sources={sources} />
          </section>
        </>
      )}
    </div>
  );
};

export default Investigation;
