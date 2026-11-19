"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, FileText } from "lucide-react";
import { useRef } from "react";
import { MaskHeading, WordReveal } from "@/components/Reveal";
import { site } from "@/data/site";
import { useExperience } from "@/lib/experience";
import { asset } from "@/lib/asset";
import { sceneState } from "@/lib/sceneStore";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.16, 1, 0.3, 1] as const;

/** SCENE 01 — The Identity. */
export default function Hero() {
  const { introDone, scrollTo } = useExperience();
  const show = introDone === true;
  const root = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);

  // As scrolling starts: core moves to centre and expands; copy lifts away.
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.8 },
      });
      tl.to(sceneState, { heroShift: 1, ease: "none" }, 0).to(content.current, { y: -120, opacity: 0, ease: "none" }, 0);
    },
    { scope: root },
  );

  return (
    <section id="identity" ref={root} className="relative flex min-h-[100svh] items-center" aria-label="Introduction">
      <div ref={content} className="container-x relative z-10 grid w-full items-center pt-24 pb-20 md:grid-cols-12">
        <div className="md:col-span-8 lg:col-span-7 max-md:pt-[42vh]">
          {site.phd.open && (
            <motion.button
              type="button"
              onClick={() => scrollTo("#phd")}
              data-cursor="PHD"
              className="group mb-7 inline-flex items-center gap-3 rounded-full border border-cyan/35 bg-cyan/[0.07] py-1.5 pl-2 pr-4 backdrop-blur-md transition-colors hover:border-cyan/70 hover:bg-cyan/15"
              initial={{ opacity: 0, y: -10 }}
              animate={show ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease, delay: 0.05 }}
            >
              <span className="flex items-center gap-2 rounded-full bg-cyan px-2.5 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-bg">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-bg/60" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-bg" />
                </span>
                Now
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/90">
                {site.phd.badge}
                {site.phd.start ? ` · ${site.phd.start}` : ""}
              </span>
              <ArrowRight size={13} className="text-cyan transition-transform duration-500 group-hover:translate-x-1" />
            </motion.button>
          )}

          <motion.div
            className="mb-7 flex items-center gap-3"
            initial={{ opacity: 0, x: -12 }}
            animate={show ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease, delay: 0.2 }}
          >
            <span className="h-px w-8 bg-cyan" />
            <span className="label !text-[11px] md:!text-[11px]">{site.eyebrow}</span>
          </motion.div>

          <MaskHeading
            as="h1"
            show={show}
            className="display text-[clamp(2.6rem,6.9vw,7.4rem)] text-ink"
            lines={[
              site.name.first.toUpperCase(),
              <>
                {site.name.last.toUpperCase()}
                <span className="text-cyan">.</span>
              </>,
            ]}
          />

          <motion.p
            className="mt-7 font-display text-[clamp(1.15rem,2vw,1.6rem)] font-light tracking-tight text-ink/90"
            initial={{ opacity: 0, y: 14 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease, delay: 0.55 }}
          >
            {site.headline}
          </motion.p>

          <WordReveal show={show} delay={0.7} text={site.intro} className="mt-4 max-w-xl text-[15px] leading-relaxed text-mute md:text-base" />

          {/* Two tracks: the page splits from here */}
          <motion.div
            className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-2"
            initial="hidden"
            animate={show ? "show" : "hidden"}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 1.05 } } }}
          >
            {site.tracks.map((t) => (
              <motion.button
                key={t.target}
                type="button"
                onClick={() => scrollTo(`#${t.target}`)}
                data-cursor={t.label.toUpperCase()}
                variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }}
                className="group relative overflow-hidden rounded-2xl border border-line bg-bg-2/55 p-5 text-left backdrop-blur-md transition-colors duration-500 hover:border-cyan/50"
              >
                <span aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgb(85_223_255/0.14),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan">
                    {t.index} · {t.label}
                  </span>
                  <ArrowRight size={15} className="text-mute transition-all duration-500 group-hover:translate-x-1 group-hover:text-cyan" />
                </span>
                <span className="relative mt-3 block font-display text-[17px] leading-snug tracking-tight text-ink">{t.title}</span>
                <span className="relative mt-3 flex flex-col gap-1">
                  {t.points.map((p) => (
                    <span key={p} className="flex items-center gap-2 text-[12.5px] text-mute transition-colors group-hover:text-ink/75">
                      <span className="h-px w-2.5 bg-cyan/60" />
                      {p}
                    </span>
                  ))}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {site.cv && (
            <motion.div className="mt-6" initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 1.5 }}>
              <a
                href={asset(site.cv)}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="OPEN"
                className="inline-flex items-center gap-2 border-b border-line pb-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink/80 transition-colors hover:border-cyan hover:text-cyan"
              >
                <FileText size={13} /> View full CV
              </a>
            </motion.div>
          )}
        </div>
      </div>

      <motion.button
        type="button"
        onClick={() => scrollTo("#mind")}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : {}}
        transition={{ delay: 2 }}
        aria-label="Scroll to continue"
      >
        <span className="label !text-[11px]">Scroll to enter the mind</span>
        <span className="flex h-10 w-6 justify-center rounded-full border border-line pt-2">
          <motion.span animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <ArrowDown size={12} className="text-cyan" />
          </motion.span>
        </span>
      </motion.button>

      {/* Side caption, desktop only */}
      <motion.div
        className="absolute right-[6vw] bottom-[18vh] z-10 hidden max-w-[220px] text-right xl:block"
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : {}}
        transition={{ delay: 1.8, duration: 1.2 }}
      >
        <div className="label mb-3 !text-[11px] text-cyan">Neural core · live</div>
        <p className="font-mono text-[10.5px] leading-5 tracking-[0.12em] text-mute">MOVE YOUR CURSOR TO DISTURB THE NETWORK</p>
        <div className="ml-auto mt-4 h-px w-24 bg-gradient-to-l from-cyan to-transparent" />
      </motion.div>
    </section>
  );
}
