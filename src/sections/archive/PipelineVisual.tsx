"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { mulberry32 } from "@/lib/noise";

const STAGES = [
  { label: "Input", note: "A tongue photograph — non-invasive, cheap, and fast to take." },
  { label: "Segment", note: "SAM isolates the tongue from lips, teeth and background." },
  { label: "Features", note: "DeepLabv3+ / DINOv2 turn the tongue region into rich visual features." },
  { label: "Classify", note: "Separate stenosis predictions for each coronary artery: LAD, RCA and LCX." },
  { label: "Interpret", note: "Occlusion sensitivity masks patches one by one; colour and fissures matter most." },
];

const TONGUE = "M110,40 C150,28 250,28 290,40 C306,46 312,70 308,110 C302,170 270,236 200,252 C130,236 98,170 92,110 C88,70 94,46 110,40 Z";
const ARTERIES = ["LAD", "RCA", "LCX"];

export default function PipelineVisual({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const [stage, setStage] = useState(0);
  const [auto, setAuto] = useState(true);
  const [occl, setOccl] = useState(0);

  useEffect(() => {
    if (!inView || !auto) return;
    const id = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 3000);
    return () => clearInterval(id);
  }, [inView, auto]);

  useEffect(() => {
    if (stage !== 4 || !inView) return;
    const id = setInterval(() => setOccl((o) => (o + 1) % 30), 90);
    return () => clearInterval(id);
  }, [stage, inView]);

  const patches = useMemo(() => {
    const r = mulberry32(9);
    const out: { x: number; y: number; v: number }[] = [];
    for (let gy = 0; gy < 9; gy++)
      for (let gx = 0; gx < 9; gx++) {
        const x = 96 + gx * 23;
        const y = 34 + gy * 24;
        // brighter near the centre-line (fissures) and edges (colour)
        const centre = Math.exp(-((x + 11 - 200) ** 2) / 900);
        const v = Math.min(1, 0.15 + r() * 0.45 + centre * 0.5);
        out.push({ x, y, v });
      }
    return out;
  }, []);

  const fissures = (
    <g stroke="#55DFFF" strokeOpacity="0.55" strokeWidth="1.2" fill="none" strokeLinecap="round">
      <path d="M200,62 C196,100 204,140 198,190 C196,206 200,220 200,228" />
      <path d="M200,110 C186,118 176,130 168,146" />
      <path d="M199,150 C214,158 226,170 232,186" />
      <path d="M202,84 C214,90 222,100 226,112" />
    </g>
  );

  return (
    <div ref={ref} className="w-full">
      <div className="relative grid aspect-[4/3] w-full grid-cols-[1fr_auto] overflow-hidden rounded-2xl border border-line bg-[radial-gradient(80%_80%_at_40%_50%,#0e1b2b,#05080d)]">
        <svg viewBox="0 0 400 290" className="h-full w-full" role="img" aria-label={`Schematic of stage: ${STAGES[stage].label}`}>
          <defs>
            <clipPath id="tongue-clip">
              <path d={TONGUE} />
            </clipPath>
            <pattern id="papillae" width="9" height="9" patternUnits="userSpaceOnUse">
              <circle cx="4.5" cy="4.5" r="0.9" fill="#8497AA" opacity="0.5" />
            </pattern>
          </defs>

          {/* Mouth outline (dims once segmented) */}
          <motion.g animate={{ opacity: stage === 0 ? 0.9 : 0.2 }}>
            <path d="M40,40 C110,0 290,0 360,40 C380,54 378,70 360,74 C290,60 110,60 40,74 C22,70 20,54 40,40 Z" fill="none" stroke="#8497AA" strokeOpacity="0.5" />
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} x={120 + i * 21} y={28} width={16} height={18} rx={4} fill="none" stroke="#8497AA" strokeOpacity="0.4" />
            ))}
          </motion.g>

          {/* Tongue */}
          <path d={TONGUE} fill="#101B2A" stroke="#EAF2FA" strokeOpacity="0.55" strokeWidth="1.2" />
          <path d={TONGUE} fill="url(#papillae)" />
          {fissures}

          <AnimatePresence>
            {stage === 1 && (
              <motion.g key="seg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <path d={TONGUE} fill="#55DFFF" fillOpacity="0.18" />
                <motion.path d={TONGUE} fill="none" stroke="#55DFFF" strokeWidth="2.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeInOut" }} style={{ filter: "drop-shadow(0 0 6px #55DFFF)" }} />
              </motion.g>
            )}
            {(stage === 2 || stage === 3) && (
              <motion.g key="feat" clipPath="url(#tongue-clip)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {patches.map((p, i) => (
                  <motion.rect
                    key={i}
                    x={p.x}
                    y={p.y}
                    width={22}
                    height={23}
                    fill="#159BCE"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: p.v * 0.75 }}
                    transition={{ delay: (i % 9) * 0.03 + Math.floor(i / 9) * 0.04 }}
                    stroke="#05080D"
                    strokeWidth="1"
                  />
                ))}
              </motion.g>
            )}
            {stage === 4 && (
              <motion.g key="occ" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <g clipPath="url(#tongue-clip)">
                  <rect x={96 + (occl % 6) * 35} y={40 + Math.floor(occl / 6) * 44} width={35} height={44} fill="#05080D" opacity="0.92" stroke="#55DFFF" strokeWidth="1" />
                </g>
                <g fontFamily="var(--font-jetbrains)" fontSize="9" fill="#55DFFF" letterSpacing="1.5">
                  <line x1="200" y1="140" x2="330" y2="118" stroke="#55DFFF" strokeOpacity="0.6" />
                  <text x="332" y="116">FISSURES</text>
                  <line x1="120" y1="110" x2="40" y2="150" stroke="#55DFFF" strokeOpacity="0.6" />
                  <text x="6" y="164">COLOUR</text>
                </g>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Classifier heads */}
        <div className="flex w-[118px] flex-col justify-center gap-3 border-l border-line bg-bg/40 px-3 py-4 md:w-[140px]">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-mute">Stenosis heads</div>
          {ARTERIES.map((a, i) => (
            <motion.div
              key={a}
              className="rounded-lg border px-2.5 py-2"
              animate={{
                borderColor: stage >= 3 ? "rgba(85,223,255,0.6)" : "rgba(132,151,170,0.16)",
                backgroundColor: stage >= 3 ? "rgba(85,223,255,0.08)" : "rgba(0,0,0,0)",
              }}
              transition={{ delay: stage >= 3 ? i * 0.25 : 0 }}
            >
              <div className={`font-display text-lg leading-none ${stage >= 3 ? "text-cyan" : "text-ink/50"}`}>{a}</div>
              <div className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.12em] text-mute">{a === "LCX" ? "≤ 80% acc." : "classified"}</div>
            </motion.div>
          ))}
        </div>

        <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-bg/70 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-cyan backdrop-blur">
          {String(stage + 1).padStart(2, "0")} · {STAGES[stage].label}
        </div>
      </div>

      <div role="tablist" aria-label="Pipeline stages" className="mt-4 grid grid-cols-5 gap-1.5">
        {STAGES.map((s, i) => (
          <button
            key={s.label}
            role="tab"
            aria-selected={stage === i}
            onClick={() => {
              setAuto(false);
              setStage(i);
            }}
            className={`relative overflow-hidden rounded-lg border px-2 py-2.5 text-left transition-colors ${stage === i ? "border-cyan/50 bg-cyan/10" : "border-line hover:border-ink/30"}`}
          >
            <div className="font-mono text-[9px] text-mute">0{i + 1}</div>
            <div className={`mt-0.5 text-[11.5px] leading-tight ${stage === i ? "text-cyan" : "text-ink/80"}`}>{s.label}</div>
            {stage === i && auto && inView && <motion.span className="absolute bottom-0 left-0 h-px bg-cyan" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3, ease: "linear" }} />}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={stage} className="mt-3 min-h-[2.5em] text-[13px] leading-snug text-mute" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {STAGES[stage].note}
        </motion.p>
      </AnimatePresence>
      <span className="sr-only">{project.visualNote}</span>
    </div>
  );
}
