"use client";

import { AnimatePresence, motion, useInView, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Briefcase, ChevronDown, GraduationCap, Rocket } from "lucide-react";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import CountUp from "@/components/CountUp";
import { MaskHeading, Reveal } from "@/components/Reveal";
import { engineeringStats, judgingPhoto, roles, skillGroups, teaching, teachingStats, whereUsed, type Role } from "@/data/experience";
import { asset } from "@/lib/asset";
import { useExperience } from "@/lib/experience";

/** Full panels for the main roles; the rest go under "Earlier roles". */
const featured = roles.filter((r) => !r.compact);
const earlier = roles.filter((r) => r.compact);

const ease = [0.16, 1, 0.3, 1] as const;

/** Renders **bold** markers as emphasised text. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") ? (
          <strong key={i} className="font-semibold text-ink">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** The system built in a role, drawn as a pipeline with signals flowing through it. */
function SystemFlow({ steps, active, label = "System built" }: { steps: string[]; active: boolean; label?: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-bg/50 p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.18em] text-mute">
        <span>{label}</span>
        <span className={`flex items-center gap-1.5 ${active ? "text-cyan" : ""}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${active ? "animate-pulse bg-cyan" : "bg-mute/40"}`} /> {active ? "live" : "idle"}
        </span>
      </div>
      <ol className="flex flex-col items-stretch md:flex-row md:items-center">
        {steps.map((s, i) => (
          <Fragment key={s}>
            <motion.li
              className="relative shrink-0 rounded-lg border border-line bg-bg-2/80 px-3 py-2 text-center md:flex-1"
              initial={{ opacity: 0, y: 10 }}
              animate={active ? { opacity: 1, y: 0, borderColor: "rgba(85,223,255,0.35)" } : { opacity: 0.55, y: 0 }}
              transition={{ duration: 0.6, ease, delay: active ? i * 0.12 : 0 }}
            >
              <div className="font-mono text-[9.5px] text-cyan/80">{String(i + 1).padStart(2, "0")}</div>
              <div className="text-[12px] leading-tight text-ink/90">{s}</div>
            </motion.li>
            {i < steps.length - 1 && (
              <li aria-hidden className="relative mx-auto h-5 w-px shrink-0 bg-line md:mx-0 md:h-px md:w-auto md:min-w-4 md:flex-[0.35]">
                {active && (
                  <motion.span
                    className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan shadow-[0_0_8px_#55dfff] max-md:left-1/2 md:top-1/2"
                    animate={{ left: ["0%", "100%"], top: ["0%", "100%"] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.25, repeatDelay: 0.6 }}
                  />
                )}
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </div>
  );
}

function MoreButton({ open, onClick, more, less, controls }: { open: boolean; onClick: () => void; more: string; less: string; controls: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls={controls}
      className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/85 transition-colors hover:border-cyan/50 hover:text-cyan"
    >
      {open ? less : more}
      <ChevronDown size={13} className={`transition-transform duration-500 ${open ? "rotate-180" : ""}`} />
    </button>
  );
}

function RolePanel({ role, index, onActive }: { role: Role; index: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  const active = useInView(ref, { margin: "-42% 0px -42% 0px" });
  const seen = useInView(ref, { once: true, margin: "-15% 0px" });
  useEffect(() => {
    if (active) onActive(index);
  }, [active, index, onActive]);

  const Icon = role.kind === "Venture" ? Rocket : role.kind === "Teaching" ? GraduationCap : Briefcase;
  const [open, setOpen] = useState(false);

  return (
    <article id={`role-${role.id}`} ref={ref} className="scroll-mt-28" aria-labelledby={`role-h-${role.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={seen ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease }}
        className={`panel relative overflow-hidden rounded-2xl p-6 transition-colors duration-700 md:p-9 ${active ? "!border-cyan/30" : ""}`}
      >
        {/* glow that follows the active state */}
        <div aria-hidden className={`pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl transition-opacity duration-1000 ${active ? "opacity-100" : "opacity-0"}`} />

        <div className="relative flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em]">
          <span className="text-cyan">{role.period}</span>
          <span className="flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-mute">
            <Icon size={11} /> {role.kind}
          </span>
          <span className="text-mute">{role.place}</span>
        </div>

        <h3 id={`role-h-${role.id}`} className="relative mt-6">
          <span className="block overflow-hidden">
            <motion.span className="display block text-[clamp(2.2rem,4.6vw,4rem)] text-ink" initial={{ y: "105%" }} animate={seen ? { y: "0%" } : {}} transition={{ duration: 1.1, ease, delay: 0.1 }}>
              {role.org}
            </motion.span>
          </span>
          <span className="mt-2 block font-display text-lg tracking-tight text-cyan md:text-xl">{role.title}</span>
        </h3>

        <p className="relative mt-5 max-w-2xl font-display text-[clamp(1.1rem,1.7vw,1.4rem)] font-light leading-snug tracking-tight text-ink/85">{role.headline}</p>

        <div className="relative mt-7">
          <SystemFlow steps={role.flow} active={active} label={role.flowLabel} />
        </div>

        {/* At a glance */}
        <ul className="relative mt-7 space-y-2.5">
          {role.summary.map((line, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={seen ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.2 + i * 0.07 }}
              className="flex gap-3 text-[15px] leading-snug text-mute"
            >
              <span className="mt-[10px] h-px w-3 shrink-0 bg-cyan" />
              <span>
                <Rich text={line} />
              </span>
            </motion.li>
          ))}
        </ul>

        {/* Full detail on demand */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              id={`role-more-${role.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease }}
              className={`relative grid gap-3 overflow-hidden ${role.points.length > 1 ? "md:grid-cols-2" : ""}`}
            >
              {role.points.map((p, i) => (
                <li key={i} className={`rounded-xl border border-line bg-bg/40 p-4 md:p-5 ${i === 0 ? "mt-6 md:mt-6" : i === 1 ? "md:mt-6" : ""}`}>
                  {p.lead && <div className="mb-1.5 font-display text-[15px] font-medium leading-snug tracking-tight text-ink">{p.lead}</div>}
                  <p className="text-[13.5px] leading-relaxed text-mute">
                    <Rich text={p.text} />
                  </p>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {role.stack.map((s) => (
              <span key={s} className="rounded-full border border-line px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-mute">
                {s}
              </span>
            ))}
          </div>
          <MoreButton open={open} onClick={() => setOpen((o) => !o)} more="Show details" less="Show less" controls={`role-more-${role.id}`} />
        </div>
      </motion.div>
    </article>
  );
}

function RoleRail({ active, list }: { active: number; list: React.RefObject<HTMLDivElement | null> }) {
  const { scrollTo } = useExperience();
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 50%", "end 50%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <nav aria-label="Roles" className="relative">
      <div className="label mb-5 !text-[11px]">Roles · {String(roles.length).padStart(2, "0")}</div>
      <div className="relative pl-5">
        <div className="absolute bottom-1 left-0 top-1 w-px bg-line">
          <motion.div className="absolute inset-0 origin-top bg-cyan shadow-[0_0_10px_#55dfff]" style={{ scaleY: fill }} />
        </div>
        <ol className="space-y-1">
          {featured.map((r, i) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => scrollTo(`#role-${r.id}`)}
                aria-current={active === i ? "true" : undefined}
                className="group block w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-bg-2/60"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className={`font-display text-[17px] tracking-tight transition-colors duration-500 ${active === i ? "text-ink" : "text-ink/45 group-hover:text-ink/80"}`}>{r.org}</span>
                  <span className={`shrink-0 font-mono text-[10px] tracking-[0.12em] transition-colors ${active === i ? "text-cyan" : "text-mute"}`}>{r.period.split(" — ")[0]}</span>
                </div>
                <AnimatePresence initial={false}>
                  {active === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
                      <div className="pt-1 text-[12.5px] text-cyan">{r.title}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </li>
          ))}
        </ol>
        {earlier.length > 0 && (
          <button
            type="button"
            onClick={() => scrollTo("#earlier-roles")}
            className="mt-3 block px-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-mute transition-colors hover:text-cyan"
          >
            + {earlier.length} earlier roles
          </button>
        )}
      </div>
    </nav>
  );
}

function StatGrid({ stats }: { stats: { value: number; suffix: string; label: string; note: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.06} className="bg-bg-2/85 p-5 md:p-7">
          <div className="font-display text-[clamp(2.2rem,4vw,3.4rem)] font-medium leading-none tracking-tight text-ink">
            <CountUp value={s.value} suffix={s.suffix} />
          </div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan">{s.label}</div>
          <div className="mt-1 text-[12px] leading-snug text-mute">{s.note}</div>
        </Reveal>
      ))}
    </div>
  );
}

function SubHeader({ index, title, children }: { index: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-10 grid gap-6 md:grid-cols-12 md:items-end">
      <div className="md:col-span-7">
        <Reveal className="mb-4 flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.2em] text-cyan">{index}</span>
          <span className="h-px w-10 bg-cyan/40" />
        </Reveal>
        <MaskHeading as="h3" lines={[title]} className="display text-[clamp(2rem,4.4vw,3.8rem)] text-ink" />
      </div>
      {children && (
        <Reveal className="md:col-span-5" delay={0.15}>
          {children}
        </Reveal>
      )}
    </div>
  );
}

function Toolkit() {
  const [hover, setHover] = useState<string | null>(null);
  const used = hover ? whereUsed(hover) : [];
  return (
    <div>
      <SubHeader index="06.3" title="THE TOOLKIT.">
        <p className="text-[14.5px] leading-relaxed text-mute">Hover or tap a tool to see where it was used in production.</p>
      </SubHeader>

      <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((g, gi) => (
          <Reveal key={g.group} delay={(gi % 4) * 0.05} className="bg-bg-2/85 p-5 md:p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">{g.group}</div>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {g.items.map((it) => {
                const isHover = hover === it.name;
                const linked = whereUsed(it.name).length > 0;
                return (
                  <li key={it.name}>
                    <button
                      type="button"
                      onMouseEnter={() => setHover(it.name)}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(it.name)}
                      onBlur={() => setHover(null)}
                      onClick={() => setHover(isHover ? null : it.name)}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] transition-all duration-300 ${
                        isHover ? "border-cyan bg-cyan/15 text-ink shadow-[0_0_16px_rgb(85_223_255/0.25)]" : "border-line text-ink/80 hover:border-ink/30"
                      }`}
                    >
                      {linked && <span className="h-1 w-1 rounded-full bg-cyan" />}
                      {it.name}
                      {it.level && (
                        <span className="flex gap-0.5" aria-label={it.level} title={it.level}>
                          {[0, 1, 2].map((d) => (
                            <span key={d} className={`h-1 w-1 rounded-full ${d < (it.level === "Proficient" ? 3 : it.level === "Intermediate" ? 2 : 1) ? "bg-cyan/80" : "bg-mute/30"}`} />
                          ))}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        ))}
      </div>

      <div className="z-10 mt-4 flex min-h-[44px] flex-wrap items-center gap-3 rounded-xl border border-line bg-bg/85 px-4 py-3 backdrop-blur-md max-lg:sticky max-lg:bottom-20 font-mono text-[11px] tracking-[0.06em]" aria-live="polite">
        {hover ? (
          used.length ? (
            <>
              <span className="text-mute">{hover} →</span>
              {used.map((u) => (
                <span key={u} className="rounded-full bg-cyan/10 px-2.5 py-1 text-cyan">
                  {u}
                </span>
              ))}
            </>
          ) : (
            <span className="text-mute">{hover} — part of the wider toolkit (see CV)</span>
          )
        ) : (
          <span className="text-mute">
            <span className="mr-1.5 inline-block h-1 w-1 rounded-full bg-cyan align-middle" /> marks tools tied to a role · dots after a language show proficiency
          </span>
        )}
      </div>
    </div>
  );
}

function Teaching() {
  const [all, setAll] = useState(false);
  const rows = all ? teaching : teaching.filter((t) => t.key);
  return (
    <div>
      <SubHeader index="06.2" title="TEACHING & LEADERSHIP.">
        <p className="text-[14.5px] leading-relaxed text-mute">From leading teams of teaching assistants to bootcamps and college courses on model serving and RAG.</p>
      </SubHeader>
      <div className={`grid gap-10 ${judgingPhoto.src ? "lg:grid-cols-12" : ""}`}>
        {judgingPhoto.src && (
          <Reveal className="lg:col-span-4">
            <figure className="group lg:sticky lg:top-28">
              <div className="relative overflow-hidden rounded-2xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(judgingPhoto.src)}
                  alt={judgingPhoto.caption}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover saturate-[0.85] transition duration-[1.2s] ease-out-expo group-hover:scale-[1.04] group-hover:saturate-100"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent" />
                <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_100%,rgb(21_155_206/0.25),transparent)]" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-cyan">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan" /> Service
                  </div>
                  <div className="mt-1.5 font-display text-xl tracking-tight text-ink">{judgingPhoto.caption}</div>
                  {judgingPhoto.event && <div className="mt-0.5 text-[13px] text-mute">{judgingPhoto.event}</div>}
                </figcaption>
              </div>
            </figure>
          </Reveal>
        )}
        <div className={judgingPhoto.src ? "lg:col-span-8" : ""}>
      <StatGrid stats={teachingStats} />
      <ul id="teaching-list" className="mt-8 divide-y divide-line border-y border-line">
        {rows.map((t, i) => (
          <Reveal as="li" key={t.course} delay={Math.min(i, 6) * 0.03} className="group grid grid-cols-12 items-baseline gap-3 py-4 transition-colors hover:bg-bg-2/40 md:px-3">
            <span className="col-span-12 font-mono text-[10px] uppercase tracking-[0.14em] text-mute md:col-span-2">{t.period || "\u00a0"}</span>
            <span className={`col-span-12 font-display text-[16px] tracking-tight md:col-span-3 ${/Head|Senior|Instructor/.test(t.role) ? "text-cyan" : "text-ink/80"}`}>{t.role}</span>
            <span className="col-span-9 text-[14px] text-ink/85 md:col-span-5">{t.course}</span>
            <span className="col-span-3 text-right font-mono text-[10px] uppercase tracking-[0.12em] text-mute md:col-span-2">{t.org}</span>
          </Reveal>
        ))}
      </ul>
      {teaching.length > rows.length || all ? (
        <div className="mt-5">
          <MoreButton open={all} onClick={() => setAll((a) => !a)} more={`Show all ${teaching.length} roles`} less="Show fewer" controls="teaching-list" />
        </div>
      ) : null}
        </div>
      </div>
    </div>
  );
}

/** SCENE — Track 02: Engineering & professional experience. */
export default function Engineering() {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);

  return (
    <section id="experience" className="relative py-28 md:py-40" aria-label="Engineering experience">
      <div className="container-x">
        {/* Track opener */}
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-9">
            <Reveal className="mb-8 flex flex-wrap items-center gap-4">
              <span className="rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan">Track 02 · Engineering</span>
              <span className="font-mono text-[11px] tracking-[0.2em] text-cyan">06</span>
              <span className="h-px w-12 bg-cyan/40" />
              <span className="label">Professional experience</span>
            </Reveal>
            <MaskHeading lines={["FROM RESEARCH", <span key="b" className="text-outline">TO PRODUCTION.</span>]} className="display text-[clamp(2.4rem,6.4vw,6.2rem)] text-ink" />
          </div>
          <Reveal className="md:col-span-3" delay={0.2}>
            <p className="text-[15px] leading-relaxed text-mute">
              The same person who writes the papers builds the systems: <strong className="font-semibold text-ink">LLM serving, multi-agent pipelines, data platforms</strong> and products used by real people.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 md:mt-20">
          <StatGrid stats={engineeringStats} />
        </div>

        {/* Roles: sticky rail + scrolling panels */}
        <div className="mt-16 grid gap-10 md:mt-20 lg:grid-cols-12 lg:gap-14">
          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28">
              <SubHeaderSmall />
              <RoleRail active={active} list={list} />
            </div>
          </div>
          <div className="lg:hidden">
            <SubHeaderSmall />
          </div>
          <div ref={list} className="space-y-8 lg:col-span-8 lg:space-y-10">
            {featured.map((r, i) => (
              <RolePanel key={r.id} role={r} index={i} onActive={setActive} />
            ))}

            {earlier.length > 0 && (
              <div id="earlier-roles" className="scroll-mt-28">
                <div className="label mb-4">Earlier roles</div>
                <ul className="divide-y divide-line border-y border-line">
                  {earlier.map((r, i) => (
                    <Reveal as="li" key={r.id} delay={i * 0.05} className="grid gap-1 py-4 md:grid-cols-12 md:gap-4 md:px-2">
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-mute md:col-span-3 md:pt-1">{r.period}</span>
                      <span className="md:col-span-9">
                        <span className="font-display text-[17px] tracking-tight text-ink">
                          {r.title} <span className="text-mute">· {r.org}</span>
                        </span>
                        <span className="mt-1 block text-[14px] leading-snug text-mute">
                          <Rich text={r.summary[0]} />
                        </span>
                      </span>
                    </Reveal>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-24 md:mt-32">
          <Teaching />
        </div>

        <div className="mt-24 md:mt-32">
          <Toolkit />
        </div>
      </div>
    </section>
  );
}

function SubHeaderSmall() {
  return (
    <div className="mb-10">
      <div className="mb-3 flex items-center gap-3">
        <span className="font-mono text-[11px] tracking-[0.2em] text-cyan">06.1</span>
        <span className="h-px w-10 bg-cyan/40" />
      </div>
      <h3 className="display text-[clamp(2rem,3.4vw,3rem)] text-ink">
        WORK THAT <span className="text-outline">SHIPS.</span>
      </h3>
      <a href="#research" className="mt-4 hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-mute transition-colors hover:text-cyan lg:inline-flex">
        <GraduationCap size={12} /> Research roles are in Track 01 <ArrowUpRight size={11} />
      </a>
    </div>
  );
}
