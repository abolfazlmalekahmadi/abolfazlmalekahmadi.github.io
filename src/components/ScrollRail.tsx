"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { sections } from "@/data/sections";
import { useExperience } from "@/lib/experience";
import { useActiveSection } from "./useActiveSection";

/** Minimal vertical progress indicator with section numbers and names. */
export default function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const active = useActiveSection();
  const { scrollTo, introDone } = useExperience();
  const idx = sections.findIndex((s) => s.id === active);

  return (
    <motion.aside
      aria-label="Section progress"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 items-center gap-4 lg:flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: introDone ? 1 : 0 }}
      transition={{ duration: 1, delay: 1 }}
    >
      <div className="hidden text-right 2xl:block">
        <motion.div key={active} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          {sections[idx]?.label}
        </motion.div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] text-cyan">{String(idx + 1).padStart(2, "0")}</span>
        <div className="relative h-40 w-px bg-line">
          <motion.div className="absolute inset-x-0 top-0 h-full origin-top bg-cyan" style={{ scaleY }} />
        </div>
        <ol className="flex flex-col gap-1.5">
          {sections.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => scrollTo(`#${s.id}`)}
                aria-label={`Go to ${s.label}`}
                className="group flex h-3 w-3 items-center justify-center"
              >
                <span className={`block rounded-full transition-all duration-500 ${i === idx ? "h-1.5 w-1.5 bg-cyan shadow-[0_0_8px_#55dfff]" : "h-1 w-1 bg-mute/50 group-hover:bg-ink"}`} />
              </button>
            </li>
          ))}
        </ol>
        <span className="font-mono text-[10px] text-mute">{String(sections.length).padStart(2, "0")}</span>
      </div>
    </motion.aside>
  );
}
