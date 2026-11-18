"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { asset } from "@/lib/asset";

const STAGES = [
  { key: "input", label: "CT slice", note: "A raw axial slice goes in — no manual prompt is ever given." },
  { key: "prob", label: "Probability map", note: "The model's own probability map localises the pancreas." },
  { key: "prompt", label: "Auto prompts", note: "Prompts are derived from that map — no clicks, no boxes, and you can see why." },
  { key: "mask", label: "Segmentation", note: "SAM decodes the final mask — Dice 87.01% on the NIH dataset." },
] as const;

const PANCREAS =
  "M158,176 C160,160 178,152 200,153 C224,152 250,142 280,132 C298,126 314,131 311,143 C307,153 283,153 262,158 C240,164 220,171 204,180 C188,189 162,193 158,176 Z";

/** Schematic axial CT — clearly an illustration, not patient data. */
function CTSlice({ uid }: { uid: string }) {
  return (
    <g>
      <defs>
        <filter id={`${uid}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="4" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.22" />
          </feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <radialGradient id={`${uid}-fat`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#4a4f55" />
          <stop offset="100%" stopColor="#2b2f34" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="#020304" />
      <ellipse cx="200" cy="155" rx="178" ry="128" fill="#6d7177" />
      <ellipse cx="200" cy="155" rx="172" ry="122" fill={`url(#${uid}-fat)`} />
      <ellipse cx="200" cy="158" rx="150" ry="104" fill="none" stroke="#7d8288" strokeWidth="9" opacity="0.8" />
      {/* liver */}
      <path d="M58,120 C62,86 110,66 168,72 C182,76 186,92 176,110 C166,132 158,160 150,188 C130,206 92,204 70,186 C56,170 54,142 58,120 Z" fill="#8c9096" />
      {/* stomach */}
      <ellipse cx="248" cy="96" rx="50" ry="30" fill="#5b6066" />
      <ellipse cx="250" cy="86" rx="34" ry="12" fill="#14171a" />
      {/* spleen */}
      <ellipse cx="330" cy="150" rx="22" ry="42" fill="#8e9298" transform="rotate(-12 330 150)" />
      {/* kidneys */}
      <ellipse cx="122" cy="214" rx="22" ry="32" fill="#a7abb1" transform="rotate(18 122 214)" />
      <ellipse cx="282" cy="214" rx="22" ry="32" fill="#a7abb1" transform="rotate(-18 282 214)" />
      <ellipse cx="126" cy="214" rx="9" ry="16" fill="#6b6f75" transform="rotate(18 126 214)" />
      <ellipse cx="278" cy="214" rx="9" ry="16" fill="#6b6f75" transform="rotate(-18 278 214)" />
      {/* pancreas (native) */}
      <path d={PANCREAS} fill="#9a9ea4" />
      {/* vessels */}
      <circle cx="214" cy="198" r="10" fill="#c9cdd2" />
      <ellipse cx="180" cy="196" rx="11" ry="8" fill="#b4b8bd" />
      <circle cx="210" cy="168" r="4" fill="#c9cdd2" />
      <circle cx="198" cy="170" r="4.5" fill="#b4b8bd" />
      {/* bowel loops */}
      {[
        [120, 120, 12],
        [232, 132, 9],
        [300, 104, 10],
        [96, 150, 8],
        [258, 186, 10],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? "#4b5056" : "#7a7f85"} stroke="#9a9ea4" strokeWidth="1" />
      ))}
      {/* spine */}
      <path d="M176,232 C176,214 224,214 224,232 C224,252 176,252 176,232 Z" fill="#e9ebee" />
      <circle cx="200" cy="254" r="8" fill="#14171a" />
      <path d="M186,262 L200,282 L214,262" fill="#dfe2e5" />
      <rect width="400" height="300" filter={`url(#${uid}-grain)`} fill="#888" />
    </g>
  );
}

