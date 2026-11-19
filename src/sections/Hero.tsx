"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, FileText, Mail } from "lucide-react";
import Magnetic from "@/components/Magnetic";
import { GitHubIcon, LinkedInIcon, ScholarIcon } from "@/components/icons";
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
    <section id="identity" ref={root} className="relative" aria-label="Introduction">
      <div ref={content} className="container-x relative z-10 flex min-h-[100svh] w-full flex-col pt-[5.25rem] pb-4">
        <div className="grid flex-1 items-center md:grid-cols-12">
        <div className="md:col-span-8 lg:col-span-7 max-md:pt-[42vh]">
          {site.phd.open && (
            <motion.button
              type="button"
              onClick={() => scrollTo("#phd")}
              data-cursor="PHD"
              className="group mb-5 inline-flex items-center gap-3 rounded-full border border-cyan/35 bg-cyan/[0.07] py-1.5 pl-2 pr-4 backdrop-blur-md transition-colors hover:border-cyan/70 hover:bg-cyan/15"
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
            className="mb-4 flex items-center gap-3 [@media(max-height:800px)_and_(min-width:768px)]:hidden"
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
            className="display text-[clamp(2.6rem,6.1vw,6.6rem)] text-ink"
            lines={[
              site.name.first.toUpperCase(),
              <>
                {site.name.last.toUpperCase()}
                <span className="text-cyan">.</span>
              </>,
            ]}
          />

          <motion.p
            className="mt-5 font-display text-[clamp(1.15rem,1.9vw,1.55rem)] font-light tracking-tight text-ink/90"
            initial={{ opacity: 0, y: 14 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease, delay: 0.55 }}
          >
            {site.headline}
          </motion.p>

          <WordReveal show={show} delay={0.7} text={site.intro} className="mt-3 max-w-2xl text-[15px] leading-relaxed text-mute" />

          {/* Two tracks: the page splits from here */}
          <motion.div
            className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-2"
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
                <span className="relative mt-3 flex flex-col gap-1 [@media(max-height:860px)_and_(min-width:768px)]:hidden">
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

          {/* Primary actions: CV + profiles */}
          <motion.div
            className="mt-5 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease, delay: 1.35 }}
          >
            {site.cv && (
              <Magnetic>
                <a
                  href={asset(site.cv)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="CV"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-bg shadow-[0_0_30px_rgb(85_223_255/0.25)]"
                >
                  <span className="absolute inset-0 -translate-x-[101%] bg-cyan transition-transform duration-500 ease-out-expo group-hover:translate-x-0" />
                  <FileText size={15} className="relative" />
                  <span className="relative">View CV</span>
                  <span className="relative rounded-full bg-bg/10 px-2 py-0.5 text-[9.5px] tracking-[0.12em]">PDF</span>
                </a>
              </Magnetic>
            )}
            {[
              site.social.scholar && { label: "Google Scholar", href: site.social.scholar, icon: <ScholarIcon size={17} /> },
              site.social.github && { label: "GitHub", href: site.social.github, icon: <GitHubIcon size={17} /> },
              site.social.linkedin && { label: "LinkedIn", href: site.social.linkedin, icon: <LinkedInIcon size={16} /> },
              site.contact.email && { label: "Email", href: `mailto:${site.contact.email}`, icon: <Mail size={16} /> },
            ]
              .filter((x): x is { label: string; href: string; icon: React.ReactElement } => !!x)
              .map((l) => (
                <Magnetic key={l.label}>
                  <a
                    href={l.href}
                    {...(l.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                    aria-label={l.label}
                    title={l.label}
                    data-cursor={l.label.split(" ").pop()?.toUpperCase()}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-bg-2/60 text-ink/85 backdrop-blur-md transition-all duration-300 hover:border-cyan/60 hover:bg-cyan/10 hover:text-cyan hover:shadow-[0_0_18px_rgb(85_223_255/0.3)]"
                  >
                    {l.icon}
                  </a>
                </Magnetic>
              ))}
          </motion.div>
        </div>
        </div>

        {/* Credibility strip: the proof, visible on the first screen */}
        <motion.ul
          aria-label="Highlights"
          className="mt-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-bg/45 backdrop-blur-md lg:grid-cols-4"
          initial="hidden"
          animate={show ? "show" : "hidden"}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 1.5 } } }}
        >
          {site.credentials.map((c, i) => {
            const internal = c.href.startsWith("#");
            return (
              <motion.li
                key={c.value + c.label}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}
                className={`border-line ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
              >
                <a
                  href={c.href}
                  onClick={(e) => {
                    if (!internal) return;
                    e.preventDefault();
                    scrollTo(c.href);
                  }}
                  {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  data-cursor={internal ? "VIEW" : "SOURCE"}
                  className="group relative flex h-full flex-col justify-between gap-2 p-4 transition-colors duration-500 hover:bg-cyan/[0.07] md:px-5 md:py-4"
                >
                  <span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-cyan shadow-[0_0_10px_#55dfff] transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
                  <span className="flex items-start justify-between gap-2">
                    <span className="font-display text-[clamp(1.25rem,2.1vw,1.9rem)] font-medium leading-none tracking-tight text-ink">{c.value}</span>
                    <ArrowUpRight size={15} className="mt-0.5 shrink-0 text-mute transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan" />
                  </span>
                  <span>
                    <span className="block font-mono text-[10.5px] uppercase tracking-[0.16em] text-cyan">{c.label}</span>
                    <span className="mt-0.5 block text-[12.5px] leading-snug text-mute">{c.detail}</span>
                  </span>
                </a>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>

      {/* Side caption, desktop only */}
      <motion.div
        className="absolute right-[6vw] top-[16vh] z-10 hidden max-w-[220px] text-right xl:block"
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
