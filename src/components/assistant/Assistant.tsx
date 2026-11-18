"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, MessageSquare, Send, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useExperience } from "@/lib/experience";
import { createProvider } from "./providers";
import type { ChatMessage } from "./types";

const SUGGESTIONS = ["Are you looking for a PhD?", "What is PanSAM?", "What are your research interests?", "Tell me about the Nature paper"];

export default function Assistant() {
  const provider = useMemo(() => createProvider(), []);
  const { introDone, scrollTo } = useExperience();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const list = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = async (q: string) => {
    const question = q.trim();
    if (!question || busy) return;
    const history = [...messages, { role: "user" as const, text: question }];
    setMessages(history);
    setInput("");
    setBusy(true);
    try {
      const r = await provider.ask(question, history);
      setMessages((m) => [...m, { role: "assistant", text: r.text, sources: r.sources }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Sorry — the assistant is unavailable right now. Everything it knows is also on this page." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="assistant-panel"
        data-cursor="ASK"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 rounded-full border border-cyan/40 bg-bg/80 py-2.5 pl-3 pr-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink shadow-[0_0_30px_rgb(21_155_206/0.25)] backdrop-blur-xl transition-colors hover:border-cyan md:bottom-6 md:right-6"
        initial={{ opacity: 0, y: 20 }}
        animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-cyan/15 text-cyan">
          {open ? <X size={13} /> : <Sparkles size={13} />}
        </span>
        <span className="hidden sm:inline">{open ? "Close" : "Ask about my research"}</span>
        <span className="sm:hidden">{open ? "Close" : "Ask"}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="assistant-panel"
            role="dialog"
            aria-label="Research assistant"
            className="panel fixed inset-x-3 bottom-[4.5rem] z-50 flex max-h-[min(640px,calc(100svh-7rem))] flex-col overflow-hidden rounded-2xl shadow-2xl md:inset-x-auto md:bottom-24 md:right-6 md:w-[400px]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan/40 bg-cyan/10 text-cyan">
                  <MessageSquare size={14} />
                </span>
                <div>
                  <div className="font-display text-[15px] tracking-tight text-ink">Research assistant</div>
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-mute">{provider.live ? "Live · grounded on portfolio data" : "Offline mode · no AI model"}</div>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant" className="rounded-full p-1.5 text-mute hover:text-ink">
                <X size={15} />
              </button>
            </div>

            {!provider.live && (
              <div className="border-b border-line bg-cyan/5 px-5 py-2.5 text-[11.5px] leading-snug text-mute">
                Answers are retrieved word-for-word from the verified information on this site. No language model is involved yet.
              </div>
            )}

            <div ref={list} className="flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-live="polite">
              {messages.length === 0 && (
                <div>
                  <p className="text-[13.5px] leading-relaxed text-ink/80">Ask about research, papers, projects or background. Answers come with links to their source.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} type="button" onClick={() => ask(s)} className="rounded-full border border-line px-3 py-1.5 text-left text-[12px] text-ink/80 transition-colors hover:border-cyan/50 hover:text-cyan">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={m.role === "user" ? "flex justify-end" : ""}>
                  <div className={m.role === "user" ? "max-w-[85%] rounded-2xl rounded-br-sm bg-cyan/15 px-4 py-2.5 text-[13.5px] text-ink" : "text-[13.5px] leading-relaxed text-ink/85"}>
                    {m.text.split("\n\n").map((p, j) => (
                      <p key={j} className={j ? "mt-3" : ""}>
                        {p}
                      </p>
                    ))}
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {m.sources.map((s) =>
                          s.href.startsWith("#") ? (
                            <button key={s.href + s.label} type="button" onClick={() => scrollTo(s.href)} className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-cyan hover:border-cyan/50">
                              {s.label} ↓
                            </button>
                          ) : (
                            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-cyan hover:border-cyan/50">
                              {s.label} <ArrowUpRight size={10} />
                            </a>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {busy && (
                <div className="flex gap-1.5" aria-label="Thinking">
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-cyan" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              )}
            </div>

            <form
              className="flex items-center gap-2 border-t border-line p-3"
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                aria-label="Your question"
                className="flex-1 rounded-full border border-line bg-bg/60 px-4 py-2.5 text-[13.5px] text-ink placeholder:text-mute/70 focus:border-cyan/50 focus:outline-none"
              />
              <button type="submit" disabled={!input.trim() || busy} aria-label="Send" className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan text-bg transition-opacity disabled:opacity-40">
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
