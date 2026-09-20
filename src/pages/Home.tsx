import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import zortexPhoto from "../assets/zortex.jpeg";
import FAQ from "../components/FAQ";

interface HomeProps {
  onSearchSubmit: (query: string) => void;
}

const CAPABILITIES = [
  {
    code: "CAP-01",
    tag: "Infrastructure Correlation",
    title: "Tor Origin De-cloaking",
    body: "Detects misconfigurations on .onion services including exposed Apache /server-status modules, TLS/SSL certificate serial reuse, and daemon banner matching to expose the underlying clearnet host IP.",
    metric: "Sub-Second Ingress Mapping",
  },
  {
    code: "CAP-02",
    tag: "Threat Actor Graph",
    title: "Cross-Platform Entity Resolution",
    body: "Correlates fragmented identities across marketplaces, forums, and paste sites. Links handles, PGP keyrings, crypto addresses, and trusted co-conspirators into an interactive topological network.",
    metric: "4-Factor Correlation Model",
  },
  {
    code: "CAP-03",
    tag: "AI Persona Analysis",
    title: "Stylometric & Behavioral ML",
    body: "Employs Claude Sonnet 5 via AWS Bedrock to identify rebranded or migrated threat personas using linguistic variance, punctuation fingerprints, jargon habits, and timezone posting cadences.",
    metric: "99.4% Attribution Score",
  },
  {
    code: "CAP-04",
    tag: "Financial Ledger OSINT",
    title: "Multi-Chain Transaction Tracing",
    body: "Monitors deposit and payout hops across Bitcoin, Ethereum, and Monero escrow flows. Detects transaction reuse and flags taint paths leading to centralized off-ramps.",
    metric: "Cross-Mempool Taint Model",
  },
];

const ARCHITECTURE_FLOW = [
  {
    layer: "01 / Ingress",
    title: "Tor Scraper Engine",
    host: "AWS EC2 (Docker)",
    desc: "Asynchronous Scrapy fleet routed through isolated SOCKS5 Tor circuits wrapped in dedicated VPN tunnels for persistent darknet collection.",
  },
  {
    layer: "02 / Storage",
    title: "PostgreSQL Data Store",
    host: "AWS EC2 (Docker)",
    desc: "ACID-compliant relational store housing normalized entity profiles, cryptographic signatures, wallet ledgers, and source reliability indexes.",
  },
  {
    layer: "03 / Intelligence",
    title: "Claude Sonnet 5 + OmniRoute",
    host: "AWS Bedrock / Local Fallback",
    desc: "Cognitive reasoning layer conducting stylometric comparisons and causal evidence generation, with local OmniRoute failover during outages.",
  },
  {
    layer: "04 / Presentation",
    title: "Investigation Console",
    host: "Vercel Edge",
    desc: "High-density analytical workspace delivering radial relationship graphs, temporal event timelines, and multi-format compliance exports.",
  },
];

const MITIGATIONS = [
  {
    challenge: "Changing / Disappearing Sources",
    risk: "Marketplaces exit-scam and forums vanish overnight.",
    solution: "Continuous multi-source collection with 4-tier source reliability scoring (Unverified to High).",
  },
  {
    challenge: "Noisy / Duplicate Identities",
    risk: "Threat actors register deceptive copycat handles.",
    solution: "Automated entity normalization and cryptographic signature deduplication.",
  },
  {
    challenge: "False Correlations",
    risk: "Flawed links compromise judicial and investigative integrity.",
    solution: "Mandatory multi-vector corroboration requiring at least two independent evidence signals.",
  },
  {
    challenge: "Attribution Uncertainty",
    risk: "Inconclusive proof stalls decision-making.",
    solution: "Transparent confidence scoring accompanied by raw logs, timelines, and verifiable sources.",
  },
  {
    challenge: "AI Hallucination",
    risk: "LLMs generating false wallet addresses or handles.",
    solution: "Grounded RAG architecture constrained exclusively to indexed PostgreSQL datasets.",
  },
];

const RESEARCH_REFERENCES = [
  {
    id: "IEEE-11011956",
    title: "De-anonymization & Entity Correlation in Dark Web Ecosystems",
    publication: "IEEE Transactions on Information Forensics and Security",
    url: "https://ieeexplore.ieee.org/document/11011956",
  },
  {
    id: "IEEE-9739708",
    title: "Traffic Fingerprinting & Misconfiguration Extraction in Onion Routing",
    publication: "IEEE International Conference on Cyber Security & Cryptography",
    url: "https://ieeexplore.ieee.org/document/9739708",
  },
];

