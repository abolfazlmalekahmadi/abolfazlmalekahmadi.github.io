"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMemo, useRef } from "react";
import { site } from "@/data/site";
import { mulberry32 } from "@/lib/noise";
import { sceneState } from "@/lib/sceneStore";

gsap.registerPlugin(ScrollTrigger);

const WORD = "text-[clamp(2.2rem,11vw,12.5rem)] display font-semibold text-ink";

/** SCENE 02 — Into the Mind: a pinned flight through the particle tunnel. */
export default function Mind() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  // Deterministic "synapse" lines for TRUST (no hydration mismatch).
  const synapses = useMemo(() => {
    const r = mulberry32(42);
    return Array.from({ length: 22 }, () => {
      const edge = r() * 4;
      const fx = edge < 1 ? r() * 1000 : edge < 2 ? 1000 : edge < 3 ? r() * 1000 : 0;
      const fy = edge < 1 ? 0 : edge < 2 ? r() * 300 : edge < 3 ? 300 : r() * 300;
      return { x1: fx, y1: fy, x2: 200 + r() * 600, y2: 90 + r() * 120 };
    });
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px)",
        },
        (ctx) => {
          const { motion, mobile } = ctx.conditions as { motion: boolean; mobile: boolean };
          const q = gsap.utils.selector(stage);

          if (!motion) {
            // Reduced motion: no pin, words simply visible; scene still morphs with scroll.
            gsap.set(q("[data-word], [data-philo]"), { opacity: 1, clearProps: "transform" });
            gsap.set(q("[data-trust-fill]"), { fillOpacity: 1 });
            gsap.set(q("[data-syn]"), { opacity: 0 });
            gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } }).to(sceneState, { morph: 1, travel: 30, ease: "none" });
            return;
          }

          gsap.set(q("[data-word]"), { opacity: 0 });
          gsap.set(q("[data-philo]"), { opacity: 0 });

          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => `+=${window.innerHeight * (mobile ? 2 : 2.6)}`,
              pin: stage.current,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // The scene: brain dissolves into a tunnel and we travel through it.
          tl.to(sceneState, { morph: 1, duration: 1.2, ease: "power1.inOut" }, 0).to(sceneState, { travel: 70, duration: 10, ease: "none" }, 0);

          // 1 — INTELLIGENCE forms from particles.
          const letters = q("[data-word='intelligence'] [data-l]");
          tl.set(q("[data-word='intelligence']"), { opacity: 1 }, 0.6)
            .fromTo(
              letters,
              { opacity: 0, x: () => gsap.utils.random(-420, 420), y: () => gsap.utils.random(-260, 260), scale: () => gsap.utils.random(0.2, 2.4), filter: "blur(14px)" },
              { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)", duration: 1.3, stagger: { each: 0.04, from: "random" } },
              0.6,
            )
            .to(q("[data-word='intelligence']"), { opacity: 0, scale: 1.12, filter: "blur(10px)", duration: 0.7, ease: "power2.in" }, 2.5);

          // 2 — LEARNING appears through layered typography.
          const layers = q("[data-word='learning'] [data-layer]");
          tl.set(q("[data-word='learning']"), { opacity: 1 }, 3.1)
            .fromTo(layers, { yPercent: (i: number) => (i - 1.5) * 70, opacity: 0 }, { yPercent: 0, opacity: (i: number) => (i === 3 ? 1 : 0.35), duration: 1.2, stagger: 0.1 }, 3.1)
            .to(q("[data-word='learning'] [data-layer='outline']"), { opacity: 0, duration: 0.4 }, 4.4)
            .to(q("[data-word='learning']"), { opacity: 0, yPercent: -30, duration: 0.7, ease: "power2.in" }, 4.9);

          // 3 — DISCOVERY emerges through a controlled light burst.
          tl.set(q("[data-word='discovery']"), { opacity: 1 }, 5.5)
            .fromTo(q("[data-burst]"), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" }, 5.5)
            .to(q("[data-burst]"), { scale: 2.6, opacity: 0, duration: 1, ease: "power2.out" }, 6)
            .fromTo(q("[data-discovery-text]"), { clipPath: "circle(0% at 50% 50%)", letterSpacing: "0.3em" }, { clipPath: "circle(75% at 50% 50%)", letterSpacing: "-0.035em", duration: 1.1, ease: "power3.out" }, 5.7)
            .to(q("[data-word='discovery']"), { opacity: 0, filter: "blur(8px)", duration: 0.6, ease: "power2.in" }, 7.1);

          // 4 — TRUST forms from scattered neural connections.
          tl.set(q("[data-word='trust']"), { opacity: 1 }, 7.6)
            .fromTo(q("[data-syn]"), { strokeDashoffset: 1, opacity: 0.9 }, { strokeDashoffset: 0, duration: 0.8, stagger: 0.02 }, 7.6)
            .fromTo(q("[data-trust-stroke]"), { strokeDashoffset: 1600 }, { strokeDashoffset: 0, duration: 1 }, 7.9)
            .to(q("[data-syn]"), { opacity: 0, duration: 0.5 }, 8.6)
            .fromTo(q("[data-trust-fill]"), { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.5 }, 8.7)
            .to(q("[data-word='trust']"), { opacity: 0, y: -40, duration: 0.6, ease: "power2.in" }, 9.3);

          // Philosophy.
          tl.to(q("[data-philo]"), { opacity: 1, duration: 0.3 }, 9.7)
            .fromTo(q("[data-philo-line]"), { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.025, ease: "power3.out" }, 9.7)
            .to({}, { duration: 0.8 });
        },
      );

      // Dim the scene for the reading-heavy sections that follow.
      gsap.timeline({
        scrollTrigger: { trigger: document.getElementById("research"), start: "top bottom", end: "top 30%", scrub: true },
      }).to(sceneState, { dim: 1, ease: "none" });

      return () => mm.revert();
    },
    { scope: root },
  );

  const philosophyWords = useMemo(() => site.philosophy.split(" "), []);

  return (
    <section id="mind" ref={root} className="relative" aria-label="Research philosophy">
      <div ref={stage} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden motion-reduce:min-h-0 motion-reduce:flex-col motion-reduce:gap-12 motion-reduce:py-32">
        <div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 md:top-24">
          <span className="label">02 — Into the mind</span>
        </div>

        {/* INTELLIGENCE */}
        <div data-word="intelligence" className={`absolute inset-x-0 text-center motion-reduce:static ${WORD}`} aria-label="Intelligence.">
          <span aria-hidden className="inline-flex">
            {"INTELLIGENCE.".split("").map((ch, i) => (
              <span key={i} data-l className={`inline-block ${ch === "." ? "text-cyan" : ""}`}>
                {ch}
              </span>
            ))}
          </span>
        </div>

        {/* LEARNING */}
        <div data-word="learning" className={`absolute inset-x-0 text-center motion-reduce:static ${WORD}`} aria-label="Learning.">
          <div aria-hidden className="relative inline-block">
            {[0, 1, 2].map((i) => (
              <span key={i} data-layer="outline" className="text-outline absolute inset-0" style={{ WebkitTextStroke: `1px rgb(85 223 255 / ${0.25 + i * 0.2})` }}>
                LEARNING.
              </span>
            ))}
            <span data-layer="solid" className="relative">
              LEARNING<span className="text-cyan">.</span>
            </span>
          </div>
        </div>

        {/* DISCOVERY */}
        <div data-word="discovery" className={`absolute inset-x-0 flex justify-center text-center motion-reduce:static ${WORD}`} aria-label="Discovery.">
          <span
            data-burst
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full motion-reduce:hidden"
            style={{ background: "radial-gradient(circle, rgb(234 250 255 / 0.9), rgb(85 223 255 / 0.35) 25%, transparent 62%)" }}
          />
          <span aria-hidden data-discovery-text className="glow-text relative">
            DISCOVERY<span className="text-cyan">.</span>
          </span>
        </div>

        {/* TRUST */}
        <div data-word="trust" className="absolute inset-x-0 flex justify-center px-4 motion-reduce:static" aria-label="Trust.">
          <svg viewBox="0 0 1000 300" className="w-[min(92vw,1100px)] overflow-visible" aria-hidden>
            {synapses.map((s, i) => (
              <g key={i}>
                <line data-syn x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} pathLength={1} strokeDasharray="1" stroke="#55DFFF" strokeOpacity={0.55} strokeWidth={0.8} />
                <circle data-syn cx={s.x2} cy={s.y2} r={2.2} fill="#55DFFF" />
              </g>
            ))}
            <text
              x="500"
              y="225"
              textAnchor="middle"
              fontSize="250"
              fontWeight={600}
              letterSpacing="-8"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              <tspan data-trust-fill data-trust-stroke fill="#EAF2FA" fillOpacity={0} stroke="#55DFFF" strokeWidth={1.4} strokeDasharray="1600">
                TRUST
              </tspan>
              <tspan fill="#55DFFF" data-trust-fill fillOpacity={0}>
                .
              </tspan>
            </text>
          </svg>
        </div>

        {/* Philosophy */}
        <div data-philo className="absolute inset-x-0 px-6 motion-reduce:static">
          <blockquote className="mx-auto max-w-5xl text-center">
            <div className="label mb-8 text-cyan">Research philosophy</div>
            <p className="font-display text-[clamp(1.5rem,3.6vw,3.3rem)] font-light leading-[1.18] tracking-tight text-ink">
              {philosophyWords.map((w, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <span data-philo-line className="inline-block">
                    {i === 0 ? <span className="text-mute">&ldquo;</span> : null}
                    {highlight(w)}
                    {i === philosophyWords.length - 1 ? <span className="text-mute">&rdquo;</span> : null}
                    {"\u00a0"}
                  </span>
                </span>
              ))}
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

const KEYWORDS = ["reliable", "interpretable", "useful"];
function highlight(line: string) {
  return line.split(/(reliable|interpretable|useful)/).map((part, i) =>
    KEYWORDS.includes(part) ? (
      <em key={i} className="not-italic text-cyan">
        {part}
      </em>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}
