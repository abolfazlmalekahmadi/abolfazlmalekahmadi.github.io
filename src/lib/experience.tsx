"use client";

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "./hooks";

gsap.registerPlugin(ScrollTrigger);

const INTRO_KEY = "neural:intro-seen";

type Experience = {
  /** null until we know whether the intro should play (avoids a flash). */
  introDone: boolean | null;
  finishIntro: () => void;
  reducedMotion: boolean;
  scrollTo: (target: string | number) => void;
};

const Ctx = createContext<Experience | null>(null);

export function useExperience() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useExperience must be used inside <ExperienceProvider>");
  return v;
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const [introDone, setIntroDone] = useState<boolean | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Decide once, on the client, whether to play the intro.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_KEY) === "1";
    } catch {}
    const deepLink = window.location.hash.length > 1;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIntroDone(seen || deepLink || reduce);
  }, []);

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {}
    setIntroDone(true);
  }, []);

  // Smooth scrolling (skipped for reduced motion).
  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  // Lock scrolling while the intro plays.
  useEffect(() => {
    const locked = introDone === false;
    document.documentElement.classList.toggle("scroll-locked", locked);
    if (locked) lenisRef.current?.stop();
    else lenisRef.current?.start();
    if (introDone) {
      // Layout may have shifted while locked.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [introDone]);

  const scrollTo = useCallback(
    (target: string | number) => {
      const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : null;
      if (typeof target === "string" && !el) return;
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el ?? (target as number), { duration: 1.6 });
      } else {
        if (el) el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
        else window.scrollTo({ top: target as number, behavior: reducedMotion ? "auto" : "smooth" });
      }
      if (typeof target === "string" && target.startsWith("#")) {
        history.replaceState(null, "", target);
      }
    },
    [reducedMotion],
  );

  const value = useMemo(
    () => ({ introDone, finishIntro, reducedMotion, scrollTo }),
    [introDone, finishIntro, reducedMotion, scrollTo],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
