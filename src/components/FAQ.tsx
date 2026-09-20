// USE: Security-focused FAQ / accordion for Home page. Answers common
// questions about how DarkTrace protects its infrastructure and handles
// data. Click a question to expand its answer; only one open at a time.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Is it safe to run a Tor scraper in production?",
    answer:
      "The scraper runs inside an isolated Docker container, routed through a SOCKS5 proxy for Tor connectivity, with an additional VPN layer (Mullvad, NordVPN) wrapping the container's network traffic for a second layer of anonymity.",
  },
  {
    question: "How is the platform protected from DDoS and attacks?",
    answer:
      "Both the Vercel frontend and the AWS EC2 backend sit behind Cloudflare, with an Nginx reverse proxy in front of the backend — filtering malicious traffic before it reaches the application layer.",
  },
  {
    question: "Where is collected data stored?",
    answer:
      "Extracted intelligence (handles, PGP keys, wallet addresses, infrastructure indicators) is structured and stored in a PostgreSQL database running in its own Docker container on the EC2 instance — isolated from the scraper container.",
  },
  {
    question: "What happens if the primary AI model is unavailable?",
    answer:
      "The backend calls Claude Sonnet 5 via AWS Bedrock by default. If that's unavailable, it automatically falls back to Omniroute, running in a local Docker container, so analysis doesn't stop.",
  },
  {
    question: "Does DarkTrace access illegal content?",
    answer:
      "No — collection is limited to publicly accessible dark-web sources for OSINT purposes, in line with standard investigative research practices.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-10 text-center">
        <div className="font-mono text-xs text-accent uppercase tracking-wider mb-2">
          Hardened Operations
        </div>
        <h2 className="font-display text-4xl sm:text-5xl text-fg tracking-tight">
          Security &amp; Infrastructure
        </h2>
        <p className="mt-3 text-xs text-fg-subtle font-mono">
          Scraping isolation, failover routing, and zero-egress data integrity.
        </p>
      </div>

      <div className="mt-10 space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={faq.question}
              className={`rounded-2xl border bg-card shadow-surface transition-colors duration-200 ${isOpen ? "border-accent/40" : "border-line hover:border-line-strong"
                }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left"
              >
                <span className="text-sm font-medium text-fg/90 transition-colors group-hover:text-fg">
                  {faq.question}
                </span>
                <motion.svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-4 w-4 shrink-0 text-accent"
                >
                  <path d="M6 9l6 6 6-6" />
                </motion.svg>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-fg-muted border-t border-line-faint pt-4">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}