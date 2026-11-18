"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Reveal, SectionHeader } from "@/components/Reveal";
import { researchDomains } from "@/data/research";
import { detectLowPower, hasWebGL } from "@/lib/hooks";
import { useExperience } from "@/lib/experience";

const DomainNetwork = dynamic(() => import("@/three/DomainNetwork"), { ssr: false });

/** SCENE 03 — Research domains as a living 3D network. */
export default function Research() {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [gl, setGl] = useState<boolean | null>(null);
  const [lowPower, setLowPower] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const labelEls = useRef<(HTMLDivElement | null)[]>([]);
  const topicEls = useRef<(HTMLDivElement | null)[]>([]);
  const inView = useInView(stage, { margin: "10% 0px" });
  const { scrollTo } = useExperience();

  useEffect(() => {
    setGl(hasWebGL());
    setLowPower(detectLowPower());
  }, []);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const domain = selected !== null ? researchDomains[selected] : null;

  return (
    <section id="research" className="relative py-28 md:py-40" aria-label="Research domains">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <SectionHeader className="md:col-span-8" track="Track 01 · Research" index="03" label="Research domains" title={["WHERE CURIOSITY", <span key="b" className="text-outline">MEETS INTELLIGENCE.</span>]} />
          <Reveal className="md:col-span-4" delay={0.2}>
            <p className="max-w-sm text-[15px] leading-relaxed text-mute">
              Four connected areas, one network. Hover a node to light its connections; select it to travel inside and see what it holds.
            </p>
          </Reveal>
        </div>
      </div>

      <div ref={stage} className="relative mt-12 h-[78svh] min-h-[560px] w-full overflow-hidden md:mt-16" data-cursor={hovered !== null ? "SELECT" : "EXPLORE"}>
        {gl && <DomainNetwork domains={researchDomains} selected={selected} hovered={hovered} onSelect={setSelected} onHover={setHovered} active={inView} lowPower={lowPower} labelEls={labelEls} topicEls={topicEls} />}

        {/* DOM labels, positioned from the 3D scene every frame */}
        {gl && (
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {researchDomains.map((d, i) => (
              <div key={d.id} ref={(el) => void (labelEls.current[i] = el)} className="absolute left-0 top-0 whitespace-nowrap text-center opacity-0 transition-opacity duration-300">
                <div className="font-mono text-[10px] tracking-[0.2em] text-cyan">{d.index}</div>
                <div className={`font-display text-[15px] font-medium tracking-tight transition-colors ${selected === i || hovered === i ? "text-ink" : "text-ink/70"}`}>{d.title}</div>
              </div>
            ))}
            {(domain?.topics ?? []).map((t, j) => (
              <div key={t} ref={(el) => void (topicEls.current[j] = el)} className="absolute left-0 top-0 opacity-0 transition-opacity duration-500">
                <span className="whitespace-nowrap rounded-full border border-cyan/30 bg-bg/80 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-cyan backdrop-blur">{t}</span>
              </div>
            ))}
          </div>
        )}

        {/* Accessible domain switcher (also the mobile control) */}
        <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center px-4">
          <div role="tablist" aria-label="Research domains" className="no-scrollbar flex max-w-full gap-1.5 overflow-x-auto rounded-full border border-line bg-bg/70 p-1.5 backdrop-blur-xl">
            {researchDomains.map((d, i) => (
              <button
                key={d.id}
                role="tab"
                aria-selected={selected === i}
                aria-controls="domain-panel"
                onClick={() => setSelected(selected === i ? null : i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`shrink-0 rounded-full px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors md:px-4 ${
                  selected === i ? "bg-cyan text-bg" : "text-mute hover:text-ink"
                }`}
              >
                <span className="mr-1.5 opacity-60">{d.index}</span>
                {d.title}
              </button>
            ))}
          </div>
        </div>

        {/* Info panel */}
        <AnimatePresence>
          {domain && (
            <motion.div
              id="domain-panel"
              role="tabpanel"
              key={domain.id}
              className="panel absolute z-20 overflow-y-auto rounded-2xl p-6 md:p-8 max-md:inset-x-3 max-md:bottom-20 max-md:max-h-[58%] md:right-[max(var(--gutter),2rem)] md:top-1/2 md:w-[min(440px,40vw)] md:-translate-y-1/2"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[11px] tracking-[0.2em] text-cyan">DOMAIN {domain.index}</div>
                  <h3 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink">{domain.title}</h3>
                </div>
                <button type="button" onClick={() => setSelected(null)} aria-label="Close domain" className="rounded-full border border-line p-2 text-mute transition-colors hover:text-ink">
                  <X size={14} />
                </button>
              </div>
              <p className="mt-4 text-[14.5px] leading-relaxed text-mute">{domain.summary}</p>

              <div className="label mt-7 !text-[10px]">Research interests</div>
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {domain.topics.map((t, i) => (
                  <motion.li
                    key={t}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.06 }}
                    className="rounded-lg border border-line bg-bg/40 px-3 py-2.5 text-[13px] text-ink/90"
                  >
                    {t}
                  </motion.li>
                ))}
              </ul>

              <div className="label mt-7 !text-[10px]">In my work</div>
              <ul className="mt-3 space-y-2.5">
                {domain.evidence.map((e, i) => (
                  <motion.li key={e} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.07 }} className="flex gap-3 text-[13.5px] leading-snug text-ink/85">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-cyan" />
                    {e}
                  </motion.li>
                ))}
              </ul>

              <button type="button" onClick={() => scrollTo("#projects")} className="mt-7 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-cyan hover:text-ink">
                See case studies <ArrowUpRight size={13} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No-WebGL fallback: a plain list keeps every domain reachable. */}
        {gl === false && (
          <div className="container-x grid h-full content-center gap-4 sm:grid-cols-2">
            {researchDomains.map((d, i) => (
              <button key={d.id} type="button" onClick={() => setSelected(i)} className="panel rounded-2xl p-6 text-left">
                <div className="font-mono text-[11px] text-cyan">{d.index}</div>
                <div className="mt-1 font-display text-2xl text-ink">{d.title}</div>
              </button>
            ))}
          </div>
        )}

        {selected === null && (
          <div className="pointer-events-none absolute left-[var(--gutter)] top-6 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-mute md:block">
            <span className="text-cyan">●</span> Interactive · click a node
          </div>
        )}
      </div>
    </section>
  );
}
