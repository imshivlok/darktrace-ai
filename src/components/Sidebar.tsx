// USE: Floating glass sidebar, icon-only by default with an expand toggle
// to reveal labels. Margins on top/bottom/left (not edge-to-edge), fully
// rounded corners, smooth enter animation. Same style used everywhere
// (Home after search reveal, and the Investigation page).

import { useState } from "react";

interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  items: SidebarNavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

const icons = {
  home: (
    <path d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  graph: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M8 7.5 10.5 16M16 7.5 13.5 16M8.5 6h7" />
    </>
  ),
  evidence: (
    <>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </>
  ),
  timeline: (
    <>
      <circle cx="5" cy="6" r="1.6" />
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="5" cy="18" r="1.6" />
      <path d="M9 6h10M9 12h10M9 18h10" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M16 14h2" />
    </>
  ),
  sources: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H17l3 3v12.5A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-13Z" />
      <path d="M9 11h6M9 15h6" />
    </>
  ),
} as const;

export const defaultNavItems: SidebarNavItem[] = [
  { id: "home", label: "Home", icon: icons.home },
  { id: "investigation", label: "Investigation", icon: icons.search },
  { id: "relationships", label: "Relationships", icon: icons.graph },
  { id: "evidence", label: "Evidence", icon: icons.evidence },
  { id: "timeline", label: "Timeline", icon: icons.timeline },
  { id: "wallets", label: "Wallets", icon: icons.wallet },
  { id: "sources", label: "Sources", icon: icons.sources },
];

export default function Sidebar({
  items,
  activeId,
  onNavigate,
  mobileOpen,
  onMobileOpenChange,
}: SidebarProps) {
  const [expanded, setExpanded] = useState(false);

  const NavList = ({ showLabels }: { showLabels: boolean }) => (
    <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onNavigate(item.id);
              onMobileOpenChange(false);
            }}
            title={!showLabels ? item.label : undefined}
            className={[
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-150",
              isActive
                ? "bg-linear-to-r from-zinc-500/15 to-cyan-500/10 text-zinc-200 border border-zinc-500/30"
                : "text-slate-400 border border-transparent hover:bg-slate-800/40 hover:text-slate-200",
            ].join(" ")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4.5 w-4.5 shrink-0"
            >
              {item.icon}
            </svg>
            {showLabels && <span className="truncate">{item.label}</span>}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* --- MOBILE: full-screen overlay drawer (unchanged behavior) --- */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-[#111214] md:hidden">
          <div className="flex items-center justify-between border-b border-slate-800/60 px-4 py-4">
            <span className="font-mono text-base font-semibold text-slate-100">
              DarkTrace
            </span>
            <button
              type="button"
              onClick={() => onMobileOpenChange(false)}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/50 text-slate-300"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                className="h-5 w-5"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <NavList showLabels />
        </div>
      )}

      {/* --- DESKTOP: floating glass sidebar, margins on top/bottom/left --- */}
      <aside
        className={[
          "hidden md:flex md:fixed md:top-6 md:bottom-6 md:left-4 z-30",
          "rounded-2xl overflow-hidden",
          "border border-slate-700/90 bg-[#111214]/90 backdrop-blur-xl",
          "shadow-sm shadow-white/50 flex-col",
          "transition-[width] duration-300 ease-out",
          "animate-[sidebarIn_0.3s_ease-out]",
          expanded ? "w-56" : "w-16",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 px-3 py-4">
          {expanded && (
            <span className="ml-2 truncate font-mono text-lg font-semibold tracking-tight text-slate-100">
              Dark<span className="text-cyan-400">Trace</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700/50 text-slate-400 transition-colors duration-150 hover:border-zinc-500/40 hover:text-zinc-300"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            >
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
        </div>
        <NavList showLabels={expanded} />
      </aside>
    </>
  );
}
