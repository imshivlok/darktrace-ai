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
      <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
        Security &amp; <span className="text-cyan-400">Infrastructure</span>
      </h2>
      <p className="mx-auto mt-3 max-w-md text-center text-sm text-slate-400">
        How DarkTrace protects its scraping, storage, and analysis pipeline.
      </p>

      <div className="mt-10 space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={faq.question}
              className={`rounded-xl border bg-[#111214]/70 transition-colors duration-200 ${
                isOpen ? "border-cyan-500/40" : "border-slate-700/50"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm font-medium text-slate-200">
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
                  className="h-4 w-4 shrink-0 text-slate-500"
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
                    <p className="px-5 pb-4 text-sm leading-relaxed text-slate-400">
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
