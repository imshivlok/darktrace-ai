import { useState, useEffect } from "react";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Sidebar, { defaultNavItems } from "./components/Sidebar";
import SearchTransition from "./components/SearchTransition";
import Home from "./pages/Home";
import Investigation from "./pages/Investigation";

const investigationSections = new Set([
  "overview",
  "infrastructure",
  "relationships",
  "evidence",
  "timeline",
  "wallets",
  "sources",
]);

const App = () => {
  //lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  // const [homeRevealed, setHomeRevealed] = useState(false);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);

  const isHome = location.pathname === "/";
  const showSidebar = !isHome;

  const activeId =
    location.pathname === "/"
      ? "home"
      : location.pathname === "/investigation"
        ? "investigation"
        : location.hash
          ? location.hash.replace("#", "")
          : "investigation";

  const handleNavigate = (id: string) => {
    if (id === "home") {
      navigate("/");
      return;
    }
    if (id === "investigation") {
      navigate("/investigation");
      return;
    }
    if (investigationSections.has(id)) {
      if (location.pathname !== "/investigation") {
        navigate(`/investigation#${id}`);
      }
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      });
    }
  };
  //transition
  const handleSearchStart = (query: string) => {
    setPendingQuery(query);
    setTimeout(() => {
      navigate(`/investigation?q=${encodeURIComponent(query)}`);
      setPendingQuery(null);
    }, 1000); // matches SearchTransition's total animation time
  };

  return (
    <div className="main flex min-h-screen w-screen">
      <AnimatePresence>
        {pendingQuery !== null && <SearchTransition />}
      </AnimatePresence>
      {showSidebar && (
        <Sidebar
          items={defaultNavItems}
          activeId={activeId}
          onNavigate={handleNavigate}
          mobileOpen={mobileOpen}
          onMobileOpenChange={setMobileOpen}
        />
      )}

      <main className="flex-1 overflow-x-hidden md:pl-20">
        {/* Mobile-only top bar with hamburger button */}
        {showSidebar && (
          <div className="flex items-center gap-3 border-b border-slate-800/60 px-4 py-3 md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/50 text-slate-300"
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
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-mono text-sm font-semibold text-slate-100">
              DarkTrace
            </span>
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={<Home onSearchSubmit={handleSearchStart} />}
          />
          <Route path="/investigation" element={<Investigation />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
