// USE: Right-hand assistant panel for the Investigation console.
// A seeded chat opens with the search query as the first message and a short
// summary of the dossier as the reply. Follow-ups are answered by the fake
// generator in data/mockChat.ts — replace that with a real model call later.

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import logo from "../assets/dtai.png";
import type { InvestigationCase } from "../data/types";
import {
  buildCaseSummary,
  buildFakeReply,
  buildNotFoundReply,
  currentUser,
  suggestionsFor,
} from "../data/mockChat";
import {
  IconCheck,
  IconChevronDown,
  IconClose,
  IconNewChat,
  IconSend,
} from "./icons";

interface ChatPanelProps {
  query: string;
  found: boolean;
  data: InvestigationCase;
  /** true: open with the query + summary. false: blank greeting (new chat). */
  seed: boolean;
  onNewChat: () => void;
  onClose: () => void;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  animate: boolean;
}

const MODELS = [
  { id: "Quick", desc: "Fastest answers" },
  { id: "Pro", desc: "Advanced reasoning" },
  { id: "Max", desc: "Complex problem solving" },
];

/* ---------------------------------------------------------------- */
/*  Message rendering                                                */
/* ---------------------------------------------------------------- */

/** **bold** inline. An unclosed ** (mid-stream) stays bold to the end. */
function renderInline(line: string): ReactNode[] {
  return line.split("**").map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-fg">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function FormattedText({ text }: { text: string }) {
  return (
    <div className="space-y-1.5">
      {text.split("\n").map((line, i) => {
        if (line.trim() === "") return <div key={i} className="h-1.5" />;
        if (line.startsWith("• ")) {
          return (
            <div key={i} className="flex gap-2.5 pl-1">
              <span
                className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent"
                aria-hidden="true"
              />
              <span className="min-w-0 break-words">
                {renderInline(line.slice(2))}
              </span>
            </div>
          );
        }
        return (
          <p key={i} className="break-words">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Shows thinking dots, then reveals the text a few words at a time. */
function AssistantMessage({
  text,
  animate,
  onTick,
  onDone,
}: {
  text: string;
  animate: boolean;
  onTick: () => void;
  onDone: () => void;
}) {
  const tokens = useMemo(() => text.split(/(\s+)/), [text]);
  const skip = !animate || prefersReducedMotion();
  const [started, setStarted] = useState(skip);
  const [shown, setShown] = useState(skip ? tokens.length : 0);

  useEffect(() => {
    if (skip) {
      onDone();
      return;
    }
    const t = setTimeout(() => setStarted(true), 650);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finished = shown >= tokens.length;
  useEffect(() => {
    if (!started || skip || finished) return;
    const id = setInterval(() => {
      setShown((s) => Math.min(s + 4, tokens.length));
    }, 32);
    return () => clearInterval(id);
  }, [started, skip, finished, tokens.length]);

  useEffect(() => {
    onTick();
    if (started && !skip && shown >= tokens.length) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, started]);

  return (
    <div className="msg-in flex gap-3">
      <img
        src={logo}
        alt=""
        className="mt-0.5 h-6 w-6 shrink-0 object-contain"
      />
      <div className="min-w-0 flex-1 text-sm leading-relaxed text-fg-muted">
        {started ? (
          <FormattedText text={tokens.slice(0, shown).join("")} />
        ) : (
          <div
            className="flex h-6 items-center gap-1"
            role="status"
            aria-label="DarkTrace is thinking"
          >
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-fg-subtle" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-fg-subtle" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-fg-subtle" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Panel                                                            */
/* ---------------------------------------------------------------- */

export default function ChatPanel({
  query,
  found,
  data,
  seed,
  onNewChat,
  onClose,
}: ChatPanelProps) {
  const trimmedQuery = query.trim();
  const seeded = seed && trimmedQuery !== "";

  const [messages, setMessages] = useState<Message[]>(() =>
    seeded
      ? [
          { id: 1, role: "user", text: trimmedQuery, animate: false },
          {
            id: 2,
            role: "assistant",
            text: found ? buildCaseSummary(data) : buildNotFoundReply(trimmedQuery),
            animate: true,
          },
        ]
      : [],
  );
  const [busy, setBusy] = useState(seeded);
  const [draft, setDraft] = useState("");
  const [model, setModel] = useState("Quick");
  const [modelOpen, setModelOpen] = useState(false);

  const idRef = useRef(10);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);
  const handleDone = useCallback(() => setBusy(false), []);

  useEffect(() => {
    scrollToEnd();
  }, [messages.length, scrollToEnd]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) {
        setModelOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (draft === "" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [draft]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    const userId = idRef.current++;
    const replyId = idRef.current++;
    setMessages((m) => [
      ...m,
      { id: userId, role: "user", text, animate: false },
      {
        id: replyId,
        role: "assistant",
        text: buildFakeReply(text, data, found),
        animate: true,
      },
    ]);
    setBusy(true);
    setDraft("");
  };

  const suggestions = suggestionsFor(found);

  return (
    <aside className="flex h-full w-full flex-col bg-band">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-line-faint px-4">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="" className="h-5 w-5 object-contain" />
          <span className="text-sm font-medium text-fg">Assistant</span>
          <span
            className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-subtle"
            title="Responses are simulated from the demo dossier"
          >
            Demo
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onNewChat}
            aria-label="New chat"
            title="New chat"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-fg/[0.07] hover:text-fg"
          >
            <IconNewChat className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            title="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-fg/[0.07] hover:text-fg"
          >
            <IconClose className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {/* Conversation */}
      <div
        ref={scrollRef}
        className="scroll-thin min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5"
      >
        {messages.length === 0 && (
          <h2 className="pt-4 font-display text-4xl leading-[1.05] tracking-tight text-fg">
            Hey {currentUser.firstName}, what’s on your mind today?
          </h2>
        )}

        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="msg-in flex justify-end">
              <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md border border-line bg-card-raised px-4 py-2.5 text-sm text-fg">
                {m.text}
              </div>
            </div>
          ) : (
            <AssistantMessage
              key={m.id}
              text={m.text}
              animate={m.animate}
              onTick={scrollToEnd}
              onDone={handleDone}
            />
          ),
        )}
      </div>

      {/* Context, suggestions, composer */}
      <div className="shrink-0 space-y-2.5 px-3 pb-3 pt-2">
        {found && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-card px-3.5 py-2.5 text-xs">
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-accent"
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate font-medium text-fg">
              Dossier · {data.actor.handle}
            </span>
            <span className="shrink-0 font-mono text-fg-subtle">
              +{data.sources.length} sources
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              disabled={busy}
              onClick={() => send(s)}
              className="rounded-full border border-line px-3.5 py-1.5 text-xs text-fg-muted transition-colors hover:border-line-strong hover:text-fg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="rounded-[24px] bg-card-raised/80 p-3 shadow-search ring-1 ring-line transition-all focus-within:shadow-search-focus focus-within:ring-accent/60">
          <textarea
            ref={textareaRef}
            rows={1}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send(draft);
              }
            }}
            placeholder={found ? "Ask about this dossier" : "Ask DarkTrace"}
            aria-label="Message the assistant"
            className="max-h-36 w-full resize-none bg-transparent px-2 py-1.5 text-sm text-fg placeholder:text-fg-faint focus:outline-none"
          />

          <div className="mt-1 flex items-center justify-between">
            <div className="relative" ref={modelRef}>
              <button
                type="button"
                onClick={() => setModelOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={modelOpen}
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:bg-fg/[0.07] hover:text-fg"
              >
                {model}
                <IconChevronDown className="h-3.5 w-3.5" />
              </button>

              {modelOpen && (
                <div
                  role="listbox"
                  className="absolute bottom-full left-0 z-20 mb-2 flex w-60 flex-col gap-1 rounded-2xl border border-line bg-card-raised p-2 shadow-pop"
                >
                  {MODELS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      role="option"
                      aria-selected={model === m.id}
                      onClick={() => {
                        setModel(m.id);
                        setModelOpen(false);
                      }}
                      className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                        model === m.id
                          ? "border-accent/40 bg-accent/10"
                          : "border-transparent hover:bg-fg/[0.06]"
                      }`}
                    >
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-accent">
                        {model === m.id && <IconCheck />}
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-medium text-fg">{m.id}</span>
                        <span className="text-xs text-fg-muted">{m.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => send(draft)}
              disabled={busy || draft.trim() === ""}
              aria-label="Send message"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-solid text-white transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:bg-fg/[0.08] disabled:text-fg-faint"
            >
              <IconSend className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
