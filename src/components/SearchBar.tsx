import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search handle, PGP fingerprint, wallet address or onion domain...",
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
        className={`group relative flex items-center gap-3 rounded-xl border bg-[#0b0d13]/90 px-4 py-3 sm:px-5 sm:py-3.5 backdrop-blur-2xl transition-all duration-200 ${
          isFocused
            ? "border-cyan-400 shadow-[0_0_30px_-5px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400/50"
            : "border-slate-800 hover:border-slate-700 shadow-xl shadow-black/80"
        }`}
      >
        {/* Terminal prompt symbol */}
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-semibold select-none">
          <span className="text-cyan-500/80">root@darktrace</span>
          <span className="text-slate-500">~#</span>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          aria-label="Search identifier"
          className="peer flex-1 min-w-0 bg-transparent outline-none font-mono text-sm sm:text-base text-cyan-100 placeholder:text-slate-600 caret-cyan-400"
        />

        {/* Action Button / Command Key */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`shrink-0 flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-mono font-medium transition-all ${
            canSubmit
              ? "bg-cyan-500 text-black font-semibold hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] active:scale-95 cursor-pointer"
              : "bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed"
          }`}
        >
          <span>INITIATE TRACE</span>
          <kbd className="hidden sm:inline-block rounded border border-black/20 bg-black/10 px-1 text-[10px]">↵</kbd>
        </button>
      </div>

      {/* Target Chips */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] text-slate-500">
        <span className="text-slate-600">INPUT TYPES:</span>
        <span className="rounded bg-slate-900/80 px-2 py-0.5 border border-slate-800 text-slate-400">@handle</span>
        <span className="rounded bg-slate-900/80 px-2 py-0.5 border border-slate-800 text-slate-400">0x...PGP</span>
        <span className="rounded bg-slate-900/80 px-2 py-0.5 border border-slate-800 text-slate-400">bc1q...BTC</span>
        <span className="rounded bg-slate-900/80 px-2 py-0.5 border border-slate-800 text-slate-400">*.onion</span>
      </div>
    </form>
  );
}