"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";

type NodeId = "input" | "plan" | "research" | "eval" | "decide" | "output";

const NODES: Record<NodeId, { x: number; y: number; label: string; sub: string }> = {
  input: { x: 50, y: 150, label: "Job brief", sub: "input" },
  plan: { x: 150, y: 70, label: "Planning", sub: "agent" },
  research: { x: 270, y: 70, label: "Research", sub: "agent" },
  eval: { x: 270, y: 230, label: "Evaluation", sub: "agent" },
  decide: { x: 150, y: 230, label: "Decision", sub: "agent" },
  output: { x: 350, y: 150, label: "Shortlist", sub: "output" },
};

const EDGES: [NodeId, NodeId][] = [
  ["input", "plan"],
  ["plan", "research"],
  ["research", "eval"],
  ["eval", "decide"],
  ["plan", "eval"],
  ["decide", "plan"],
  ["decide", "output"],
];

type Step = { from: NodeId; to: NodeId; agent: NodeId; log: string };

/** A representative run of the hiring pipeline, with made-up sample inputs. */
const SCRIPT: Step[] = [
  { from: "input", to: "plan", agent: "plan", log: "Received brief: “ML Engineer — LLM serving”. Splitting into: match → question → evaluate → rank." },
  { from: "plan", to: "research", agent: "research", log: "Retrieving sample profiles A, B, C · semantic match against the job description." },
  { from: "research", to: "eval", agent: "eval", log: "Generating role-specific technical + HR interview questions." },
  { from: "plan", to: "eval", agent: "eval", log: "Evaluating the (sample) interview answers for each candidate." },
  { from: "eval", to: "decide", agent: "decide", log: "Aggregating suitability scores and evaluation results." },
  { from: "decide", to: "plan", agent: "plan", log: "Consistency check passed — no further retrieval needed." },
  { from: "decide", to: "output", agent: "output", log: "Shortlist ready with a written rationale per candidate." },
];

export default function AgentsVisual({ project }: { project: Project }) {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<{ t: string; agent: NodeId; text: string }[]>([]);
  const logRef = useRef<HTMLOListElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [logs]);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setLogs([]);
    setRunning(true);
    setStep(-1);
    const start = performance.now();
    SCRIPT.forEach((s, i) => {
      timers.current.push(
        setTimeout(() => {
          setStep(i);
          const t = ((performance.now() - start) / 1000).toFixed(1).padStart(4, "0");
          setLogs((l) => [...l, { t, agent: s.agent, text: s.log }]);
          if (i === SCRIPT.length - 1) timers.current.push(setTimeout(() => setRunning(false), 900));
        }, 400 + i * 1300),
      );
    });
  };

  const current = step >= 0 ? SCRIPT[step] : null;
  const activeNode = current?.agent;
  const done = !running && step === SCRIPT.length - 1;

  return (
    <div className="w-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-[radial-gradient(70%_70%_at_50%_50%,#0e1b2b,#05080d)]">
        <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Multi-agent workflow diagram">
          {EDGES.map(([a, b]) => {
            const A = NODES[a];
            const B = NODES[b];
            const hot = current && current.from === a && current.to === b;
            return (
              <line
                key={`${a}-${b}`}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke={hot ? "#55DFFF" : "#159BCE"}
                strokeOpacity={hot ? 0.9 : 0.22}
                strokeWidth={hot ? 1.6 : 1}
                strokeDasharray={a === "decide" && b === "plan" ? "3 4" : undefined}
                style={{ transition: "all .4s" }}
              />
            );
          })}

          {/* Message packet */}
          <AnimatePresence>
            {current && (
              <motion.circle
                key={step}
                r={4.5}
                fill="#EAF2FA"
                style={{ filter: "drop-shadow(0 0 6px #55DFFF)" }}
                initial={{ cx: NODES[current.from].x, cy: NODES[current.from].y, opacity: 0 }}
                animate={{ cx: NODES[current.to].x, cy: NODES[current.to].y, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>

          {(Object.keys(NODES) as NodeId[]).map((id) => {
            const n = NODES[id];
            const isAgent = n.sub === "agent";
            const on = activeNode === id || (done && id === "output");
            return (
              <g key={id}>
                {on && (
                  <motion.circle cx={n.x} cy={n.y} r={isAgent ? 30 : 22} fill="none" stroke="#55DFFF" initial={{ scale: 0.8, opacity: 0.8 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: 1.2, repeat: Infinity }} style={{ transformOrigin: `${n.x}px ${n.y}px` }} />
                )}
                <circle cx={n.x} cy={n.y} r={isAgent ? 26 : 18} fill="#0B1422" stroke={on ? "#55DFFF" : "#8497AA"} strokeOpacity={on ? 1 : 0.35} strokeWidth={1.2} style={{ transition: "all .4s" }} />
                <circle cx={n.x} cy={n.y} r={3} fill={on ? "#55DFFF" : "#159BCE"} />
                <text x={n.x} y={n.y + (isAgent ? 42 : 34)} textAnchor="middle" fontSize="11" fill={on ? "#EAF2FA" : "#8497AA"} style={{ fontFamily: "var(--font-space-grotesk)", transition: "fill .4s" }}>
                  {n.label}
                </text>
                <text x={n.x} y={n.y + (isAgent ? 54 : 46)} textAnchor="middle" fontSize="7" letterSpacing="1.4" fill="#8497AA" style={{ fontFamily: "var(--font-jetbrains)" }}>
                  {n.sub.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute left-3 top-3 rounded-full bg-bg/70 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-mute backdrop-blur">Illustrative simulation</div>
        <div className="absolute right-3 top-3">
          <button
            type="button"
            onClick={run}
            disabled={running}
            data-cursor="RUN"
            className={`flex items-center gap-2 rounded-full border border-cyan/50 bg-cyan/10 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan backdrop-blur transition-colors hover:bg-cyan/20 disabled:opacity-50 ${step < 0 && !running ? "glow-pulse" : ""}`}
          >
            {done ? <RotateCcw size={12} /> : <Play size={12} />}
            {running ? "Running…" : done ? "Run again" : "Run simulation"}
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-line bg-bg/50">
        <div className="flex items-center justify-between border-b border-line px-4 py-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mute">Agent log</span>
          <span className={`h-1.5 w-1.5 rounded-full ${running ? "animate-pulse bg-cyan" : "bg-mute/40"}`} />
        </div>
        <ol ref={logRef} aria-live="polite" className="no-scrollbar h-[112px] overflow-y-auto px-4 py-3 font-mono text-[11px] leading-5">
          {logs.length === 0 && <li className="text-mute">Press “Run simulation” to watch a representative workflow.</li>}
          {logs.map((l, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
              <span className="shrink-0 text-mute">{l.t}s</span>
              <span className="shrink-0 text-cyan">{NODES[l.agent].label.toLowerCase()}</span>
              <span className="text-ink/80">{l.text}</span>
            </motion.li>
          ))}
        </ol>
      </div>
      <span className="sr-only">{project.visualNote}</span>
    </div>
  );
}
