import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, useNavigate } from "react-router-dom";
import ActorHeader from "../components/ActorHeader";
import IntelligenceCards from "../components/IntelligenceCards";
import InfrastructurePanel from "../components/InfrastructurePanel";
import RelationshipGraph from "../components/RelationshipGraph";
import EvidencePanel from "../components/EvidencePanel";
import Timeline from "../components/Timeline";
import TransactionsTable from "../components/TransactionsTable";
import SourcesPanel from "../components/SourcesPanel";
import ExportToolbar from "../components/ExportToolbar";
import DashboardStats from "../components/DashboardStats";
import DashboardSkeleton from "../components/DashboardSkeleton";
import SearchProgress from "../components/SearchProgress";
import ConsoleSidebar from "../components/ConsoleSidebar";
import ChatPanel from "../components/ChatPanel";
import { IconChat, IconMenu, IconSearch } from "../components/icons";
import { mockCase } from "../data/mockData";
import { defaultQueryHistory } from "../data/mockChat";

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

type TabId =
  | "graph"
  | "infrastructure"
  | "evidence"
  | "timeline"
  | "transactions"
  | "sources";

const TAB_IDS: TabId[] = [
  "graph",
  "infrastructure",
  "evidence",
  "timeline",
  "transactions",
  "sources",
];

/* ---------------------------------------------------------------- */
/*  Small hooks                                                      */
/* ---------------------------------------------------------------- */

function useMinWidth(px: number): boolean {
  const query = `(min-width: ${px}px)`;
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

const HISTORY_KEY = "darktrace.queryHistory";

function loadHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((q): q is string => typeof q === "string");
      }
    }
  } catch {
    /* storage unavailable or corrupt: fall back to the seed */
  }
  return defaultQueryHistory;
}

