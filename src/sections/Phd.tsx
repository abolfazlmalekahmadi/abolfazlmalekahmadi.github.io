"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Mail, RotateCcw } from "lucide-react";
import { useState, type ReactNode } from "react";
import { MaskHeading, Reveal } from "@/components/Reveal";
import { researchDomains } from "@/data/research";
import { site } from "@/data/site";
import { InquiryError, inquiryMailto, sendInquiry, type Inquiry } from "@/lib/inquiry";
import { asset } from "@/lib/asset";
import { useExperience } from "@/lib/experience";
import { FileText } from "lucide-react";
import { Rich } from "./Engineering";

const ease = [0.16, 1, 0.3, 1] as const;
const ROLES = ["Professor / PI", "Lab member", "Recruiter", "Other"];

type Status = "idle" | "sending" | "sent" | "error";

function Field({
  id,
  label,
  required,
  children,
  hint,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="group relative">
      {children}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-3.5 origin-left font-mono text-[11px] uppercase tracking-[0.16em] text-mute transition-all duration-300 peer-focus:-translate-y-5 peer-focus:scale-[0.85] peer-focus:text-cyan peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-[0.85]"
      >
        {label}
        {required && <span className="text-cyan"> *</span>}
      </label>
      <span aria-hidden className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-cyan shadow-[0_0_10px_#55dfff] transition-transform duration-500 ease-out-expo group-focus-within:scale-x-100" />
      {hint && <p className="mt-1.5 text-[11px] text-mute">{hint}</p>}
    </div>
  );
}

const input =
  "peer w-full border-0 border-b border-line bg-transparent pb-2.5 pt-4 text-[15px] text-ink placeholder-transparent outline-none transition-colors focus:border-transparent focus:outline-none focus-visible:outline-none";

function InquiryForm() {
  const [form, setForm] = useState<Inquiry>({ name: "", email: "", affiliation: "", role: "", message: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<InquiryError | null>(null);
  const set = (k: keyof Inquiry) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError(null);
    try {
      await sendInquiry(form);
      setStatus("sent");
    } catch (err) {
      setError(err instanceof InquiryError ? err : new InquiryError("Network error"));
      setStatus("error");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-px">
      {/* Rotating light around the card */}
      <div aria-hidden className="absolute inset-[-60%] animate-[spin_7s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_62%,rgb(21_155_206/0.7)_78%,#55dfff_86%,transparent_94%)] motion-reduce:animate-none" />
      <div className="relative rounded-[calc(1.5rem-1px)] bg-[linear-gradient(180deg,#0e1a2a,#0a1320)] p-6 md:p-9">
        <AnimatePresence mode="wait" initial={false}>
          {status === "sent" ? (
            <motion.div key="sent" className="flex min-h-[460px] flex-col items-center justify-center text-center" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease }}>
              <div className="relative flex h-20 w-20 items-center justify-center">
                <motion.span className="absolute inset-0 rounded-full border border-cyan/60" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: [0.6, 1.5], opacity: [0.9, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan/15 ring-1 ring-cyan/60 shadow-[0_0_30px_rgb(85_223_255/0.35)]">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 text-cyan" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.2, ease }} />
                  </svg>
                </span>
              </div>
              <h3 className="mt-8 font-display text-3xl font-medium tracking-tight text-ink">Message received.</h3>
              <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-mute">
                Thank you{form.name ? `, ${form.name.split(" ")[0]}` : ""}. I&rsquo;ll reply to <span className="text-ink">{form.email}</span>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setForm({ name: "", email: "", affiliation: "", role: "", message: "", website: "" });
                  setStatus("idle");
                }}
                className="mt-8 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-mute transition-colors hover:text-cyan"
              >
                <RotateCcw size={12} /> Send another
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} className="space-y-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} noValidate={false}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">Open channel</div>
                  <h3 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink md:text-[28px]">Have a position or a project?</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-mute">Leave your email — it comes straight to my inbox.</p>
                </div>
                <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan/40 bg-cyan/10 text-cyan sm:flex">
                  <Mail size={17} />
                </span>
              </div>

              <div className="grid gap-7 sm:grid-cols-2">
                <Field id="q-name" label="Your name">
                  <input id="q-name" name="name" autoComplete="name" placeholder="Your name" value={form.name} onChange={set("name")} className={input} />
                </Field>
                <Field id="q-email" label="Email" required>
                  <input id="q-email" name="email" type="email" required autoComplete="email" placeholder="Email" value={form.email} onChange={set("email")} className={input} />
                </Field>
              </div>
              <Field id="q-aff" label="University / lab">
                <input id="q-aff" name="affiliation" autoComplete="organization" placeholder="University / lab" value={form.affiliation} onChange={set("affiliation")} className={input} />
              </Field>

              <fieldset>
                <legend className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-mute">I am a</legend>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((r) => {
                    const on = form.role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setForm((f) => ({ ...f, role: on ? "" : r }))}
                        className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-all duration-300 ${on ? "border-cyan bg-cyan/15 text-ink shadow-[0_0_14px_rgb(85_223_255/0.25)]" : "border-line text-ink/75 hover:border-ink/30"}`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <Field id="q-msg" label="Message (optional)">
                <textarea id="q-msg" name="message" rows={3} placeholder="Message" value={form.message} onChange={set("message")} className={`${input} resize-none`} />
              </Field>

              {/* honeypot */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} className="hidden" aria-hidden />

              <AnimatePresence>
                {status === "error" && error && (
                  <motion.div role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-4 text-[13px] leading-relaxed text-ink/85">
                      {error.needsActivation ? "The inbox for this form is still being activated." : "The message couldn’t be sent right now."}{" "}
                      <a href={inquiryMailto(form)} className="text-cyan underline underline-offset-4">
                        Send it by email instead
                      </a>
                      .
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  data-cursor="SEND"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink px-7 py-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-bg transition-colors disabled:opacity-80"
                >
                  <span className="absolute inset-0 -translate-x-[101%] bg-cyan transition-transform duration-500 ease-out-expo group-hover:translate-x-0" />
                  <span className="relative">{status === "sending" ? "Sending" : "Send to my inbox"}</span>
                  {status === "sending" ? (
                    <span className="relative flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-bg" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </span>
                  ) : (
                    <ArrowRight size={14} className="relative transition-transform duration-500 group-hover:translate-x-1" />
                  )}
                </button>
                <span className="text-[11.5px] text-mute">Your email is only used to reply to you.</span>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Avatar({ size = 64 }: { size?: number }) {
  if (!site.avatar) return null;
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <span className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,#159bce,#55dfff,transparent_70%)] opacity-80 motion-safe:animate-[spin_6s_linear_infinite]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(site.avatar)} alt={`${site.name.first} ${site.name.last}`} width={size} height={size} className="relative h-full w-full rounded-full border-2 border-bg object-cover" />
      <span className="absolute bottom-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-bg bg-cyan">
        <span className="absolute inset-0 animate-ping rounded-full bg-cyan/70" />
      </span>
    </span>
  );
}

/** Short reminder placed right after Publications — when the reader is most convinced. */
export function PhdNudge() {
  const { scrollTo } = useExperience();
  if (!site.phd.open) return null;
  return (
    <section aria-label="Open to PhD positions" className="relative py-6 md:py-10">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl p-px">
            <div aria-hidden className="absolute inset-[-80%] animate-[spin_9s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_65%,rgb(21_155_206/0.7)_80%,#55dfff_88%,transparent_95%)] motion-reduce:animate-none" />
            <div className="relative flex flex-col gap-6 rounded-[calc(1.5rem-1px)] bg-[linear-gradient(110deg,#0d1c2e,#0a1320_55%,#0b1726)] p-6 md:flex-row md:items-center md:gap-8 md:p-8">
              <Avatar size={72} />
              <div className="flex-1">
                <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-cyan">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
                  {site.phd.badge}
                  {site.phd.start ? ` · ${site.phd.start}` : ""}
                </div>
                <h3 className="mt-2 font-display text-[clamp(1.4rem,2.4vw,2rem)] font-medium leading-tight tracking-tight text-ink">Interested in working together?</h3>
                <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-mute">
                  I&rsquo;m looking for a <strong className="font-semibold text-ink">PhD position</strong> and <strong className="font-semibold text-ink">research collaborations</strong> in medical AI, foundation models and agentic systems.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => scrollTo("#phd")}
                  data-cursor="CONNECT"
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-ink px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-bg"
                >
                  <span className="absolute inset-0 -translate-x-[101%] bg-cyan transition-transform duration-500 ease-out-expo group-hover:translate-x-0" />
                  <span className="relative">Get in touch</span>
                  <ArrowRight size={14} className="relative transition-transform group-hover:translate-x-1" />
                </button>
                {site.cv && (
                  <a
                    href={asset(site.cv)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="CV"
                    className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-cyan hover:text-cyan"
                  >
                    <FileText size={14} /> CV
                  </a>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** PhD search: announcement + inquiry form. */
export default function Phd() {
  if (!site.phd.open) return null;
  const { phd } = site;

  return (
    <section id="phd" className="relative py-28 md:py-40" aria-label="PhD positions">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-[60vmin] w-[80vmin] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div className="container-x relative">
        <Reveal className="mb-8 flex flex-wrap items-center gap-4">
          <span className="relative inline-flex items-center gap-2.5 rounded-full border border-cyan/40 bg-cyan/10 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-cyan/70" />
              <span className="relative h-2 w-2 rounded-full bg-cyan" />
            </span>
            {phd.badge}
            {phd.start && <span className="text-ink/70">· {phd.start}</span>}
          </span>
          <span className="font-mono text-[11px] tracking-[0.2em] text-cyan">09</span>
          <span className="h-px w-12 bg-cyan/40" />
          <span className="label">Next chapter</span>
        </Reveal>

        <MaskHeading lines={["LOOKING FOR", <span key="b" className="text-outline">MY NEXT LAB.</span>]} className="display text-[clamp(2.6rem,7vw,7rem)] text-ink" />

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal className="mb-8 flex items-center gap-4">
              <Avatar size={60} />
              <div>
                <div className="font-display text-lg tracking-tight text-ink">
                  {site.name.first} {site.name.last}
                </div>
                <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-mute">{site.role}</div>
              </div>
            </Reveal>
            <Reveal>
              <p className="font-display text-[clamp(1.3rem,2.1vw,1.75rem)] font-light leading-snug tracking-tight text-ink">{phd.pitch}</p>
            </Reveal>

            <Reveal delay={0.08} className="mt-10">
              <div className="label mb-4">Directions I want to pursue</div>
              <div className="flex flex-wrap gap-2">
                {researchDomains.map((d) => (
                  <span key={d.id} className="flex items-center gap-2 rounded-full border border-line bg-bg-2/50 px-3.5 py-1.5 text-[13px] text-ink/85">
                    <span className="font-mono text-[10.5px] text-cyan">{d.index}</span>
                    {d.title}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.14} className="mt-10">
              <div className="label mb-4">What I bring</div>
              <ul className="space-y-3">
                {phd.bring.map((b, i) => (
                  <motion.li
                    key={b}
                    className="flex gap-3 text-[14.5px] leading-snug text-mute"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.07 }}
                  >
                    <Check size={15} className="mt-0.5 shrink-0 text-cyan" />
                    <span>
                      <Rich text={b} />
                    </span>
                  </motion.li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-7">
            <InquiryForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
