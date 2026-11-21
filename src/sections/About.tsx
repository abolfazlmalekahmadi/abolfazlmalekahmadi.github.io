"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal, SectionHeader } from "@/components/Reveal";
import { certifications, currentInterests, education, honors, languages } from "@/data/experience";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";

function Portrait() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const initials = `${site.name.first[0]}${site.name.last[0]}`;

  return (
    <div ref={ref} className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line bg-bg-2">
      <motion.div style={{ y }} className="absolute inset-[-8%]">
        {site.portrait ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset(site.portrait)} alt={`Portrait of ${site.name.first} ${site.name.last}`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(60%_50%_at_50%_45%,#0f2a44,#0b1422_60%,#05080d)]">
            <svg viewBox="0 0 200 200" className="absolute h-[80%] w-[80%] opacity-40" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <circle key={i} cx="100" cy="100" r={30 + i * 16} fill="none" stroke="#159BCE" strokeOpacity={0.5 - i * 0.08} strokeDasharray={i % 2 ? "2 6" : undefined} />
              ))}
            </svg>
            <span className="relative font-display text-[clamp(5rem,12vw,9rem)] font-semibold tracking-tighter text-ink/90">{initials}</span>
          </div>
        )}
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-bg/90 to-transparent p-5">
        <div>
          <div className="font-display text-lg tracking-tight text-ink">
            {site.name.first} {site.name.last}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">{site.location}</div>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan">{site.role}</span>
      </div>
    </div>
  );
}

/** SCENE 07 — Beyond research. Calm on purpose. */
export default function About() {
  return (
    <section id="about" className="relative py-28 md:py-40" aria-label="About">
      <div className="container-x">
        <SectionHeader index="08" label="Beyond research" title={["BEHIND EVERY MODEL,", <span key="b" className="text-outline">THERE IS A QUESTION.</span>]} />

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Portrait />
            </div>
          </Reveal>

          <div className="space-y-16 lg:col-span-8">
            <Reveal>
              <p className="font-display text-[clamp(1.35rem,2.2vw,1.85rem)] leading-snug tracking-tight text-ink">{site.about}</p>
            </Reveal>

            <div className="grid gap-12 md:grid-cols-2">
              <Reveal>
                <div className="label mb-5">Academic background</div>
                <ul className="space-y-5">
                  {education.map((e) => (
                    <li key={e.degree}>
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan">{e.period}</div>
                      <div className="mt-1 font-display text-lg tracking-tight text-ink">{e.degree}</div>
                      <div className="text-[13.5px] text-mute">{e.org}</div>
                      {e.detail && <div className="mt-1 text-[12.5px] text-mute">{e.detail}</div>}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="label mb-5">Current interests</div>
                <ul className="space-y-3">
                  {currentInterests.map((c) => (
                    <li key={c} className="flex gap-3 text-[14px] leading-snug text-ink/85">
                      <span className="mt-[8px] h-px w-3 shrink-0 bg-cyan" />
                      {c}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="grid gap-12 md:grid-cols-2">
              <Reveal>
                <div className="label mb-5">Honors</div>
                <ul className="space-y-3">
                  {honors.map((h) => (
                    <li key={h} className="flex gap-3 text-[14px] leading-snug text-ink/85">
                      <span className="mt-[8px] h-px w-3 shrink-0 bg-cyan" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="label mb-4 mt-10">Languages</div>
                <ul className="space-y-2">
                  {languages.map((l) => (
                    <li key={l.name} className="flex items-baseline justify-between gap-4 border-b border-line pb-2 text-[14px]">
                      <span className="font-display tracking-tight text-ink">{l.name}</span>
                      <span className="text-[12.5px] text-mute">{l.level}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="label mb-5">Certifications</div>
                <ul className="space-y-3">
                  {certifications.map((c) => (
                    <li key={c} className="text-[13.5px] leading-snug text-mute">
                      {c}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
