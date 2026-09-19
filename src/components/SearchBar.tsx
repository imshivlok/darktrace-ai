import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";

interface SearchBarProps {
  /** Called with the trimmed query when the user submits a non-empty search */
  onSearch: (query: string) => void;
  /** Placeholder text shown in the input */
  placeholder?: string;
  /** Optional initial value */
  defaultValue?: string;
}

/**
 * Primary investigation search control.
 *
 * Accepts threat-actor handles, aliases, PGP keys, wallet addresses,
 * or infrastructure indicators (domains/IPs) as free text. Purely
 * presentational + controlled — no API calls, no data fetching.
 */
export default function SearchBar({
  onSearch,
  placeholder = "Search handle, PGP key, wallet or domain...",
  defaultValue = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmed = query.trim();
  const canSubmit = trimmed.length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onSearch(trimmed);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Investigate a threat actor identifier"
      className="w-full max-w-3xl mx-auto"
    >
      <div
        className={[
          "group relative flex items-center gap-3 rounded-2xl",
          "border bg-[#111214]/80 backdrop-blur-xl",
          "px-4 py-3 sm:px-5 sm:py-3.5",
          "transition-all duration-300 ease-out",
          isFocused
            ? "border-zinc-400/90 shadow-[0_0_0_1px_rgba(161, 161, 170,0.3),0_0_32px_-6px_rgba(82, 82, 91,0.45)] scale-[1.01]"
            : "border-slate-700/90 hover:border-zinc-500/40 hover:shadow-[0_0_20px_-8px_rgba(113, 113, 122,0.35)]",
        ].join(" ")}
      >
        {/* Search icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={[
            "h-5 w-5 shrink-0 transition-colors duration-300",
            isFocused
              ? "text-zinc-300"
              : "text-slate-500 group-hover:text-zinc-400",
          ].join(" ")}
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          aria-label="Search identifier"
          className={[
            "peer flex-1 min-w-0 bg-transparent outline-none",
            "font-mono text-[15px] sm:text-base tracking-tight",
            "text-slate-100 placeholder:text-slate-500 placeholder:font-sans",
            "caret-zinc-400",
          ].join(" ")}
        />

        {/* Divider */}
        <div
          className="hidden sm:block h-6 w-px bg-slate-700/50"
          aria-hidden="true"
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={[
            "shrink-0 rounded-xl px-4 py-2 sm:px-5 sm:py-2.5",
            "text-sm font-medium tracking-tight",
            "transition-all duration-200 ease-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090a]",
            canSubmit
              ? "bg-linear-to from-zinc-500 to-cyan-500 text-white hover:from-zinc-400 hover:to-cyan-400 hover:shadow-[0_0_18px_-2px_rgba(113, 113, 122,0.6)] active:scale-[0.96]"
              : "bg-slate-800/70 text-slate-500 cursor-not-allowed",
          ].join(" ")}
        >
          Investigate
        </button>
      </div>

      {/* Helper row: signals supported identifier types without being decorative chrome */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-1 text-xs text-slate-500">
        <span className="transition-colors duration-200 hover:text-zinc-300 cursor-default">
          Handles
        </span>
        <Dot />
        <span className="transition-colors duration-200 hover:text-zinc-300 cursor-default">
          PGP keys
        </span>
        <Dot />
        <span className="transition-colors duration-200 hover:text-zinc-300 cursor-default">
          Wallet addresses
        </span>
        <Dot />
        <span className="transition-colors duration-200 hover:text-zinc-300 cursor-default">
          Domains &amp; infrastructure
        </span>
      </div>
    </form>
  );
}

function Dot() {
  return (
    <span className="h-1 w-1 rounded-full bg-slate-700" aria-hidden="true" />
  );
}
