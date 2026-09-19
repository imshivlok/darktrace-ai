// USE: Full-screen branded transition shown between search submit and
// landing on the Investigation page. "DarkTrace" reveals letter by letter,
// then the whole overlay fades out. Controlled by App.tsx (mounted only
// while a search is in-flight).

import { motion } from "framer-motion";

const word = "DarkTrace";

export default function SearchTransition() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08090a]"
    >
      <div className="flex text-3xl font-semibold tracking-tight sm:text-4xl">
        {word.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
            className={i < 4 ? "text-slate-100" : "text-cyan-400"}
          >
            {char}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 0.6,
          delay: word.length * 0.06,
          ease: "easeOut",
        }}
        className="mt-4 h-px w-40 origin-left bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
      />
    </motion.div>
  );
}
