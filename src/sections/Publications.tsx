"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Award, BookOpen, FileText } from "lucide-react";
import { useRef } from "react";
import { Reveal, SectionHeader } from "@/components/Reveal";
import { publicationGroups, publications, SELF_AUTHOR, service, type Publication } from "@/data/publications";
import { useIsTouch } from "@/lib/hooks";

const ICONS = { journal: BookOpen, conference: FileText, patent: Award };

function Authors({ p }: { p: Publication }) {
  if (p.authors.length === 0) return <p className="text-[12.5px] leading-relaxed text-mute">{p.authorsNote}</p>;
  return (
    <p className="text-[12.5px] leading-relaxed text-mute">
      {p.authors.map((a, i) => (
        <span key={a}>
          <span className={a === SELF_AUTHOR ? "font-medium text-ink underline decoration-cyan/60 underline-offset-4" : ""}>{a}</span>
          {i < p.authors.length - 1 ? ", " : ""}
        </span>
      ))}
    </p>
  );
}

/** A floating document panel that tilts toward the cursor. */
function DocPanel({ p, i }: { p: Publication; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const touch = useIsTouch();
  const Icon = ICONS[p.kind];

  const onMove = (e: React.PointerEvent) => {
    if (touch || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(1100px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(0)`;
    ref.current.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    ref.current.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "perspective(1100px) rotateY(0) rotateX(0)";
  };

  return (
    <motion.article
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      initial={{ opacity: 0, y: 50, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
      className="panel group relative overflow-hidden rounded-2xl p-6 transition-[transform,border-color] duration-300 ease-out hover:border-cyan/30 md:p-8"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgb(85 223 255 / 0.08), transparent 60%)" }}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg/50 text-cyan">
            <Icon size={15} />
          </span>
          <div className="font-mono text-[10px] uppercase leading-4 tracking-[0.16em] text-mute">
            <div className="text-ink/80">{p.venue}</div>
            {p.publisher && <div>{p.publisher}</div>}
          </div>
        </div>
        {p.year && <span className="font-display text-2xl font-medium tracking-tight text-ink/30">{p.year}</span>}
      </div>

      <h4 className="relative mt-6 font-display text-[clamp(1.2rem,1.8vw,1.5rem)] font-medium leading-snug tracking-tight text-ink">{p.title}</h4>
      <div className="relative mt-3">
        <Authors p={p} />
      </div>
      <div className="relative mt-4 inline-flex rounded-full border border-cyan/30 bg-cyan/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan">{p.role}</div>
      <p className="relative mt-5 border-l border-cyan/30 pl-4 text-[13.5px] leading-relaxed text-mute">{p.contribution}</p>

      {(p.url || p.doi) && (
        <div className="relative mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          {p.url && (
            <a href={p.url} target="_blank" rel="noopener noreferrer" data-cursor="READ" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:text-cyan">
              Read publication <ArrowUpRight size={13} />
            </a>
          )}
          {p.doi && <span className="font-mono text-[10.5px] text-mute">doi:{p.doi}</span>}
        </div>
      )}
    </motion.article>
  );
}

/** SCENE 05 — Publications & academic impact. */
export default function Publications() {
  return (
    <section id="publications" className="relative py-28 md:py-40" aria-label="Publications">
      <div className="container-x">
        <SectionHeader index="05" label="Publications & impact" title={["IDEAS. EXPERIMENTS.", <span key="b" className="text-outline">PUBLICATIONS.</span>]} />

        <div className="mt-16 space-y-20 md:mt-24">
          {publicationGroups.map((g) => {
            const items = publications.filter((p) => p.kind === g.kind);
            if (!items.length) return null;
            return (
              <div key={g.kind} className="grid gap-8 lg:grid-cols-12">
                <Reveal className="lg:col-span-3">
                  <div className="lg:sticky lg:top-32">
                    <div className="label">{g.label}</div>
                    <div className="mt-2 font-display text-5xl font-medium text-ink/20">{String(items.length).padStart(2, "0")}</div>
                  </div>
                </Reveal>
                <div className="grid gap-5 lg:col-span-9 xl:grid-cols-2">
                  {items.map((p, i) => (
                    <DocPanel key={p.id} p={p} i={i} />
                  ))}
                </div>
              </div>
            );
          })}

          <div className="grid gap-8 lg:grid-cols-12">
            <Reveal className="label lg:col-span-3">Peer review</Reveal>
            <Reveal className="lg:col-span-9">
              {service.map((s) => (
                <p key={s} className="font-display text-xl tracking-tight text-ink/80">
                  {s}
                </p>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
