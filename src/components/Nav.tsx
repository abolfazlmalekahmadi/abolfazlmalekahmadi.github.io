"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navItems } from "@/data/sections";
import { site } from "@/data/site";
import { useExperience } from "@/lib/experience";
import Brand from "./Brand";
import { useActiveSection } from "./useActiveSection";

export default function Nav() {
  const { scrollTo, introDone } = useExperience();
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollTo(`#${id}`);
  };

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-5"
      initial={{ y: -40, opacity: 0 }}
      animate={introDone ? { y: 0, opacity: 1 } : { y: -40, opacity: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
    >
      <nav
        aria-label="Primary"
        className={`flex w-full max-w-[1280px] items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-700 md:px-6 ${
          scrolled ? "border-line bg-bg/70 backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      >
        <a
          href="#identity"
          onClick={(e) => {
            e.preventDefault();
            go("identity");
          }}
          className="flex items-center gap-3"
          data-cursor="TOP"
        >
          <Brand showRole />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.id);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-full px-3.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isActive ? "text-cyan" : "text-mute hover:text-ink"
                  }`}
                >
                  {isActive && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-cyan/10 ring-1 ring-cyan/25" transition={{ type: "spring", stiffness: 300, damping: 32 }} />
                  )}
                  <span className="relative">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {site.phd.open && (
          <a
            href="#phd"
            onClick={(e) => {
              e.preventDefault();
              go("phd");
            }}
            data-cursor="PHD"
            className={`hidden items-center gap-2 rounded-full border px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors lg:inline-flex ${
              active === "phd" ? "border-cyan bg-cyan text-bg" : "border-cyan/40 bg-cyan/10 text-cyan hover:bg-cyan/20"
            }`}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-current" />
            </span>
            PhD
          </a>
        )}

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 -z-10 flex flex-col justify-center bg-bg/95 px-8 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ul className="space-y-2">
              {navItems.map((item, i) => (
                <motion.li key={item.id} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 * i, ease: [0.16, 1, 0.3, 1], duration: 0.8 }}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.id);
                    }}
                    className={`flex items-baseline gap-4 py-2 font-display text-4xl tracking-tight ${active === item.id ? "text-cyan" : "text-ink"}`}
                  >
                    <span className="font-mono text-xs text-mute">0{i + 1}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            {site.phd.open && (
              <a
                href="#phd"
                onClick={(e) => {
                  e.preventDefault();
                  go("phd");
                }}
                className="mt-10 inline-flex items-center gap-3 self-start rounded-full border border-cyan/40 bg-cyan/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan" /> {site.phd.badge}
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
