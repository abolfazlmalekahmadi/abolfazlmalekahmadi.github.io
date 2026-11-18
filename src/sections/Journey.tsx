"use client";

import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { SectionHeader } from "@/components/Reveal";
import { timeline, type Milestone } from "@/data/timeline";

function Item({ m, i }: { m: Milestone; i: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const active = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const seen = useInView(ref, { once: true, margin: "-20% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yearY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const cardY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const left = i % 2 === 0;

  return (
    <li ref={ref} className="relative grid grid-cols-[28px_1fr] gap-5 py-10 md:grid-cols-[1fr_56px_1fr] md:gap-0 md:py-16">
      {/* Year (parallax layer) */}
      <motion.div style={{ y: yearY }} className={`hidden md:flex md:items-center ${left ? "md:order-1 md:justify-end md:pr-12" : "md:order-3 md:pl-12"}`}>
        <span className={`font-display text-[clamp(4rem,8vw,7.5rem)] font-semibold leading-none tracking-tighter transition-colors duration-700 ${active ? "text-ink" : "text-ink/10"}`}>{m.year}</span>
      </motion.div>

      {/* Node */}
      <div className="relative flex justify-center md:order-2">
        <div className="sticky top-1/2 mt-2 md:mt-0 md:flex md:items-center">
          <span className={`relative block h-3.5 w-3.5 rounded-full border transition-all duration-700 ${active ? "border-cyan bg-cyan shadow-[0_0_18px_4px_rgb(85_223_255/0.55)]" : "border-mute/50 bg-bg"}`}>
            {active && <span className="absolute inset-[-6px] animate-ping rounded-full border border-cyan/50" />}
          </span>
        </div>
      </div>

      {/* Card */}
      <motion.div style={{ y: cardY }} className={left ? "md:order-3 md:pl-12" : "md:order-1 md:pr-12"}>
        <motion.div
          initial={{ opacity: 0, x: left ? 40 : -40 }}
          animate={seen ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={`panel rounded-2xl p-6 transition-colors duration-700 md:p-7 ${active ? "!border-cyan/30" : ""}`}
        >
          <div className="font-display text-4xl font-semibold tracking-tighter text-ink md:hidden">{m.year}</div>
          <h3 className="font-display text-2xl font-medium tracking-tight text-ink max-md:mt-2">{m.title}</h3>
          <p className="mt-3 text-[14px] leading-relaxed text-mute">{m.text}</p>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4">
            <div className="flex flex-wrap gap-1.5">
              {m.tags.map((t) => (
                <span key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-mute">
                  {t}
                </span>
              ))}
            </div>
            <div className="text-right">
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-mute">{m.artifact.label}</div>
              <div className={`font-display text-xl tracking-tight transition-colors duration-700 ${active ? "text-cyan" : "text-ink/70"}`}>{m.artifact.value}</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </li>
  );
}

/** SCENE 06 — Research journey. */
export default function Journey() {
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 60%", "end 50%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 28 });

  return (
    <section id="journey" className="relative overflow-x-clip py-28 md:py-40" aria-label="Research journey">
      <div className="container-x">
        <SectionHeader index="07" label="The journey" title={["A JOURNEY OF", <span key="b" className="text-outline">CONTINUOUS DISCOVERY.</span>]} />

        <div className="relative mt-16 md:mt-24">
          {/* Path */}
          <div aria-hidden className="absolute bottom-0 left-[13px] top-0 w-px bg-line md:left-1/2 md:-translate-x-1/2">
            <motion.div className="absolute inset-0 origin-top bg-gradient-to-b from-cyan via-accent to-cyan shadow-[0_0_12px_rgb(85_223_255/0.6)]" style={{ scaleY: fill }} />
          </div>
          <ol ref={list} className="relative">
            {timeline.map((m, i) => (
              <Item key={m.year + m.title} m={m} i={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
