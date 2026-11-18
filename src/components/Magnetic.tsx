"use client";

import { useRef, type ReactNode } from "react";
import { useIsTouch } from "@/lib/hooks";

/** Pulls its child toward the pointer while hovered. */
export default function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const touch = useIsTouch();

  const onMove = (e: React.PointerEvent) => {
    if (touch || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`inline-block transition-transform duration-500 ease-out-expo will-change-transform ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
