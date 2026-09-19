// USE: Animated history timeline for Home page. Each item is a bordered
// box; on "Start animation", boxes sequentially light up (full border,
// not just one edge), followed by an arrow connector, then the next box.
// Self-contained — manages its own play state and resets when done.

import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface HistoryItem {
  year: string;
  title: string;
  body: string;
}

interface HistoryTimelineProps {
  items: HistoryItem[];
}

const BOX_DURATION = 0.5;
const CONNECTOR_DURATION = 0.25;
const STEP_TOTAL = BOX_DURATION + CONNECTOR_DURATION;

const idleStyle = {
  borderColor: "rgba(51,65,85,0.5)",
  boxShadow: "0 0 0px rgba(34,211,238,0)",
};
const activeStyle = {
  borderColor: "rgba(34,211,238,0.8)",
  boxShadow: "0 0 16px -4px rgba(34,211,238,0.45)",
};

export default function HistoryTimeline({ items }: HistoryTimelineProps) {
  const [playing, setPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const start = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setPlaying(true);
    setHasPlayed(true);
    setPlayKey((k) => k + 1); // forces a clean remount -> replay works every time
    const totalMs = items.length * STEP_TOTAL * 1000;
    timeoutRef.current = window.setTimeout(
      () => setPlaying(false),
      totalMs + 200,
    );
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-100">
          A short history of the dark web
        </h2>
        <button
          type="button"
          onClick={start}
          disabled={playing}
          className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-300 transition-colors duration-150 hover:bg-cyan-500/20 disabled:opacity-40"
        >
          {playing
            ? "Playing..."
            : hasPlayed
              ? "Replay animation"
              : "Start animation"}
        </button>
      </div>

      <div key={playKey} className="mt-10 flex flex-col items-center">
        {items.map((item, i) => {
          const boxDelay = i * STEP_TOTAL;
          const connectorDelay = boxDelay + BOX_DURATION;
          const active = playing || hasPlayed;

          return (
            <div
              key={item.year}
              className="flex w-full max-w-lg flex-col items-center"
            >
              <motion.div
                initial={idleStyle}
                animate={active ? activeStyle : idleStyle}
                transition={{
                  duration: BOX_DURATION,
                  delay: boxDelay,
                  ease: "easeOut",
                }}
                className="w-full rounded-xl border-2 bg-[#111214] px-5 py-4"
              >
                <span className="font-mono text-xs text-slate-500">
                  {item.year}
                </span>
                <h3 className="mt-1 text-sm font-medium text-slate-200">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">
                  {item.body}
                </p>
              </motion.div>

              {i < items.length - 1 && (
                <motion.div
                  initial={{ color: "rgba(71,85,105,0.6)" }}
                  animate={{
                    color: active
                      ? "rgba(34,211,238,1)"
                      : "rgba(71,85,105,0.6)",
                  }}
                  transition={{
                    duration: CONNECTOR_DURATION,
                    delay: connectorDelay,
                  }}
                  className="py-2"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 5v13M6 13l6 6 6-6" />
                  </svg>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
