// USE: Landing page for DarkTrace. Top navbar (About / Dark Web dropdown),
// hero + search entry point, concept cards, team, and a short history
// section. On search submit, reveals the floating sidebar (via
// onSearchSubmit) and navigates to /investigation?q=<query>.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import zortexLogo from "../assets/zortex.jpg";
// import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ProjectOverview from "../components/ProjectOverview";
import HistoryTimeline from "../components/HistoryTimeline";
import { Link } from "react-router-dom";
import TechStack from "../components/TechStack";
import FAQ from "../components/FAQ";
import ScrollProgress from "../components/ScrollProgress";

interface HomeProps {
  onSearchSubmit: (query: string) => void;
}

const darkWebLinks = [
  { label: "PGP keys", id: "pgp-keys" },
  { label: "Wallets & transactions", id: "wallets" },
  { label: "Hidden infrastructure", id: "infrastructure" },
  { label: "Sources & intelligence", id: "sources" },
];

const conceptCards = [
  {
    id: "pgp-keys",
    accent: "zinc",
    title: "PGP keys",
    body: "Actors sign posts and messages with a PGP key to prove identity across forums and marketplaces. Reused keys are one of the strongest links between otherwise separate aliases.",
    icon: (
      <>
        <circle cx="8" cy="15" r="4" />
        <path d="M11 12l7-7M16 5h3v3M13 9l2 2" />
      </>
    ),
  },
  {
    id: "wallets",
    accent: "emerald",
    title: "Wallets & transactions",
    body: "Cryptocurrency addresses tied to an actor reveal payment flows, marketplace vendor accounts, and — when addresses get reused — connections between separate operations.",
    icon: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18M16 14h2" />
      </>
    ),
  },
  {
    id: "infrastructure",
    accent: "red",
    title: "Hidden infrastructure",
    body: "Misconfigured onion services — exposed status pages, reused SSL certificates, leaked headers — can unmask the clearnet server behind a .onion address.",
    icon: (
      <>
        <rect x="4" y="4" width="16" height="6" rx="1.5" />
        <rect x="4" y="14" width="16" height="6" rx="1.5" />
        <circle cx="8" cy="7" r="0.8" fill="currentColor" />
        <circle cx="8" cy="17" r="0.8" fill="currentColor" />
      </>
    ),
  },
  {
    id: "sources",
    accent: "amber",
    title: "Sources & intelligence",
    body: "Forums, marketplaces, Telegram channels, and paste sites where an actor is observed — each rated for reliability so weak signals don't outweigh strong ones.",
    icon: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H17l3 3v12.5A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-13Z" />
        <path d="M9 11h6M9 15h6" />
      </>
    ),
  },
  {
    id: "relationships",
    accent: "sky",
    title: "Relationship mapping",
    body: "Aliases, keys, wallets, and entities rarely stand alone. Mapping how they connect turns scattered indicators into a picture of a single actor's footprint.",
    icon: (
      <>
        <circle cx="6" cy="6" r="2.2" />
        <circle cx="18" cy="6" r="2.2" />
        <circle cx="12" cy="18" r="2.2" />
        <path d="M8 7.3 10.5 16M16 7.3 13.5 16M8.3 6h7.4" />
      </>
    ),
  },
  {
    id: "timeline",
    accent: "cyan",
    title: "Timeline reconstruction",
    body: "First appearance, key rotations, cross-platform links, and leaks — ordered chronologically to show how an actor's presence evolved over time.",
    icon: (
      <>
        <circle cx="5" cy="6" r="1.5" />
        <circle cx="5" cy="12" r="1.5" />
        <circle cx="5" cy="18" r="1.5" />
        <path d="M9 6h10M9 12h10M9 18h10" />
      </>
    ),
  },
] as const;

const accentClasses: Record<string, string> = {
  zinc: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
  emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  red: "border-red-500/30 bg-red-500/10 text-red-300",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  sky: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  cyan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
};

// Placeholder team — swap in real names/roles/bios later.
const team = [
  { name: "Shivlok Sharma", role: "Team Lead · Backend and LLM" },
  { name: "Vaibhav Singh", role: "Frontend Designer" },
  { name: "Yogi Khanna", role: "Presentation and documentation" },
  { name: "Tejas Kumar Vishwakarma", role: "Research and analysis" },
  { name: "Kashvi Jaiswal", role: "Scriptwriter, Content Specialist" },
  { name: "Prachi Aswal", role: "Presentation and Project communication" },
];