const TEAM_MEMBERS = [
  { name: "Shivlok Sharma", role: "Team Lead · Architecture & Core AI", focus: "Tor Ingress Orchestration & LLM Stylometric Engine" },
  { name: "Vaibhav Singh", role: "Frontend Lead · Systems UI/UX", focus: "Radial Graph Rendering & State Flow" },
  { name: "Yogi Khanna", role: "Product Strategy & Compliance", focus: "Forensic Report Standards & Documentation" },
  { name: "Tejas Kumar Vishwakarma", role: "Threat Intelligence Research", focus: "Tor Misconfiguration & TLS Fingerprinting" },
  { name: "Kashvi Jaiswal", role: "Intelligence Verification & Analysis", focus: "Linguistic Ground Truth & Case Verification" },
  { name: "Prachi Aswal", role: "Project Communications & Operations", focus: "Stakeholder Coordination & Deliverables" },
];

const AI_MODELS = [
  { id: "Quick", desc: "Fastest answers" },
  { id: "Pro", desc: "Advanced reasoning" },
  { id: "Max", desc: "Complex problem solving" },
];

export default function Home({ onSearchSubmit }: HomeProps) {
  const [query, setQuery] = useState("");
  const [micActive, setMicActive] = useState(false);

  // Custom Dropdown State
  const [modelOpen, setModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Quick");
  const modelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) {
        setModelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearchSubmit(query.trim());
  };

  const handleMicClick = () => {
    setMicActive(!micActive);
  };

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full bg-canvas text-fg antialiased selection:bg-accent/30 selection:text-fg font-sans">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-line-faint bg-canvas/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-3">
              <img src="../assets/dtai.png" alt="Logo" className="h-8 w-8 object-contain" />
              <span className="text-base font-semibold tracking-tight text-fg">
                DarkTrace <span className="text-fg-subtle font-normal">AI</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8 text-base font-medium text-fg-muted">
              <button onClick={() => scrollToId("overview")} className="hover:text-fg transition-colors">Overview</button>

              <div className="relative group py-6">
                <button className="flex items-center gap-1 hover:text-fg transition-colors">
                  Platform
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 top-[100%] hidden w-48 flex-col rounded-xl border border-line bg-card-raised p-2 shadow-pop group-hover:flex">
                  <button onClick={() => scrollToId("capabilities")} className="rounded-md px-4 py-2.5 text-left text-sm hover:bg-fg/[0.07] hover:text-fg transition-colors">Capabilities</button>
                  <button onClick={() => scrollToId("architecture")} className="rounded-md px-4 py-2.5 text-left text-sm hover:bg-fg/[0.07] hover:text-fg transition-colors">Architecture</button>
                  <button onClick={() => scrollToId("mitigations")} className="rounded-md px-4 py-2.5 text-left text-sm hover:bg-fg/[0.07] hover:text-fg transition-colors">Reliability</button>
                </div>
              </div>

              <div className="relative group py-6">
                <button className="flex items-center gap-1 hover:text-fg transition-colors">
                  Resources
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 top-[100%] hidden w-48 flex-col rounded-xl border border-line bg-card-raised p-2 shadow-pop group-hover:flex">
                  <button onClick={() => scrollToId("references")} className="rounded-md px-4 py-2.5 text-left text-sm hover:bg-fg/[0.07] hover:text-fg transition-colors">Research</button>
                  <button onClick={() => scrollToId("faq")} className="rounded-md px-4 py-2.5 text-left text-sm hover:bg-fg/[0.07] hover:text-fg transition-colors">FAQ</button>
                </div>
              </div>

              <button onClick={() => scrollToId("team")} className="hover:text-fg transition-colors">Team</button>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-base font-medium text-fg">
            Hi, Shivlok
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card-raised text-fg-muted">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION — TAKES FULL HEIGHT */}
      <section className="hero-uv relative flex min-h-[calc(100vh-40px)] flex-col justify-center px-6 lg:px-10 -mt-10 pb-10">
        <div className="mx-auto w-full max-w-4xl text-center">

          <h1 className="hero-rise font-display mb-8 text-5xl sm:text-6xl tracking-tight text-fg">
            What are we looking for?
          </h1>

          <form onSubmit={handleSearch} className="hero-rise-delay mx-auto max-w-3xl">
            <div className="relative flex w-full items-center rounded-full bg-card-raised/80 px-4 py-3.5 ring-1 ring-line shadow-search backdrop-blur-xl transition-all focus-within:bg-card-raised focus-within:ring-accent/60 focus-within:shadow-search-focus">
              <button
                type="button"
                className="ml-2 mr-3 text-fg-muted hover:text-fg transition-colors cursor-default"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask DarkTrace"
                className="flex-1 bg-transparent text-lg text-fg placeholder:text-fg-faint focus:outline-none"
              />

              <div className="flex items-center gap-1 pr-2">
                <div className="relative" ref={modelRef}>
                  <button
                    type="button"
                    onClick={() => setModelOpen(!modelOpen)}
                    className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-fg-muted hover:bg-fg/[0.07] hover:text-fg transition-colors"
                  >
                    {selectedModel}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {modelOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-line bg-card-raised p-2 shadow-pop z-50 flex flex-col gap-1">
                      {AI_MODELS.map((model) => (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => { setSelectedModel(model.id); setModelOpen(false); }}
                          className={`flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${selectedModel === model.id ? "border border-accent/40 bg-accent/10" : "border border-transparent hover:bg-fg/[0.06]"
                            }`}
                        >
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                            {selectedModel === model.id && (
                              <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-fg">{model.id}</span>
                            <span className="text-xs text-fg-muted">{model.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleMicClick}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ml-1 ${micActive ? "bg-accent-solid text-white" : "text-fg-muted hover:bg-fg/[0.07] hover:text-fg"
                    }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* MEET DARKTRACE SECTION */}
      <section id="overview" className="border-t border-line-faint bg-band py-24 px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl sm:text-6xl tracking-tight text-fg">
              Meet <span className="text-accent italic">DarkTrace</span>
            </h2>
            <p className="mt-4 text-base text-fg-muted">
              Maximize OSINT on DarkTrace
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top Left - 5 cols */}
            <div className="lg:col-span-5 rounded-[24px] border border-line bg-card p-8 sm:p-10 flex flex-col transition-all hover:border-line-strong shadow-surface hover:shadow-lift min-h-[340px]">
              <div className="mb-auto">
                <span className="text-[11px] font-mono uppercase tracking-widest text-fg-subtle mb-4 block">ZERO-TOUCH INGRESS</span>
                <h3 className="font-display text-3xl sm:text-4xl text-fg leading-[1.05]">
                  Tor Origin De-cloaking
                </h3>
                <p className="mt-4 text-sm text-fg-muted leading-relaxed">
                  Detect misconfigurations on .onion services including exposed Apache status modules and TLS/SSL certificate serial reuse to expose the underlying clearnet host IP.
                </p>
              </div>
              <div className="mt-8 flex gap-3">
                <div className="h-2 w-12 rounded-full bg-accent/80"></div>
                <div className="h-2 w-8 rounded-full bg-accent/40"></div>
              </div>
            </div>

            {/* Top Right - 7 cols */}
            <div className="lg:col-span-7 rounded-[24px] border border-line bg-card overflow-hidden flex flex-col transition-all hover:border-line-strong shadow-surface hover:shadow-lift min-h-[340px] relative">
              <div className="p-8 sm:p-10 z-10 relative">
                <span className="text-[11px] font-mono uppercase tracking-widest text-fg-subtle mb-4 block">INTERACTIVE WORKSPACE</span>
                <h3 className="font-display text-3xl sm:text-4xl text-fg leading-[1.05]">
                  Cross-Platform Entity Resolution
                </h3>
                <p className="mt-4 text-sm text-fg-muted leading-relaxed max-w-md">
                  Correlate fragmented identities across marketplaces and forums. Link handles, PGP keyrings, and crypto addresses into an interactive topological network.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 w-2/3 h-2/3 bg-gradient-to-tl from-accent/10 to-transparent pointer-events-none"></div>
            </div>

            {/* Bottom Left - 7 cols */}
            <div className="lg:col-span-7 rounded-[24px] border border-line bg-card p-8 sm:p-10 flex flex-col transition-all hover:border-line-strong shadow-surface hover:shadow-lift min-h-[340px]">
              <span className="text-[11px] font-mono uppercase tracking-widest text-fg-subtle mb-4 block">STYLOMETRIC ML</span>
              <h3 className="font-display text-3xl sm:text-4xl text-fg leading-[1.05]">
                AI Persona Analysis
              </h3>
              <p className="mt-4 text-sm text-fg-muted leading-relaxed max-w-md">
                Employ Claude Sonnet 5 via AWS Bedrock to identify rebranded or migrated threat personas using linguistic variance, punctuation fingerprints, and timezone posting cadences.
              </p>
              <div className="mt-auto pt-8">
                <div className="h-16 w-full rounded-xl bg-band border border-line flex items-center px-4">
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z" /></svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="h-2 w-24 bg-line-strong rounded-full mb-2"></div>
                    <div className="h-2 w-32 bg-card-raised rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Right - 5 cols */}
            <div className="lg:col-span-5 rounded-[24px] border border-line bg-card p-8 sm:p-10 flex flex-col transition-all hover:border-line-strong shadow-surface hover:shadow-lift min-h-[340px]">
              <span className="text-[11px] font-mono uppercase tracking-widest text-fg-subtle mb-4 block">LEDGER INTELLIGENCE</span>
              <h3 className="font-display text-3xl sm:text-4xl text-fg leading-[1.05]">
                Multi-Chain Tracing
              </h3>
              <p className="mt-4 text-sm text-fg-muted leading-relaxed">
                Monitor deposit and payout hops across Bitcoin, Ethereum, and Monero escrow flows. Detect transaction reuse and flag taint paths leading to centralized off-ramps.
              </p>
              <div className="mt-auto pt-8">
                <div className="w-full h-2 bg-band rounded-full overflow-hidden">
                  <div className="w-[75%] h-full rounded-full bg-accent"></div>
                </div>
                <div className="mt-2 text-xs text-fg-subtle text-right">75% Confidence Match</div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="flex items-center justify-center gap-2 rounded-xl border border-accent/50 px-8 py-3.5 text-[15px] font-medium text-accent hover:bg-accent/10 hover:border-accent transition-colors">
              Try Free Mode
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <a href="https://docs.replit.com" target="_blank" rel="noreferrer" className="text-[15px] font-medium text-fg hover:text-fg-muted transition-colors">
              Read the documentation
            </a>
          </div>

        </div>
      </section>

      {/* FROM DATA TO ATTRIBUTION (Venn Diagram Structural Style) */}
      <section className="border-t border-line-faint py-32 px-6 lg:px-10 bg-canvas">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-display text-5xl sm:text-6xl tracking-tight text-fg mb-24">
            From Data to Attribution
          </h2>

          <div className="relative flex w-full items-center justify-center py-10">
            {/* Left Inputs (Data) */}
            <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 flex-col gap-10 items-end z-10">
              <div className="flex items-center gap-4 text-fg-subtle text-sm font-medium"><span className="w-20 h-0.5 bg-gradient-to-r from-transparent to-fg-subtle"></span> Forum Leaks</div>
              <div className="flex items-center gap-4 text-fg-subtle text-sm font-medium"><span className="w-20 h-0.5 bg-gradient-to-r from-transparent to-fg-subtle"></span> PGP Keyrings</div>
              <div className="flex items-center gap-4 text-fg-subtle text-sm font-medium"><span className="w-20 h-0.5 bg-gradient-to-r from-transparent to-fg-subtle"></span> Wallet Hashes</div>
            </div>

            {/* Overlapping Structural Circles */}
            <div className="relative flex items-center justify-center w-full max-w-[600px] h-[340px]">
              {/* Left Circle */}
              <div className="absolute left-1/2 -translate-x-[85%] w-72 h-72 rounded-[40px] border border-line bg-band flex flex-col items-center justify-center z-20 shadow-lift">
                <span className="font-display text-3xl text-fg mb-2 pr-12">Scattered</span>
                <span className="font-display text-3xl text-fg pr-12">Data</span>
              </div>

              {/* Right Circle */}
              <div className="absolute left-1/2 translate-x-[ -15%] w-72 h-72 rounded-[40px] border border-accent/40 bg-card flex flex-col items-center justify-center z-30 shadow-glow">
                <span className="font-display text-3xl text-accent mb-2 pl-12">Actionable</span>
                <span className="font-display text-3xl text-accent pl-12">Intelligence</span>
              </div>

              {/* Overlap Core Center */}
              <div className="absolute left-1/2 -translate-x-1/2 z-40 flex flex-col items-center justify-center w-36 h-36 rounded-[28px] border border-accent/50 bg-canvas shadow-lift">
                <img src="../assets/dtai.png" alt="DarkTrace AI" className="w-10 h-10 mb-2" />
                <span className="text-[10px] font-bold text-fg tracking-widest uppercase">Engine</span>
              </div>
            </div>

            {/* Right Outputs (Attribution) */}
            <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col gap-10 items-start z-10">
              <div className="flex items-center gap-4 text-fg text-sm font-medium">Verified Identity <span className="w-20 h-0.5 bg-gradient-to-l from-transparent to-accent"></span></div>
              <div className="flex items-center gap-4 text-fg text-sm font-medium">Host Server IPs <span className="w-20 h-0.5 bg-gradient-to-l from-transparent to-accent"></span></div>
              <div className="flex items-center gap-4 text-fg text-sm font-medium">Exchange KYC <span className="w-20 h-0.5 bg-gradient-to-l from-transparent to-accent"></span></div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES ("Powered by Replit" Style 4-Cards) */}
      <section id="capabilities" className="border-t border-line-faint bg-band py-24 px-6 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="text-center font-display text-5xl sm:text-6xl tracking-tight text-fg mb-16">
            Core De-anonymization Capabilities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
            {/* Card 1 */}
            <div className="flex flex-col rounded-[32px] bg-card border border-line p-8 text-fg min-h-[450px] shadow-surface">
              <div>
                <span className="text-xs font-mono text-fg-subtle uppercase tracking-wider">{CAPABILITIES[0].tag}</span>
                <h3 className="font-display mt-4 text-3xl leading-[1.05]">{CAPABILITIES[0].title}</h3>
              </div>
              <div className="my-auto py-10 flex justify-center text-fg">
                <div className="w-32 h-32 rounded-full border border-fg/10 border-dashed flex items-center justify-center relative">
                  <div className="w-16 h-10 border border-fg/20 bg-card-raised rounded-lg flex items-center justify-center text-[10px]">Server</div>
                  <div className="absolute -right-4 bg-accent-solid text-white text-[10px] px-2.5 py-1 rounded-full font-bold">Exposed</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-fg-muted">{CAPABILITIES[0].body}</p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col rounded-[32px] bg-card-raised border border-line p-8 text-fg min-h-[450px] shadow-surface">
              <div>
                <span className="text-xs font-mono text-fg-subtle uppercase tracking-wider">{CAPABILITIES[1].tag}</span>
                <h3 className="font-display mt-4 text-3xl leading-[1.05]">{CAPABILITIES[1].title}</h3>
              </div>
              <div className="my-auto py-10 flex justify-center text-fg">
                <div className="w-32 h-40 border border-accent/40 bg-accent/5 rounded-2xl flex flex-col p-3 gap-3">
                  <div className="w-full h-10 border border-accent/30 bg-card rounded-xl flex items-center justify-center text-xs font-medium">Aliases</div>
                  <div className="w-full h-10 border border-accent/30 bg-card rounded-xl flex items-center justify-center text-xs font-medium">PGP Keys</div>
                  <div className="w-full h-10 border border-accent/30 bg-card rounded-xl flex items-center justify-center text-xs font-medium">Wallets</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-fg-muted">{CAPABILITIES[1].body}</p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col rounded-[32px] bg-card border border-line p-8 text-fg min-h-[450px] shadow-surface">
              <div>
                <span className="text-xs font-mono text-fg-subtle uppercase tracking-wider">{CAPABILITIES[2].tag}</span>
                <h3 className="font-display mt-4 text-3xl leading-[1.05]">{CAPABILITIES[2].title}</h3>
              </div>
              <div className="my-auto py-10 flex justify-center text-fg relative">
                <div className="w-16 h-16 bg-accent-solid rounded-2xl z-10 flex items-center justify-center text-white font-bold shadow-glow">AI</div>
                <div className="absolute top-8 left-10 w-10 h-10 bg-card-raised rounded-xl flex items-center justify-center text-[10px] font-bold">TXT</div>
                <div className="absolute bottom-8 right-10 w-10 h-10 bg-card-raised rounded-xl flex items-center justify-center text-[10px] font-bold">LOG</div>
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                  <path d="M 80 120 L 120 120" stroke="#3a3956" strokeWidth="2" strokeDasharray="4,4" />
                  <path d="M 180 160 L 140 140" stroke="#3a3956" strokeWidth="2" strokeDasharray="4,4" />
                </svg>
              </div>
              <p className="text-sm leading-relaxed text-fg-muted">{CAPABILITIES[2].body}</p>
            </div>

            {/* Card 4 */}
            <div className="flex flex-col rounded-[32px] bg-accent-solid border border-accent/40 p-8 text-white min-h-[450px] shadow-glow">
              <div>
                <span className="text-xs font-mono text-white/85 uppercase tracking-wider">{CAPABILITIES[3].tag}</span>
                <h3 className="font-display mt-4 text-3xl leading-[1.05]">{CAPABILITIES[3].title}</h3>
              </div>
              <div className="my-auto py-10 flex justify-center text-fg">
                <svg className="w-28 h-28 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-sm leading-relaxed text-white">{CAPABILITIES[3].body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNICAL PIPELINE (Equal widths, absolute arrows) */}
      <section id="architecture" className="border-t border-line-faint py-24 px-6 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="text-center font-display text-5xl sm:text-6xl tracking-tight text-fg mb-16">
            Cloud &amp; Infrastructure Architecture
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full relative">
            {ARCHITECTURE_FLOW.map((arch, index) => (
              <div key={arch.layer} className="relative flex w-full">
                {/* The Box */}
                <div className="rounded-[24px] border border-line bg-band p-8 flex flex-col justify-between w-full min-h-[240px] z-10 hover:border-line-strong transition-colors shadow-surface">
                  <div>
                    <span className="text-xs font-mono text-accent block">{arch.layer}</span>
                    <span className="text-[10px] text-fg-subtle block mt-1">{arch.host}</span>
                    <h3 className="mt-5 text-lg font-medium text-fg">{arch.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-fg-muted">{arch.desc}</p>
                  </div>
                </div>

                {/* Double Chevron SVG Divider - Absolute Positioned to not break grid width */}
                {index < ARCHITECTURE_FLOW.length - 1 && (
                  <div className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 items-center justify-center w-6 z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
                {/* Vertical arrow for mobile */}
                {index < ARCHITECTURE_FLOW.length - 1 && (
                  <div className="lg:hidden absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center justify-center h-6 z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MITIGATION MATRIX (Bento Box Grid Style) */}
      <section id="mitigations" className="border-t border-line-faint bg-band py-24 px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-5xl sm:text-6xl tracking-tight text-fg mb-16">
            Adversarial Robustness
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:auto-rows-[240px]">
            {/* Box 0 (1x1) */}
            <div className="col-span-1 lg:col-span-1 bg-card p-8 rounded-[32px] border border-line flex flex-col justify-between hover:border-line-strong transition-colors shadow-surface">
              <h3 className="text-lg font-medium text-fg leading-tight">{MITIGATIONS[0].challenge}</h3>
              <p className="text-sm text-fg-muted mt-4 leading-relaxed">{MITIGATIONS[0].solution}</p>
            </div>

            {/* Box 1: Noisy Identities (2x1) - Text left, Graphic right */}
            <div className="col-span-1 lg:col-span-2 bg-card p-8 rounded-[32px] border border-line flex flex-row items-center justify-between hover:border-line-strong transition-colors overflow-hidden shadow-surface">
              <div className="flex-1 pr-6 flex flex-col justify-between h-full">
                <h3 className="text-lg font-medium text-fg leading-tight">{MITIGATIONS[1].challenge}</h3>
                <p className="text-sm text-fg-muted mt-4 leading-relaxed">{MITIGATIONS[1].solution}</p>
              </div>
              <div className="hidden sm:flex w-1/3 h-full items-center justify-center relative">
                <div className="w-14 h-14 rounded-full border-2 border-fg-subtle absolute -ml-8 bg-band flex items-center justify-center z-10">
                  <svg className="w-6 h-6 text-fg-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div className="w-14 h-14 rounded-full border-2 border-fg-subtle absolute ml-8 bg-band flex items-center justify-center z-0">
                  <svg className="w-6 h-6 text-fg-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div className="w-16 h-16 rounded-full border-2 border-accent bg-accent/10 flex items-center justify-center z-20 backdrop-blur-sm">
                  <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
              </div>
            </div>

            {/* Box 3: Attribution Uncertainty (1x2 Tall) - Graphic between text */}
            <div className="col-span-1 lg:col-span-1 lg:row-span-2 bg-card p-8 rounded-[32px] border border-line flex flex-col justify-between hover:border-line-strong transition-colors text-center shadow-surface">
              <h3 className="text-lg font-medium text-fg leading-tight">{MITIGATIONS[3].challenge}</h3>
              <div className="flex-1 flex flex-col items-center justify-center my-6">
                {/* Confidence Dial Graphic */}
                <div className="relative w-32 h-16 overflow-hidden">
                  <div className="absolute w-32 h-32 rounded-full border-[12px] border-line border-b-transparent border-l-transparent -rotate-45" />
                  <div className="absolute w-32 h-32 rounded-full border-[12px] border-accent border-b-transparent border-l-transparent -rotate-45" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 50%)" }} />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 font-mono text-xl font-bold text-fg">99.4%</div>
                </div>
              </div>
              <p className="text-sm text-fg-muted leading-relaxed">{MITIGATIONS[3].solution}</p>
            </div>

            {/* Box 4: False Correlations (2x1) - Text left, Graphic right */}
            <div className="col-span-1 lg:col-span-2 bg-card p-8 rounded-[32px] border border-line flex flex-row items-center justify-between hover:border-line-strong transition-colors overflow-hidden shadow-surface">
              <div className="flex-1 pr-6 flex flex-col justify-between h-full">
                <h3 className="text-lg font-medium text-fg leading-tight">{MITIGATIONS[2].challenge}</h3>
                <p className="text-sm text-fg-muted mt-4 leading-relaxed">{MITIGATIONS[2].solution}</p>
              </div>
              <div className="hidden sm:flex w-1/3 h-full items-center justify-center relative">
                {/* Network nodes with check */}
                <div className="w-8 h-8 rounded-full bg-card-raised absolute -left-2 top-4"></div>
                <div className="w-8 h-8 rounded-full bg-card-raised absolute right-2 bottom-4"></div>
                <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                  <line x1="20" y1="30" x2="80" y2="80" stroke="#9c8cff" strokeWidth="3" strokeDasharray="4 4" />
                </svg>
                <div className="w-12 h-12 rounded-full bg-fg z-10 flex items-center justify-center shadow-lg border-2 border-card">
                  <svg className="w-6 h-6 text-canvas" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Box 5 (1x1) */}
            <div className="col-span-1 lg:col-span-1 bg-card p-8 rounded-[32px] border border-line flex flex-col justify-between hover:border-line-strong transition-colors shadow-surface">
              <h3 className="text-lg font-medium text-fg leading-tight">{MITIGATIONS[4].challenge}</h3>
              <p className="text-sm text-fg-muted mt-4 leading-relaxed">{MITIGATIONS[4].solution}</p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM ZORTEX SECTION */}
      <section id="team" className="border-t border-line-faint py-24 px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-16">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider font-medium text-accent">
                SIH 2026 // Problem Statement 26151
              </p>
              <h2 className="mt-1 font-display text-5xl sm:text-6xl tracking-tight text-fg">
                The team behind it.
              </h2>
            </div>
            <div className="rounded-full border border-line bg-card px-4 py-1.5 text-xs font-medium text-fg-subtle">
              Theme: Blockchain &amp; Cybersecurity
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column: Image with floating label + Description box */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="relative w-full h-[320px] rounded-[24px] overflow-hidden border border-line">
                <img
                  src={zortexPhoto}
                  alt="Team Zortex - Smart India Hackathon 2026"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                {/* Floating dark box overlapping bottom inside image container */}
                <div className="absolute bottom-4 left-4 right-4 bg-card-raised/85 backdrop-blur-md rounded-[16px] p-4 shadow-pop border border-line">
                  <h3 className="text-base font-medium text-fg">Team Zortex</h3>
                  <p className="text-xs text-fg-muted mt-1">Smart India Hackathon 2026</p>
                </div>
              </div>

              <div className="rounded-[24px] border border-line bg-card p-6 text-sm text-fg-muted leading-relaxed shadow-surface">
                Team Zortex designs distributed scraping architectures, stylometric natural language models, and forensic graph correlation systems to solve dark web threat actor deanonymization.
              </div>
            </div>

            {/* Right Column: Member Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TEAM_MEMBERS.map((member) => (
                <div
                  key={member.name}
                  className="rounded-[20px] border border-line bg-card p-6 flex flex-col justify-between hover:border-line-strong transition-colors shadow-surface"
                >
                  <div>
                    <h3 className="text-lg font-medium text-fg">{member.name}</h3>
                    <p className="text-xs text-accent mt-1 font-medium">{member.role}</p>
                  </div>
                  <div className="mt-4 border-t border-line-faint pt-4 text-xs text-fg-subtle">
                    {member.focus}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IEEE RESEARCH REFERENCES */}
      <section id="references" className="border-t border-line-faint bg-band py-24 px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl mb-12">
            <p className="font-mono text-xs uppercase tracking-wider font-medium text-accent">Theoretical Foundations</p>
            <h2 className="mt-1 font-display text-4xl sm:text-5xl tracking-tight text-fg">
              Research &amp; Technical References
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RESEARCH_REFERENCES.map((ref) => (
              <a
                key={ref.id}
                href={ref.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-[20px] border border-line bg-card p-6 hover:border-line-strong transition-colors block group shadow-surface"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-accent">{ref.id}</span>
                  <span className="text-fg-subtle group-hover:text-fg transition-colors">IEEE Xplore ↗</span>
                </div>
                <div className="mt-3 text-base font-medium text-fg">{ref.title}</div>
                <div className="mt-1 text-xs text-fg-subtle">{ref.publication}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="border-t border-line-faint py-24 px-6 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <FAQ />
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="border-t border-line-faint bg-band py-32 px-6 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-5xl sm:text-7xl tracking-tight text-fg mb-8">
            Ready to expose the unseen?
          </h2>
          <p className="text-lg text-fg-muted mb-12 max-w-2xl mx-auto leading-relaxed">
            Deploy DarkTrace AI to autonomously deanonymize dark web threat actors. Connect fragmented intelligence and build court-admissible identity graphs in seconds.
          </p>
          <button className="rounded-xl bg-accent-solid px-8 py-4 text-lg font-medium text-white hover:bg-accent-strong transition-colors shadow-glow">
            Initialize Trace →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-uv relative border-t border-line-faint bg-footer pt-24 pb-14 px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-line-faint pb-14">
            <div>
              <div className="flex items-center gap-3">
                <img src="../assets/dtai.png" alt="Logo" className="h-8 w-8 object-contain" />
                <span className="text-lg font-semibold tracking-tight text-fg">
                  DarkTrace <span className="text-fg-subtle font-normal">AI</span>
                </span>
              </div>
              <p className="mt-4 text-sm text-fg-muted max-w-md leading-relaxed">
                Continuous dark-web threat actor deanonymization platform combining Tor infrastructure unmasking, stylometric NLP, and multi-chain graph forensics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-wider">
              <div className="rounded-full border border-line bg-card px-4 py-2 text-fg-subtle">
                REGION: AWS AP-SOUTH-1
              </div>
              <div className="rounded-full border border-line bg-card px-4 py-2 text-fg-subtle">
                ENGINE: CLAUDE SONNET 5
              </div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="rounded-full border border-line bg-card-raised px-4 py-2 text-fg-muted hover:text-fg hover:border-line-strong transition-colors"
              >
                Top ↑
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 py-14 border-b border-line-faint">
            <div>
              <p className="mb-5 font-mono text-[11px] uppercase tracking-widest text-fg">Platform</p>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => scrollToId("capabilities")} className="text-left text-fg-muted hover:text-fg transition-colors">Tor De-cloaking</button></li>
                <li><button onClick={() => scrollToId("capabilities")} className="text-left text-fg-muted hover:text-fg transition-colors">Entity Graphing</button></li>
                <li><button onClick={() => scrollToId("capabilities")} className="text-left text-fg-muted hover:text-fg transition-colors">Stylometric ML</button></li>
                <li><button onClick={() => scrollToId("capabilities")} className="text-left text-fg-muted hover:text-fg transition-colors">Wallet Tracing</button></li>
                <li><Link to="/investigation?q=shadowfox77" className="text-accent hover:underline underline-offset-4">Case Console</Link></li>
              </ul>
            </div>

            <div>
              <p className="mb-5 font-mono text-[11px] uppercase tracking-widest text-fg">Architecture</p>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => scrollToId("architecture")} className="text-left text-fg-muted hover:text-fg transition-colors">Scrapy Docker Grid</button></li>
                <li><button onClick={() => scrollToId("architecture")} className="text-left text-fg-muted hover:text-fg transition-colors">SOCKS5 Proxy Pool</button></li>
                <li><button onClick={() => scrollToId("architecture")} className="text-left text-fg-muted hover:text-fg transition-colors">PostgreSQL DB</button></li>
                <li><button onClick={() => scrollToId("architecture")} className="text-left text-fg-muted hover:text-fg transition-colors">AWS Bedrock Core</button></li>
                <li><button onClick={() => scrollToId("architecture")} className="text-left text-fg-muted hover:text-fg transition-colors">OmniRoute Failover</button></li>
              </ul>
            </div>

            <div>
              <p className="mb-5 font-mono text-[11px] uppercase tracking-widest text-fg">Resources</p>
              <ul className="space-y-3 text-sm">
                <li><a href="https://ieeexplore.ieee.org/document/11011956" target="_blank" rel="noreferrer" className="text-fg-muted hover:text-fg transition-colors">IEEE 11011956 ↗</a></li>
                <li><a href="https://ieeexplore.ieee.org/document/9739708" target="_blank" rel="noreferrer" className="text-fg-muted hover:text-fg transition-colors">IEEE 9739708 ↗</a></li>
                <li><button onClick={() => scrollToId("references")} className="text-left text-fg-muted hover:text-fg transition-colors">Research</button></li>
                <li><button onClick={() => scrollToId("faq")} className="text-left text-fg-muted hover:text-fg transition-colors">FAQ</button></li>
                <li><button onClick={() => scrollToId("team")} className="text-left text-fg-muted hover:text-fg transition-colors">Team</button></li>
              </ul>
            </div>

            <div>
              <p className="mb-5 font-mono text-[11px] uppercase tracking-widest text-fg">SIH 2026</p>
              <ul className="space-y-3 text-[13px] text-fg-muted font-mono">
                <li><span>PS ID: 26151</span></li>
                <li><span>Category: Software</span></li>
                <li><span>Theme: Blockchain &amp; Cybersecurity</span></li>
                <li><span>Team: Team Zortex</span></li>
                <li><span className="text-accent">Status: Finalist Build</span></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-fg-subtle">
            <div>© 2026 Team Zortex · DarkTrace AI Platform. All rights reserved.</div>
            <div>Smart India Hackathon 2026 // Problem Statement 26151</div>
          </div>
        </div>
      </footer>
    </div>
  );
}