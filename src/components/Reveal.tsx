"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/** Fades/slides content in when it scrolls into view. */
export function Reveal({ children, delay = 0, y = 28, className, as = "div" }: { children: ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "li" | "article" }) {
  const C = motion[as];
  return (
    <C
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </C>
  );
}

const line: Variants = {
  hidden: { y: "110%" },
  show: (i: number) => ({ y: "0%", transition: { duration: 1.1, ease, delay: i * 0.09 } }),
};

/** Masked line-by-line heading reveal. Pass lines as an array. */
export function MaskHeading({ lines, className, lineClassName, as = "h2", show }: { lines: ReactNode[]; className?: string; lineClassName?: string; as?: "h1" | "h2" | "h3"; show?: boolean }) {
  const H = motion[as];
  const controlled = show !== undefined;
  return (
    <H
      className={className}
      initial="hidden"
      {...(controlled ? { animate: show ? "show" : "hidden" } : { whileInView: "show", viewport: { once: true, margin: "-10% 0px" } })}
    >
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span className={`block ${lineClassName ?? ""}`} variants={line} custom={i}>
            {l}
          </motion.span>
        </span>
      ))}
    </H>
  );
}

/** Staggered word reveal for paragraphs. */
export function WordReveal({ text, className, show, delay = 0 }: { text: string; className?: string; show?: boolean; delay?: number }) {
  const words = text.split(" ");
  const controlled = show !== undefined;
  return (
    <motion.p
      className={className}
      initial="hidden"
      {...(controlled ? { animate: show ? "show" : "hidden" } : { whileInView: "show", viewport: { once: true, margin: "-10% 0px" } })}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.025, delayChildren: delay } } }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: "100%", opacity: 0 }, show: { y: "0%", opacity: 1, transition: { duration: 0.8, ease } } }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.p>
  );
}

/** Section header: number, label and a large masked title. */
export function SectionHeader({ index, label, title, className, track }: { index: string; label: string; title: ReactNode[]; className?: string; track?: string }) {
  return (
    <div className={className}>
      <Reveal className="mb-8 flex flex-wrap items-center gap-4">
        {track && <span className="rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan">{track}</span>}
        <span className="font-mono text-[11px] tracking-[0.2em] text-cyan">{index}</span>
        <span className="h-px w-12 bg-cyan/40" />
        <span className="label">{label}</span>
      </Reveal>
      <MaskHeading lines={title} className="display text-[clamp(2.4rem,6.4vw,6.2rem)] text-ink" />
    </div>
  );
}
