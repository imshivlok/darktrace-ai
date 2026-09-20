// USE: Left sidebar for the Investigation console — branding, new search /
// new chat, filterable list of previous queries, and the signed-in user.
// Collapses to an icon rail on desktop; the page renders it inside a drawer
// on small screens (pass `mobile`).

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/dtai.png";
import { currentUser } from "../data/mockChat";
import {
  IconChat,
  IconClose,
  IconHome,
  IconNewChat,
  IconPanel,
  IconSearch,
} from "./icons";

export interface HistoryItem {
  query: string;
  found: boolean;
}

interface ConsoleSidebarProps {
  history: HistoryItem[];
  activeQuery: string;
  collapsed?: boolean;
  /** Rendered inside the mobile drawer: never collapsed, shows a close button. */
  mobile?: boolean;
  onToggleCollapsed?: () => void;
  onSelectQuery: (query: string) => void;
  onNewSearch: () => void;
  onNewChat: () => void;
  /** Called after any action so the mobile drawer can close itself. */
  onAction?: () => void;
}

const norm = (s: string) => s.trim().toLowerCase();

function Avatar() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-card-raised text-xs font-medium text-fg-muted">
      {currentUser.initials}
    </div>
  );
}

export default function ConsoleSidebar({
  history,
  activeQuery,
  collapsed = false,
  mobile = false,
  onToggleCollapsed,
  onSelectQuery,
  onNewSearch,
  onNewChat,
  onAction,
}: ConsoleSidebarProps) {
  const [filter, setFilter] = useState("");

  const visible = useMemo(() => {
    const f = norm(filter);
    return f ? history.filter((h) => norm(h.query).includes(f)) : history;
  }, [history, filter]);

  const run = (fn: () => void) => () => {
    fn();
    onAction?.();
  };

  /* ---------------- Collapsed rail (desktop only) ---------------- */
  if (collapsed && !mobile) {
    return (
      <nav
        aria-label="Console"
        className="flex h-full w-full flex-col items-center gap-2 bg-band py-3"
      >
        <Link to="/" aria-label="DarkTrace AI home" className="mb-1 mt-1">
          <img src={logo} alt="" className="h-7 w-7 object-contain" />
        </Link>
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label="Expand sidebar"
          title="Expand sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-fg-muted transition-colors hover:bg-fg/[0.07] hover:text-fg"
        >
          <IconPanel />
        </button>

        <div className="mt-3 flex flex-col gap-1">
          <button
            type="button"
            onClick={onNewSearch}
            aria-label="New search"
            title="New search"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-accent transition-colors hover:bg-fg/[0.07]"
          >
            <IconSearch />
          </button>
          <button
            type="button"
            onClick={onNewChat}
            aria-label="New chat"
            title="New chat"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-fg-muted transition-colors hover:bg-fg/[0.07] hover:text-fg"
          >
            <IconNewChat />
          </button>
        </div>

        <div className="mt-auto">
          <Avatar />
        </div>
      </nav>
    );
  }

  /* ---------------- Expanded ---------------- */
  return (
    <nav aria-label="Console" className="flex h-full w-full flex-col bg-band">
      <div className="flex h-14 shrink-0 items-center justify-between px-4">
        <Link
          to="/"
          onClick={onAction}
          className="flex items-center gap-2.5"
          aria-label="DarkTrace AI home"
        >
          <img src={logo} alt="" className="h-7 w-7 object-contain" />
          <span className="text-base font-semibold tracking-tight text-fg">
            DarkTrace <span className="font-normal text-fg-subtle">AI</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={mobile ? onAction : onToggleCollapsed}
          aria-label={mobile ? "Close menu" : "Collapse sidebar"}
          title={mobile ? "Close" : "Collapse sidebar"}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-fg/[0.07] hover:text-fg"
        >
          {mobile ? <IconClose className="h-[18px] w-[18px]" /> : <IconPanel className="h-[18px] w-[18px]" />}
        </button>
      </div>

      <div className="space-y-0.5 px-3 pt-2">
        <button
          type="button"
          onClick={run(onNewSearch)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-fg transition-colors hover:bg-fg/[0.07]"
        >
          <IconSearch className="h-[18px] w-[18px] text-accent" />
          New search
        </button>
        <button
          type="button"
          onClick={run(onNewChat)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-fg-muted transition-colors hover:bg-fg/[0.07] hover:text-fg"
        >
          <IconChat className="h-[18px] w-[18px]" />
          New chat
        </button>
      </div>

      <div className="px-3 pt-4">
        <label className="flex items-center gap-2.5 rounded-xl bg-card-raised/70 px-3 py-2 ring-1 ring-line transition-all focus-within:ring-accent/60">
          <IconSearch className="h-4 w-4 shrink-0 text-fg-subtle" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search queries"
            aria-label="Search previous queries"
            className="w-full min-w-0 bg-transparent text-sm text-fg placeholder:text-fg-faint focus:outline-none"
          />
        </label>
      </div>

      <p className="px-6 pb-2 pt-6 font-mono text-[11px] uppercase tracking-widest text-fg-subtle">
        Recents
      </p>

      <ul className="scroll-thin min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 pb-3">
        {visible.length === 0 && (
          <li className="px-3 py-2 text-sm text-fg-subtle">
            No matching queries
          </li>
        )}
        {visible.map((item) => {
          const active = norm(item.query) === norm(activeQuery);
          return (
            <li key={item.query}>
              <button
                type="button"
                onClick={run(() => onSelectQuery(item.query))}
                aria-current={active ? "page" : undefined}
                title={item.found ? item.query : `${item.query} (no record found)`}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors ${
                  active
                    ? "bg-fg/[0.08] text-fg"
                    : "text-fg-muted hover:bg-fg/[0.05] hover:text-fg"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    item.found ? "bg-accent" : "border border-fg-faint"
                  }`}
                  aria-hidden="true"
                />
                <span className="truncate font-mono text-[13px]">
                  {item.query}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex shrink-0 items-center gap-3 border-t border-line-faint p-3">
        <Avatar />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-fg">
            {currentUser.name}
          </p>
          <p className="truncate text-xs text-fg-subtle">{currentUser.org}</p>
        </div>
        <Link
          to="/"
          onClick={onAction}
          aria-label="Home"
          title="Home"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-fg/[0.07] hover:text-fg"
        >
          <IconHome className="h-[18px] w-[18px]" />
        </Link>
      </div>
    </nav>
  );
}