const history = [
  {
    year: "1969",
    title: "ARPANET goes live",
    body: "The US Department of Defense project that would eventually become the internet lays the groundwork for anonymous, distributed networking.",
  },
  {
    year: "2002",
    title: "Tor is released publicly",
    body: "The Tor Project releases its onion-routing software, letting anyone host and browse hidden services without revealing their location.",
  },
  {
    year: "2011",
    title: "Silk Road launches",
    body: "The first major dark web marketplace popularizes the combination of Tor and Bitcoin for anonymous trade — shut down by the FBI in 2013.",
  },
  {
    year: "2014–2017",
    title: "The marketplace era",
    body: "AlphaBay, Hansa, and dozens of successors rise and fall, each raising the bar on vendor reputation systems and escrow.",
  },
  {
    year: "Today",
    title: "A fragmented landscape",
    body: "Telegram channels and decentralized marketplaces have replaced many centralized forums, making cross-platform correlation more important than ever.",
  },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const Home = ({ onSearchSubmit }: HomeProps) => {
  // const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileDarkWebOpen, setMobileDarkWebOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [revealedTeam, setRevealedTeam] = useState(false);
  // const [historyStarted, setHistoryStarted] = useState(false);

  const handleSearch = (query: string) => {
    onSearchSubmit(query);
  };

  return (
    <div className="min-h-screen">
      {/* NAVBAR */}
      <ScrollProgress />
      <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-[#0d0e10]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-10">
            <Link to={"/"}>
              <span className="text-lg font-semibold tracking-tight text-slate-100">
                Dark<span className="text-cyan-400">Trace</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              <button
                type="button"
                onClick={() => scrollToId("about")}
                className="rounded-lg px-3.5 py-2 text-sm text-slate-400 transition-colors duration-150 hover:bg-slate-800/50 hover:text-slate-100"
              >
                About
              </button>

              <div className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm text-slate-400 transition-colors duration-150 hover:bg-slate-800/50 hover:text-slate-100"
                >
                  Dark web
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5 transition-transform duration-150 group-hover:rotate-180"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                  <div className="w-56 rounded-xl border border-slate-700/60 bg-[#141517] p-1.5 shadow-2xl shadow-black/60">
                    {darkWebLinks.map((link) => (
                      <button
                        key={link.id}
                        type="button"
                        onClick={() => scrollToId(link.id)}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition-colors duration-150 hover:bg-slate-800/60 hover:text-slate-100"
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => scrollToId("history")}
                className="rounded-lg px-3.5 py-2 text-sm text-slate-400 transition-colors duration-150 hover:bg-slate-800/50 hover:text-slate-100"
              >
                History
              </button>
            </nav>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Prototype
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 text-slate-300 md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              {mobileNavOpen ? (
                <path d="M6 6l12 12M18 6 6 18" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileNavOpen && (
          <div className="border-t border-slate-800/70 px-4 py-3 md:hidden">
            <button
              type="button"
              onClick={() => {
                scrollToId("about");
                setMobileNavOpen(false);
              }}
              className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-slate-300"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => setMobileDarkWebOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-slate-300"
            >
              Dark web
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-3.5 w-3.5 transition-transform duration-150 ${mobileDarkWebOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {mobileDarkWebOpen && (
              <div className="ml-3 border-l border-slate-800/70 pl-3">
                {darkWebLinks.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => {
                      scrollToId(link.id);
                      setMobileNavOpen(false);
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-400"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                scrollToId("history");
                setMobileNavOpen(false);
              }}
              className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-slate-300"
            >
              History
            </button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-3xl px-4 pb-14 pt-16 text-center sm:px-6 sm:pt-24">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-sm leading-relaxed text-slate-400 sm:text-base"
        >
          Search a handle, PGP key, wallet address, or domain to trace an
          actor's footprint across the dark web.
        </motion.p>

        <h1 className="mt-4 flex flex-wrap items-center justify-center gap-x-2.5 text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl">
          {["Attribution", "starts", "with"].map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.15 + i * 0.1,
                ease: "easeOut",
              }}
            >
              {word}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
            className="text-cyan-400"
          >
            one identifier.
          </motion.span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-8"
        >
          <SearchBar onSearch={handleSearch} />
        </motion.div>
      </section>

      {/* CONCEPT CARDS */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
        <div className="mb-12 text-center">
          <h2 className="bg-linear-to-r from-zinc-300 via-cyan-300 to-emerald-300 bg-clip-text pb-2 text-3xl font-semibold leading-normal tracking-tight text-transparent sm:text-4xl">
            Mapping the dark web
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
            The signals that connect an alias to a real actor.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {conceptCards.map((card, i) => {
            const isExpanded = expandedCard === card.id;
            return (
              <motion.div
                key={card.id}
                id={card.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                whileHover={{ scale: 1.015 }}
                className={`scroll-mt-24 rounded-2xl border bg-[#111214]/70 p-5 backdrop-blur-xl transition-colors duration-200 ${
                  isExpanded
                    ? accentClasses[card.accent].split(" ")[0]
                    : "border-slate-700/50 hover:border-slate-600/60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${accentClasses[card.accent]}`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      {card.icon}
                    </svg>
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedCard(isExpanded ? null : card.id)}
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${accentClasses[card.accent]}`}
                  >
                    <motion.svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      animate={{ rotate: isExpanded ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="h-4 w-4"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </motion.svg>
                  </button>
                </div>

                <h3 className="mt-4 text-base font-medium text-slate-100">
                  {card.title}
                </h3>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">
                        {card.body}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isExpanded && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                    {card.body}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>
      {/* TECH STACK */}
      <section className="border-t border-slate-800/60 px-4 py-14 sm:px-6">
        <TechStack />
      </section>

      {/* PROJECT OVERVIEW + FLOWCHART */}
      <section className="border-t border-slate-800/60 px-4 py-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ transformOrigin: "center" }}
        >
          <ProjectOverview />
        </motion.div>
      </section>

      {/* ABOUT / TEAM */}
      <section
        id="about"
        className="scroll-mt-20 border-t border-slate-800/60 bg-[#0b0c0e]"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-semibold text-slate-100">The team</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
            Tap the stack to meet everyone.
          </p>

          <div className="mt-12 flex justify-center">
            <div
              className={
                revealedTeam
                  ? "flex flex-wrap justify-center gap-4"
                  : "relative h-40 w-37.5"
              }
            >
              {!revealedTeam && (
                <motion.button
                  type="button"
                  onClick={() => setRevealedTeam(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl border border-cyan-500/40 bg-[#111214] shadow-xl shadow-black/50"
                >
                  <span className="text-[10px] uppercase tracking-widest text-slate-500">
                    Team
                  </span>
                  <span className="mt-1 text-lg font-semibold text-slate-100">
                    Zort<span className="text-cyan-400">ex</span>
                  </span>
                  <span className="mt-3 text-[10px] text-slate-500">
                    Tap to reveal
                  </span>
                </motion.button>
              )}

              {team.map((member, i) => {
                const initials = member.name
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("");

                return (
                  <motion.div
                    key={member.name}
                    layout
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    style={
                      revealedTeam
                        ? undefined
                        : {
                            position: "absolute",
                            inset: 0,
                            zIndex: team.length - i,
                            transform: `translate(${i * 5}px, ${i * 5}px) rotate(${i % 2 === 0 ? -i * 1.5 : i * 1.5}deg)`,
                          }
                    }
                    className="flex w-42.5 flex-col items-center rounded-2xl border border-slate-700/50 bg-[#111214]/90 p-5 text-center"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-700/60 bg-slate-800/60 font-mono text-sm text-slate-300">
                      {initials}
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-200">
                      {member.name}
                    </p>
                    <p className="mt-1.5 text-xs leading-snug text-cyan-300">
                      {member.role}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* HISTORY */}
      <section
        id="history"
        className="scroll-mt-20 border-t border-slate-800/60"
      >
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <HistoryTimeline items={history} />
        </div>
      </section>
      {/* FAQ */}
      <section className="border-t border-slate-800/60 px-4 py-16 sm:px-6">
        <FAQ />
      </section>
      {/* FINAL CTA */}
      <section className="border-t border-slate-800/60 px-4 py-20 text-center sm:px-6">
        <h2 className="text-3xl tracking-tight text-slate-100 sm:text-3xl">
          Ready to trace your first lead?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-400 sm:text-base">
          Search a handle, PGP key, wallet address, or domain — no setup
          required.
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-8 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-6 py-3 text-sm font-medium text-cyan-300 transition-all duration-200 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_-4px_rgba(34,211,238,0.5)] active:scale-95"
        >
          Start investigating
        </button>
      </section>
      {/* Footer */}
      <footer className="border-t border-slate-800/60 px-4 py-12 sm:px-6">
        <div className="mx-auto flex h-30 w-40 items-center justify-center rounded-2xl border border-slate-700/60 bg-[#111214]">
          <span className="text-[10px] uppercase tracking-widest text-slate-600 border-2 border-cyan-400 rounded-xl m-2">
            <img
              src={zortexLogo}
              alt="Team Zortex"
              className="h-full w-full object-contain rounded-2xl"
            />
          </span>
        </div>

        <p className="mt-4 text-center text-sm font-medium text-slate-300">
          Team Zort<span className="text-cyan-400">ex</span>
        </p>

        <div className="mx-auto mt-12 flex max-w-5xl flex-col items-start  gap-20 border-t border-slate-800/60 pt-10 sm:flex-row">
          <div>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-3xl font-semibold tracking-tight text-slate-100 transition-opacity duration-150 hover:opacity-80"
            >
              Dark<span className="text-cyan-400">Trace</span>
            </button>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              Dark-web threat actor intelligence and investigation platform.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest text-slate-500">
              Quick links
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="text-sm text-slate-400 transition-colors duration-150 hover:text-cyan-300"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToId("about")}
                  className="text-sm text-slate-400 transition-colors duration-150 hover:text-cyan-300"
                >
                  Project overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToId("pgp-keys")}
                  className="text-sm text-slate-400 transition-colors duration-150 hover:text-cyan-300"
                >
                  Dark web concepts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToId("history")}
                  className="text-sm text-slate-400 transition-colors duration-150 hover:text-cyan-300"
                >
                  History
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl border-t border-slate-800/60 pt-6 text-center text-xs text-slate-600">
          DarkTrace — OSINT threat actor investigation platform.
        </div>
      </footer>
    </div>
  );
};

export default Home;