/** Previous queries, newest first. The current query is added on arrival. */
function useQueryHistory(query: string): string[] {
  const [items, setItems] = useState<string[]>(loadHistory);

  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    setItems((prev) => {
      const next = [
        q,
        ...prev.filter((p) => p.toLowerCase() !== q.toLowerCase()),
      ].slice(0, 15);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, [query]);

  return items;
}

/* ---------------------------------------------------------------- */
/*  Fake search                                                      */
/*  Stands in for the real request so the page doesn't answer in     */
/*  zero milliseconds. Replace with your data fetch when it exists.  */
/* ---------------------------------------------------------------- */

const SEARCH_STEPS = [
  "Querying indexed sources",
  "Resolving aliases and identifiers",
  "Correlating PGP keys and wallets",
  "Checking Tor infrastructure",
  "Scoring attribution",
];

// Queries already searched this session reload quickly, like a cache hit.
const resolvedQueries = new Set<string>();

interface SearchState {
  searching: boolean;
  progress: number; // 0..1
  steps: string[];
  stepIndex: number;
}

function useFakeSearch(query: string, found: boolean): SearchState {
  const key = query.trim().toLowerCase();
  const [tick, setTick] = useState<{
    key: string;
    elapsed: number;
    total: number;
    done: boolean;
  } | null>(null);

  useEffect(() => {
    if (!key) return;
    const total = resolvedQueries.has(key) ? 700 : found ? 3200 : 1800;
    const start = performance.now();
    setTick({ key, elapsed: 0, total, done: false });

    const id = setInterval(() => {
      const elapsed = performance.now() - start;
      if (elapsed >= total) {
        clearInterval(id);
        resolvedQueries.add(key);
        setTick({ key, elapsed: total, done: true, total });
      } else {
        setTick({ key, elapsed, total, done: false });
      }
    }, 80);
    return () => clearInterval(id);
  }, [key, found]);

  // Ignore state left over from a previous query
  const current = tick && tick.key === key ? tick : null;
  const steps = found ? SEARCH_STEPS : SEARCH_STEPS.slice(0, 2);
  const searching = key !== "" && !(current && current.done);
  const progress = current ? Math.min(current.elapsed / current.total, 1) : 0;
  const stepIndex = Math.min(Math.floor(progress * steps.length), steps.length - 1);

  return { searching, progress, steps, stepIndex };
}

/** Fades a block in; the delay staggers blocks as results arrive. */
function Reveal({ i = 0, children }: { i?: number; children: ReactNode }) {
  return (
    <div className="reveal" style={{ animationDelay: `${i * 70}ms` }}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Page                                                             */
/* ---------------------------------------------------------------- */

export default function Investigation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") ?? "";
  const found = matchesQuery(query);
  const [searchInputValue, setSearchInputValue] = useState(query);

  // The home page's search tools deep-link to a tab, e.g. ?view=transactions
  const viewParam = searchParams.get("view");
  const requestedTab = TAB_IDS.find((t) => t === viewParam);
  const [activeTab, setActiveTab] = useState<TabId>(requestedTab ?? "graph");
  useEffect(() => {
    if (requestedTab) setActiveTab(requestedTab);
  }, [requestedTab, query]);

  // The console is a full-screen app. Lock the page behind it and keep wheel
  // and touch scrolling inside the panes, so nothing on the page (or a
  // smooth-scroll library listening on window) can swallow the scroll.
  const shellRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previous = { html: html.style.overflow, body: body.style.overflow };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous.html;
      body.style.overflow = previous.body;
    };
  }, []);
  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const keepInside = (e: Event) => e.stopPropagation();
    el.addEventListener("wheel", keepInside, { passive: true });
    el.addEventListener("touchmove", keepInside, { passive: true });
    return () => {
      el.removeEventListener("wheel", keepInside);
      el.removeEventListener("touchmove", keepInside);
    };
  }, []);

  // Shell state
  const isXl = useMinWidth(1280);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(isXl);

  // Docked on wide screens, a drawer below that
  useEffect(() => {
    setChatOpen(isXl);
  }, [isXl]);

  // Chat sessions: a new query or "New chat" starts a fresh conversation.
  const [chatNonce, setChatNonce] = useState(0);
  const [blankChatKey, setBlankChatKey] = useState<string | null>(null);
  const chatKey = `${query}::${chatNonce}`;
  const startNewChat = () => {
    const next = chatNonce + 1;
    setChatNonce(next);
    setBlankChatKey(`${query}::${next}`);
    setChatOpen(true);
  };

  const search = useFakeSearch(query, found);
  const searchLabel = search.searching
    ? `${search.steps[search.stepIndex]}…`
    : undefined;

  const historyQueries = useQueryHistory(query);
  const history = historyQueries.map((q) => ({
    query: q,
    found: matchesQuery(q),
  }));

  useEffect(() => {
    setSearchInputValue(query);
  }, [query]);

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

  const goToQuery = (q: string) => {
    if (q.trim()) navigate(`/investigation?q=${encodeURIComponent(q.trim())}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToQuery(searchInputValue);
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "graph", label: "Relationship Map" },
    { id: "infrastructure", label: `Infrastructure (${infrastructure.length})` },
    { id: "evidence", label: `Evidence (${evidence.length})` },
    { id: "timeline", label: `Timeline (${timeline.length})` },
    { id: "transactions", label: `Ledger (${transactions.length})` },
    { id: "sources", label: `Sources (${sources.length})` },
  ];

  const sidebar = (mobile: boolean) => (
    <ConsoleSidebar
      mobile={mobile}
      collapsed={sidebarCollapsed}
      onToggleCollapsed={() => setSidebarCollapsed((c) => !c)}
      history={history}
      activeQuery={query}
      onSelectQuery={goToQuery}
      onNewSearch={() => navigate("/")}
      onNewChat={startNewChat}
      onAction={() => setSidebarDrawerOpen(false)}
    />
  );

  // Rendered into document.body so no transformed or clipped ancestor in the
  // app layout can change what "fixed" means or cut the panes off.
  return createPortal(
    <div
      ref={shellRef}
      data-lenis-prevent
      className="print-static fixed inset-0 z-[100] flex bg-canvas text-fg"
    >
      {/* Left sidebar (desktop) */}
      <div
        className={`no-print hidden shrink-0 border-r border-line-faint transition-[width] duration-200 lg:block ${
          sidebarCollapsed ? "w-[68px]" : "w-[272px]"
        }`}
      >
        {sidebar(false)}
      </div>

      {/* Left sidebar (drawer on small screens) */}
      {sidebarDrawerOpen && (
        <div className="no-print fixed inset-0 z-50 flex lg:hidden">
          <div className="relative w-[288px] max-w-[85vw] border-r border-line-faint shadow-pop">
            {sidebar(true)}
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setSidebarDrawerOpen(false)}
            className="flex-1 bg-black/60"
          />
        </div>
      )}

      {/* Dashboard */}
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="no-print flex h-14 shrink-0 items-center gap-3 border-b border-line-faint bg-canvas/70 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarDrawerOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-fg/[0.07] hover:text-fg lg:hidden"
          >
            <IconMenu />
          </button>

          <div className="hidden min-w-0 items-center gap-2 font-mono text-xs text-fg-subtle md:flex">
            <span>Console</span>
            <span aria-hidden="true">/</span>
            <span className="truncate text-fg-muted">
              {found ? actor.handle : "New query"}
            </span>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="ml-auto flex w-full max-w-md items-center gap-2 rounded-full bg-card-raised/80 py-1 pl-4 pr-1 ring-1 ring-line transition-all focus-within:ring-accent/60 focus-within:shadow-search-focus"
          >
            <IconSearch className="h-4 w-4 shrink-0 text-fg-subtle" />
            <input
              type="text"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              placeholder="Search query..."
              aria-label="Search query"
              className="min-w-0 flex-1 bg-transparent font-mono text-xs text-fg placeholder:text-fg-faint focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-accent-solid px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-strong"
            >
              Query
            </button>
          </form>

          <button
            type="button"
            onClick={() => setChatOpen((o) => !o)}
            aria-label={chatOpen ? "Hide assistant" : "Show assistant"}
            aria-pressed={chatOpen}
            title={chatOpen ? "Hide assistant" : "Show assistant"}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-fg/[0.07] ${
              chatOpen ? "text-accent" : "text-fg-muted hover:text-fg"
            }`}
          >
            <IconChat />
          </button>
        </header>

        <div className="console-glow scroll-thin print-static min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-8">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
                Investigative Dossier
              </span>
              <h1 className="mt-2 font-display text-4xl tracking-tight text-fg sm:text-5xl">
                {search.searching
                  ? "Searching…"
                  : `Subject: ${found ? actor.handle : "Unidentified Target"}`}
              </h1>
            </div>

            {search.searching ? (
              <div className="space-y-6" aria-busy="true">
                <SearchProgress
                  query={query}
                  steps={search.steps}
                  stepIndex={search.stepIndex}
                  progress={search.progress}
                />
                <DashboardSkeleton />
              </div>
            ) : !found ? (
              <div className="reveal rounded-[24px] border border-line bg-card p-10 text-center shadow-surface sm:p-16">
                <div className="font-mono text-xs text-danger">
                  NO CORRELATION RECORD FOUND
                </div>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fg-muted">
                  Zero threat indicators found for "{query}". Verify spelling or
                  test candidate "shadowfox77".
                </p>
                <button
                  onClick={() => navigate("/investigation?q=shadowfox77")}
                  className="mt-6 rounded-full border border-accent/40 bg-accent/10 px-5 py-2 font-mono text-xs text-accent transition-colors hover:bg-accent/20"
                >
                  Load Case Dossier: shadowfox77
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Case metadata + export */}
                <Reveal i={0}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
                      <span className="text-fg-subtle">CASE ID:</span>
                      <span className="text-fg">DT-2026-X88</span>
                      <span className="text-fg-faint">|</span>
                      <span className="text-fg-subtle">CLASSIFICATION:</span>
                      <span className="uppercase text-accent">{actor.category}</span>
                    </div>
                    <ExportToolbar data={mockCase} />
                  </div>
                </Reveal>

                <Reveal i={1}>
                  <DashboardStats data={mockCase} />
                </Reveal>
                <Reveal i={2}>
                  <ActorHeader actor={actor} />
                </Reveal>
                <Reveal i={3}>
                  <IntelligenceCards
                    pgpKeys={actor.pgpKeys}
                    wallets={actor.wallets}
                    identifiers={actor.identifiers}
                    sources={sources}
                  />
                </Reveal>

                {/* Forensic workspace */}
                <Reveal i={4}>
                  <div className="overflow-hidden rounded-[24px] border border-line bg-card shadow-surface">
                    <div
                      role="tablist"
                      aria-label="Dossier sections"
                      className="scroll-thin flex overflow-x-auto border-b border-line-faint px-2"
                    >
                      {tabs.map((tab) => {
                        const active = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            role="tab"
                            aria-selected={active}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative whitespace-nowrap px-4 py-3.5 text-sm font-medium transition-colors ${
                              active
                                ? "text-fg"
                                : "text-fg-subtle hover:text-fg-muted"
                            }`}
                          >
                            {tab.label}
                            {active && (
                              <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-accent" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-4 sm:p-5">
                      {activeTab === "graph" && (
                        <RelationshipGraph data={relationships} />
                      )}
                      {activeTab === "infrastructure" && (
                        <InfrastructurePanel findings={infrastructure} />
                      )}
                      {activeTab === "evidence" && (
                        <EvidencePanel
                          evidence={evidence}
                          attributionScore={attributionScore}
                        />
                      )}
                      {activeTab === "timeline" && (
                        <Timeline events={timeline} sources={sources} />
                      )}
                      {activeTab === "transactions" && (
                        <TransactionsTable transactions={transactions} />
                      )}
                      {activeTab === "sources" && (
                        <SourcesPanel sources={sources} />
                      )}
                    </div>
                  </div>
                </Reveal>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Assistant: docked on xl, drawer below. Always mounted so the
          conversation survives hiding and showing the panel. */}
      {chatOpen && (
        <button
          type="button"
          aria-label="Close assistant"
          onClick={() => setChatOpen(false)}
          className="no-print fixed inset-0 z-40 bg-black/60 xl:hidden"
        />
      )}
      <div
        className={`no-print fixed inset-y-0 right-0 z-50 w-full max-w-[420px] border-l border-line-faint shadow-pop xl:static xl:z-auto xl:w-[400px] xl:max-w-none xl:shrink-0 xl:shadow-none ${
          chatOpen ? "" : "hidden"
        }`}
      >
        <ChatPanel
          key={chatKey}
          query={query}
          found={found}
          data={mockCase}
          seed={blankChatKey !== chatKey}
          searching={search.searching}
          searchLabel={searchLabel}
          onNewChat={startNewChat}
          onClose={() => setChatOpen(false)}
        />
      </div>
    </div>,
    document.body,
  );
}