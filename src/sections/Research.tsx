"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, MousePointerClick, X } from "lucide-react";
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
  const ringEls = useRef<(HTMLDivElement | null)[]>([]);
  /** Guide lights stay on until the visitor opens a domain once. */
  const [explored, setExplored] = useState(false);
  const select = (i: number | null) => {
    setSelected(i);
    if (i === null) return;
    setExplored(true);
    // Make sure the whole stage (and so the panel header) is clear of the fixed nav.
    const r = stage.current?.getBoundingClientRect();
    if (r && (r.top < 72 || r.top > window.innerHeight * 0.35)) scrollTo("#research-network");
  };
  const inView = useInView(stage, { margin: "10% 0px" });
  const { scrollTo } = useExperience();

  useEffect(() => {
    setGl(hasWebGL());
    setLowPower(detectLowPower());
  }, []);

  // Keep the chosen tab visible in the scrollable tab bar (mobile).
  useEffect(() => {
    if (selected === null) return;
    const tab = document.querySelectorAll<HTMLElement>("#research [role=tab]")[selected];
    const bar = tab?.parentElement;
    if (tab && bar) bar.scrollTo({ left: tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
  }, [selected]);

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

      <div id="research-network" ref={stage} className="relative mt-12 h-[78svh] scroll-mt-20 min-h-[560px] w-full overflow-hidden md:mt-16 md:min-h-[600px]" data-cursor={hovered !== null ? "SELECT" : "EXPLORE"}>
        {gl && <DomainNetwork domains={researchDomains} selected={selected} hovered={hovered} onSelect={select} onHover={setHovered} active={inView} lowPower={lowPower} labelEls={labelEls} topicEls={topicEls} ringEls={ringEls} />}

        {/* DOM labels, positioned from the 3D scene every frame */}
        {gl && (
          <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-500 ${selected !== null ? "max-md:opacity-0" : ""}`}>
            {/* Guide beacons on each node until the first click */}
            {researchDomains.map((d, i) => (
              <div key={`ring-${d.id}`} ref={(el) => void (ringEls.current[i] = el)} className="absolute left-0 top-0 opacity-0 transition-opacity duration-300">
                <div className={`relative h-0 w-0 transition-opacity duration-700 ${!explored && selected === null ? "opacity-100" : hovered === i && selected === null ? "opacity-60" : "opacity-0"}`}>
                  <span className="beacon" style={{ animationDelay: `${i * 0.45}s` }} />
                  <span className="beacon" style={{ animationDelay: `${i * 0.45 + 1.1}s` }} />
                  {i === 0 && !explored && selected === null && (
                    <div className="absolute left-12 top-0 flex -translate-y-1/2 items-center">
                      <span className="h-px w-8 bg-gradient-to-r from-cyan/0 to-cyan" />
                      <span className="nudge flex items-center gap-2 whitespace-nowrap rounded-full border border-cyan/60 bg-bg/85 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink shadow-[0_0_24px_rgb(85_223_255/0.35)] backdrop-blur">
                        <MousePointerClick size={14} className="text-cyan" />
                        <span className="md:hidden">Tap a node</span>
                        <span className="hidden md:inline">Click a node to explore</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {researchDomains.map((d, i) => (
              <div key={d.id} ref={(el) => void (labelEls.current[i] = el)} className="absolute left-0 top-0 whitespace-nowrap text-center opacity-0 transition-opacity duration-300">
                <div className="font-mono text-[10px] tracking-[0.2em] text-cyan">{d.index}</div>
                <div className={`font-display text-[15px] font-medium tracking-tight transition-colors ${selected === i || hovered === i ? "text-ink" : "text-ink/85"}`}>{d.title}</div>
              </div>
            ))}
            {(domain?.topics ?? []).map((t, j) => (
              <div key={t} ref={(el) => void (topicEls.current[j] = el)} className="absolute left-0 top-0 opacity-0 transition-opacity duration-500 max-md:hidden">
                <span className="whitespace-nowrap rounded-full border border-cyan/30 bg-bg/80 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-cyan backdrop-blur">{t}</span>
              </div>
            ))}
          </div>
        )}

        {/* Accessible domain switcher (also the mobile control) */}
        <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center px-4">
          <div role="tablist" aria-label="Research domains" className={`no-scrollbar flex max-w-full gap-1.5 overflow-x-auto rounded-full border bg-bg/80 p-1.5 backdrop-blur-xl ${explored ? "border-line" : "glow-pulse border-cyan/40"}`}>
            {researchDomains.map((d, i) => (
              <button
                key={d.id}
                role="tab"
                aria-selected={selected === i}
                aria-controls="domain-panel"
                onClick={() => select(selected === i ? null : i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`shrink-0 rounded-full px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors md:px-4 ${
                  selected === i ? "bg-cyan text-bg" : "text-ink/80 hover:bg-cyan/10 hover:text-ink"
                }`}
              >
                <span className="mr-1.5 text-cyan/90">{d.index}</span>
                {d.title}
              </button>
            ))}
          </div>
        </div>

        {/* Info panel: fixed header + scrollable body + fixed footer, always inside the stage */}
        <AnimatePresence>
          {domain && selected !== null && (
            <motion.div
              id="domain-panel"
              role="tabpanel"
              aria-label={domain.title}
              key={domain.id}
              className="panel absolute z-20 flex flex-col overflow-hidden rounded-2xl shadow-[0_30px_80px_rgb(0_0_0/0.45)] max-md:inset-x-3 max-md:bottom-[5.25rem] max-md:top-3 md:right-[max(var(--gutter),2rem)] md:top-6 md:max-h-[calc(100%-7.25rem)] md:w-[min(460px,40vw)]"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* header */}
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-6 pb-4 pt-5 md:px-7">
                <div>
                  <div className="font-mono text-[11px] tracking-[0.2em] text-cyan">
                    DOMAIN {domain.index} <span className="text-mute">/ 0{researchDomains.length}</span>
                  </div>
                  <h3 className="mt-1.5 font-display text-[clamp(1.5rem,2.2vw,1.9rem)] font-medium leading-tight tracking-tight text-ink">{domain.title}</h3>
                </div>
                <button type="button" onClick={() => setSelected(null)} aria-label="Close domain" className="mt-1 shrink-0 rounded-full border border-line p-2 text-mute transition-colors hover:border-cyan/50 hover:text-ink">
                  <X size={14} />
                </button>
              </div>

              {/* body */}
              <div className="relative flex min-h-0 flex-1 flex-col">
                <div data-lenis-prevent className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5 md:px-7">
                  <p className="text-[14.5px] leading-relaxed text-mute">{domain.summary}</p>

                  <div className="label mt-6 !text-[11px]">Research interests</div>
                  <ul className="mt-3 grid grid-cols-2 gap-2">
                    {domain.topics.map((t, i) => (
                      <motion.li
                        key={t}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + i * 0.05 }}
                        className="rounded-lg border border-line bg-bg/40 px-3 py-2.5 text-[13px] leading-snug text-ink/90"
                      >
                        {t}
                      </motion.li>
                    ))}
                  </ul>

                  <div className="label mt-6 !text-[11px]">In my work</div>
                  <ul className="mt-3 space-y-2.5 pb-4">
                    {domain.evidence.map((e, i) => (
                      <motion.li key={e} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.06 }} className="flex gap-3 text-[13.5px] leading-snug text-ink/85">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-cyan" />
                        {e}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                {/* fade hints that the body scrolls */}
                <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#0c1624] to-transparent" />
              </div>

              {/* footer */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-line px-6 py-3.5 md:px-7">
                <button type="button" onClick={() => scrollTo("#projects")} className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-cyan transition-colors hover:text-ink">
                  Case studies <ArrowUpRight size={13} />
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => select((selected + researchDomains.length - 1) % researchDomains.length)}
                    aria-label="Previous domain"
                    className="rounded-full border border-line p-2 text-mute transition-colors hover:border-cyan/50 hover:text-cyan"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => select((selected + 1) % researchDomains.length)}
                    aria-label="Next domain"
                    className="rounded-full border border-line p-2 text-mute transition-colors hover:border-cyan/50 hover:text-cyan"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No-WebGL fallback: a plain list keeps every domain reachable. */}
        {gl === false && (
          <div className="container-x grid h-full content-center gap-4 sm:grid-cols-2">
            {researchDomains.map((d, i) => (
              <button key={d.id} type="button" onClick={() => select(i)} className="panel rounded-2xl p-6 text-left">
                <div className="font-mono text-[11px] text-cyan">{d.index}</div>
                <div className="mt-1 font-display text-2xl text-ink">{d.title}</div>
              </button>
            ))}
          </div>
        )}

        {selected === null && (
          <div className="pointer-events-none absolute left-[var(--gutter)] top-20 z-10 flex items-center md:top-24 gap-2.5 rounded-full border border-cyan/30 bg-bg/70 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/90 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-cyan/70" />
              <span className="relative h-2 w-2 rounded-full bg-cyan" />
            </span>
            Interactive <span className="text-mute">·</span> <span className="text-cyan md:hidden">tap any node</span><span className="hidden text-cyan md:inline">click any node or a tab below</span>
          </div>
        )}
      </div>

      {/* At-a-glance summary: everything readable without clicking */}
      <div className="container-x mt-6">
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {researchDomains.map((d, i) => (
            <li key={d.id} className="bg-bg-2/85">
              <button
                type="button"
                onClick={() => {
                  select(i);
                  scrollTo("#research-network");
                }}
                data-cursor="OPEN"
                className={`group flex h-full w-full flex-col p-5 text-left transition-colors duration-500 hover:bg-card md:p-6 ${selected === i ? "bg-card" : ""}`}
              >
                <span className="flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-cyan">{d.index}</span>
                  <ArrowUpRight size={15} className="text-mute transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan" />
                </span>
                <span className="mt-3 font-display text-xl tracking-tight text-ink">{d.title}</span>
                <span className="mt-2 text-[13px] leading-relaxed text-mute">{d.summary}</span>
                <span className="mt-4 flex flex-wrap gap-1.5">
                  {d.topics.map((t) => (
                    <span key={t} className="rounded-full border border-line px-2.5 py-1 text-[11.5px] text-ink/80">
                      {t}
                    </span>
                  ))}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