export default function SegmentationVisual({ project }: { project: Project }) {
  const uid = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const [stage, setStage] = useState(0);
  const [split, setSplit] = useState(42);
  const [auto, setAuto] = useState(true);
  const media = project.media;

  useEffect(() => {
    if (!inView || !auto || media?.input) return;
    const id = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 2800);
    return () => clearInterval(id);
  }, [inView, auto, media]);

  const pick = (i: number) => {
    setAuto(false);
    setStage(i);
  };

  const overlay = (
    <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <filter id={`${uid}-blur`}>
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={`${uid}-glow`}>
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <AnimatePresence mode="wait">
        {stage === 1 && (
          <motion.g key="prob" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <rect width="400" height="300" fill="#05080D" opacity="0.45" />
            <path d={PANCREAS} fill="#159BCE" filter={`url(#${uid}-blur)`} transform="scale(1.06) translate(-12,-9)" opacity="0.9" />
            <path d={PANCREAS} fill="#55DFFF" filter={`url(#${uid}-blur)`} opacity="0.85" />
            <path d={PANCREAS} fill="#eafcff" filter={`url(#${uid}-blur)`} transform="translate(205 150) scale(0.55) translate(-235 -158)" opacity="0.7" />
          </motion.g>
        )}
        {stage === 2 && (
          <motion.g key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <path d={PANCREAS} fill="#55DFFF" filter={`url(#${uid}-blur)`} opacity="0.35" />
            <motion.rect x="150" y="122" width="170" height="74" fill="none" stroke="#55DFFF" strokeDasharray="4 4" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9 }} />
            {[
              [176, 172],
              [228, 160],
              [290, 140],
            ].map(([x, y], i) => (
              <motion.g key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 + i * 0.2, type: "spring", stiffness: 300, damping: 18 }} style={{ transformOrigin: `${x}px ${y}px` }}>
                <circle cx={x} cy={y} r="9" fill="none" stroke="#55DFFF" strokeWidth="1" />
                <circle cx={x} cy={y} r="2.6" fill="#EAF2FA" />
                <line x1={x - 14} x2={x - 10} y1={y} y2={y} stroke="#55DFFF" />
                <line x1={x + 10} x2={x + 14} y1={y} y2={y} stroke="#55DFFF" />
              </motion.g>
            ))}
          </motion.g>
        )}
        {stage === 3 && (
          <motion.g key="mask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <path d={PANCREAS} fill="#55DFFF" fillOpacity="0.45" stroke="#55DFFF" strokeWidth="1.6" filter={`url(#${uid}-glow)`} />
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );

  return (
    <div ref={ref} className="w-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-black select-none">
        {/* Left: input */}
        <div className="absolute inset-0">
          {media?.input ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={asset(media.input)} alt="CT input" className="h-full w-full object-cover" />
          ) : (
            <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Schematic axial abdominal CT slice">
              <CTSlice uid={`${uid}a`} />
            </svg>
          )}
        </div>
        {/* Right: output (clipped by the slider) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${split}%)` }}>
          {media?.output ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={asset(media.output)} alt="Segmentation output" className="h-full w-full object-cover" />
          ) : (
            <>
              <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden>
                <CTSlice uid={`${uid}b`} />
              </svg>
              {overlay}
            </>
          )}
        </div>

        {/* Scanning beam on every stage change */}
        <motion.div
          key={stage}
          className="scanline pointer-events-none absolute inset-x-0 h-[3px]"
          initial={{ top: "-2%", opacity: 1 }}
          animate={{ top: "102%", opacity: [1, 1, 0] }}
          transition={{ duration: 1.3, ease: "easeInOut" }}
        />

        {/* Divider */}
        <div className="pointer-events-none absolute inset-y-0 w-px bg-cyan shadow-[0_0_12px_#55dfff]" style={{ left: `${split}%` }}>
          <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan bg-bg/80 font-mono text-[10px] text-cyan backdrop-blur">
            ⟷
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          aria-label="Compare input and output"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          data-cursor="DRAG"
        />

        <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-bg/70 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-mute backdrop-blur">Input</div>
        <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-bg/70 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-cyan backdrop-blur">
          {media?.output ? "Output" : STAGES[stage].label}
        </div>
      </div>

      {!media?.input && (
        <div className="mt-4">
          <div role="tablist" aria-label="Pipeline stages" className="grid grid-cols-4 gap-1.5">
            {STAGES.map((s, i) => (
              <button
                key={s.key}
                role="tab"
                aria-selected={stage === i}
                onClick={() => pick(i)}
                className={`relative overflow-hidden rounded-lg border px-2 py-2.5 text-left transition-colors ${stage === i ? "border-cyan/50 bg-cyan/10" : "border-line hover:border-ink/30"}`}
              >
                <div className="font-mono text-[9px] text-mute">0{i + 1}</div>
                <div className={`mt-0.5 text-[11.5px] leading-tight ${stage === i ? "text-cyan" : "text-ink/80"}`}>{s.label}</div>
                {stage === i && auto && inView && <motion.span className="absolute bottom-0 left-0 h-px bg-cyan" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.8, ease: "linear" }} />}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p key={stage} className="mt-3 min-h-[2.5em] text-[13px] leading-snug text-mute" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {STAGES[stage].note}
            </motion.p>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
