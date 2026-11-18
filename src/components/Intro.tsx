"use client";

import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { useExperience } from "@/lib/experience";
import { sceneState } from "@/lib/sceneStore";
import Magnetic from "./Magnetic";

const BOOT = [
  "loading cortex.weights",
  "mapping 9,000 neurons",
  "linking synapses",
  "calibrating attention",
];

/**
 * SCENE 00 — The Initialization.
 * Particles gather into the brain, the system boots, the visitor enters.
 * Always skippable; remembered for the session.
 */
export default function Intro() {
  const { introDone, finishIntro } = useExperience();
  const [stage, setStage] = useState(0); // 0 dark, 1 boot, 2 headline, 3 button
  const [bootLine, setBootLine] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const started = useRef(false);

  // Returning visitor / skipped: settle the scene quickly, no overlay.
  useEffect(() => {
    if (introDone !== true || started.current) return;
    started.current = true;
    sceneState.introCenter = 0;
    const t = gsap.to(sceneState, { assemble: 1, duration: 2.4, ease: "power2.inOut" });
    return () => {
      t.kill();
    };
  }, [introDone]);

  // First visit: the full sequence.
  useEffect(() => {
    if (introDone !== false || started.current) return;
    started.current = true;
    sceneState.assemble = 0;
    sceneState.introCenter = 1;
    const t = gsap.timeline();
    t.to(sceneState, { assemble: 1, duration: 4.2, ease: "power2.inOut" }, 0.3)
      .call(() => setStage(1), [], 1.6)
      .call(() => setStage(2), [], 3.6)
      .call(() => setStage(3), [], 4.6);
    tl.current = t;
    return () => {
      t.kill();
    };
  }, [introDone]);

  useEffect(() => {
    if (stage !== 1) return;
    const id = setInterval(() => setBootLine((b) => Math.min(b + 1, BOOT.length)), 420);
    return () => clearInterval(id);
  }, [stage]);

  const enter = () => {
    if (leaving) return;
    setLeaving(true);
    tl.current?.kill();
    const t = gsap.timeline({ onComplete: () => undefined });
    t.to(sceneState, { assemble: 1, duration: 0.6, ease: "power2.out" }, 0)
      .to(sceneState, { dolly: 1, burst: 0.55, duration: 1.3, ease: "power3.in" }, 0)
      .call(() => finishIntro(), [], 1.05)
      .to(sceneState, { dolly: 0, burst: 0, introCenter: 0, duration: 2.2, ease: "power3.out" }, 1.3);
  };

  const skip = () => {
    tl.current?.kill();
    gsap.to(sceneState, { assemble: 1, introCenter: 0, dolly: 0, burst: 0, duration: 1.2, ease: "power2.out" });
    finishIntro();
  };

  useEffect(() => {
    if (introDone !== false) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introDone]);

  return (
    <AnimatePresence>
      {introDone === false && (
        <motion.div
          key="intro"
          role="dialog"
          aria-label="Introduction"
          className="fixed inset-0 z-[70] flex flex-col items-center justify-end pb-[12vh] md:pb-[14vh]"
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
          {/* Top bar */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-5 md:px-10">
            <span className="font-display text-sm font-semibold tracking-[0.32em] text-ink/80">{site.brand}</span>
            <button
              type="button"
              onClick={skip}
              className="rounded-full border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mute transition-colors hover:border-cyan/50 hover:text-cyan"
              data-cursor="SKIP"
            >
              Skip intro <span className="ml-1 hidden text-mute/60 md:inline">[esc]</span>
            </button>
          </div>

          {/* Boot log */}
          <div className="absolute left-5 top-24 font-mono text-[10px] leading-6 tracking-[0.16em] text-mute md:left-10">
            {BOOT.slice(0, bootLine).map((l) => (
              <motion.div key={l} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
                <span className="text-cyan/70">›</span> {l} <span className="text-cyan">ok</span>
              </motion.div>
            ))}
          </div>

          <div className="relative flex flex-col items-center px-6 text-center">
            <motion.div
              className="mb-6 flex items-center gap-3 font-mono text-[11px] tracking-[0.42em] text-cyan"
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 1 ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan shadow-[0_0_10px_#55dfff]" />
              SYSTEM INITIALIZED
            </motion.div>

            <h1 className="display max-w-4xl text-[clamp(1.9rem,5.2vw,4.4rem)] text-ink">
              {["A NEW PERSPECTIVE", "ON INTELLIGENCE."].map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: stage >= 2 ? "0%" : "110%" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
                  >
                    {i === 1 ? (
                      <>
                        ON <span className="text-outline">INTELLIGENCE.</span>
                      </>
                    ) : (
                      line
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: stage >= 3 && !leaving ? 1 : 0, y: stage >= 3 ? 0 : 16 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <Magnetic>
                <button
                  type="button"
                  onClick={enter}
                  disabled={stage < 3 || leaving}
                  data-cursor="ENTER"
                  className="group relative flex items-center gap-4 rounded-full border border-cyan/40 bg-cyan/5 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.3em] text-ink backdrop-blur-md transition-colors hover:border-cyan hover:bg-cyan/15"
                >
                  <span className="absolute inset-0 rounded-full shadow-[0_0_40px_rgb(85_223_255/0.25)] opacity-0 transition-opacity group-hover:opacity-100" />
                  Enter experience
                  <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
                </button>
              </Magnetic>
            </motion.div>
          </div>

          <motion.p
            className="absolute bottom-6 font-mono text-[10px] tracking-[0.22em] text-mute/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 3 ? 1 : 0 }}
          >
            {site.tagline.toUpperCase()}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
