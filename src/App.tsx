import { useEffect } from "react";
import Lenis from "lenis";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Investigation from "./pages/Investigation";

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const navigate = useNavigate();

  const handleSearchSubmit = (query: string) => {
    navigate(`/investigation?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen w-full bg-[#08090C] text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Home onSearchSubmit={handleSearchSubmit} />} />
          <Route path="/investigation" element={<Investigation />} />
        </Routes>
      </main>
    </div>
  );
}