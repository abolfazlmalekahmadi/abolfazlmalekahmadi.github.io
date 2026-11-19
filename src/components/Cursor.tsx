"use client";

import { useEffect, useRef, useState } from "react";
import { useIsTouch } from "@/lib/hooks";

/**
 * Glowing dot + trailing ring. Elements opt into a contextual label with
 * `data-cursor="EXPLORE"`; buttons and links grow the ring automatically.
 */
export default function Cursor() {
  const touch = useIsTouch();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (touch) return;
    document.documentElement.classList.add("has-cursor");
    const target = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      target.x = e.clientX;
      target.y = e.clientY;
      setVisible(true);
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button, [role=button], input[type=range]");
      setLabel(el?.dataset.cursor ?? null);
      setActive(!!el);
    };
    const onLeave = () => setVisible(false);
    const onScroll = () => {
      const el = (document.elementFromPoint(target.x, target.y) as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button, [role=button], input[type=range]");
      setLabel(el?.dataset.cursor ?? null);
      setActive(!!el);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const loop = () => {
      ringPos.x += (target.x - ringPos.x) * 0.16;
      ringPos.y += (target.y - ringPos.y) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [touch]);

  if (touch) return null;

  const size = label ? 84 : active ? 54 : 34;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]" style={{ opacity: visible ? 1 : 0, transition: "opacity .3s" }}>
      <div ref={ring} className="absolute left-0 top-0">
        <div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan/60 transition-[width,height,background-color,border-color] duration-500 ease-out-expo"
          style={{
            width: size,
            height: size,
            backgroundColor: label ? "rgb(85 223 255 / 0.12)" : "transparent",
            borderColor: active ? "rgb(85 223 255 / 0.9)" : undefined,
            backdropFilter: label ? "blur(4px)" : undefined,
          }}
        >
          <span
            className="font-mono text-[10px] tracking-[0.2em] text-cyan transition-opacity duration-300"
            style={{ opacity: label ? 1 : 0 }}
          >
            {label}
          </span>
        </div>
      </div>
      <div ref={dot} className="absolute left-0 top-0">
        <div
          className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan transition-opacity"
          style={{ boxShadow: "0 0 10px 2px rgb(85 223 255 / 0.8)", opacity: label ? 0 : 1 }}
        />
      </div>
    </div>
  );
}
