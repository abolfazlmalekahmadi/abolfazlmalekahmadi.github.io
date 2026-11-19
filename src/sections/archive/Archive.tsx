"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import CountUp from "@/components/CountUp";
import { Reveal, SectionHeader } from "@/components/Reveal";
import { otherWork, projects, type Project } from "@/data/projects";
import AgentsVisual from "./AgentsVisual";
import PipelineVisual from "./PipelineVisual";
import SegmentationVisual from "./SegmentationVisual";

const VISUALS: Record<Project["visual"], React.ComponentType<{ project: Project }>> = {
  segmentation: SegmentationVisual,
  pipeline: PipelineVisual,
  agents: AgentsVisual,
};

function CaseStudy({ project, flip }: { project: Project; flip: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bigY = useTransform(scrollYProgress, [0, 1], ["20%", "-30%"]);
  const Visual = VISUALS[project.visual];

  return (
    <article ref={ref} className="relative border-t border-line py-20 md:py-32" aria-labelledby={`p-${project.id}`}>
      {/* Oversized index, drifting on scroll */}
      <motion.div aria-hidden style={{ y: bigY }} className={`pointer-events-none absolute top-10 select-none font-display text-[clamp(8rem,22vw,22rem)] font-semibold leading-none text-ink/[0.03] ${flip ? "left-0" : "right-0"}`}>
        {project.index}
      </motion.div>

      <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className={`lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
          <Reveal className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.2em] text-cyan">PROJECT {project.index}</span>
            <span className="h-px w-8 bg-line" />
            <span className="label !text-[11px]">{project.kicker}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h3 id={`p-${project.id}`} className="display mt-6 text-[clamp(2.6rem,5vw,4.6rem)] text-ink">
              {project.title}
            </h3>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 font-display text-lg leading-snug tracking-tight text-ink/80">{project.fullTitle}</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-mute">
              {project.venue && <span>{project.venue}</span>}
              <span className="text-cyan">{project.role}</span>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 text-[15px] leading-relaxed text-mute">{project.description}</p>
          </Reveal>

          {project.metrics.length > 0 && (
            <Reveal delay={0.2} className={`mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line ${project.metrics.length >= 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}>
              {project.metrics.map((m) => (
                <div key={m.label} className="bg-bg-2/90 p-4">
                  <div className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] font-medium tracking-tight text-ink">
                    <CountUp value={m.value} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} />
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan">{m.label}</div>
                  {m.note && <div className="mt-1 text-[11.5px] leading-tight text-mute">{m.note}</div>}
                </div>
              ))}
            </Reveal>
          )}

          <Reveal delay={0.25}>
            <ul className="mt-8 space-y-2.5">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-[14px] leading-snug text-ink/80">
                  <span className="mt-[8px] h-px w-3 shrink-0 bg-cyan" />
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.3} className="mt-8 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span key={s} className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mute">
                {s}
              </span>
            ))}
          </Reveal>

          {project.links.length > 0 && (
            <Reveal delay={0.35} className="mt-8 flex flex-wrap gap-5">
              {project.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" data-cursor="OPEN" className="group inline-flex items-center gap-2 border-b border-cyan/40 pb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-cyan hover:text-cyan">
                  {l.label}
                  <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </Reveal>
          )}
        </div>

        <Reveal delay={0.1} className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
          <div className="lg:sticky lg:top-28">
            <Visual project={project} />
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">{project.visualNote}</p>
          </div>
        </Reveal>
      </div>
    </article>
  );
}

/** SCENE 04 — The Research Archive. */
export default function Archive() {
  return (
    <section id="projects" className="relative py-28 md:py-40" aria-label="Projects">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <SectionHeader className="md:col-span-9" index="04" label="Research archive" title={["RESEARCH THAT MOVES", <span key="b" className="text-outline">BEYOND THEORY.</span>]} />
          <Reveal className="md:col-span-3" delay={0.2}>
            <p className="text-[15px] leading-relaxed text-mute">Case studies you can interact with — step through each method, drag, and run.</p>
          </Reveal>
        </div>

        <div className="mt-16 md:mt-24">
          {projects.map((p, i) => (
            <CaseStudy key={p.id} project={p} flip={i % 2 === 1} />
          ))}
        </div>

        <div className="border-t border-line pt-16">
          <Reveal className="label mb-8">More work</Reveal>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {otherWork.map((w, i) => {
              const inner = (
                <>
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                    <span>{w.year}</span>
                    {w.href && <ArrowUpRight size={14} className="text-cyan transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
                  </div>
                  <div className="mt-6 font-display text-xl tracking-tight text-ink">{w.title}</div>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-mute">{w.text}</p>
                </>
              );
              return (
                <Reveal key={w.title} delay={(i % 3) * 0.06} className="bg-bg-2/80">
                  {w.href ? (
                    <a href={w.href} target="_blank" rel="noopener noreferrer" className="group block h-full p-6 transition-colors hover:bg-card" data-cursor="CODE">
                      {inner}
                    </a>
                  ) : (
                    <div className="h-full p-6">{inner}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
