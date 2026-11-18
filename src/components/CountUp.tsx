"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 2 }: { value: number; decimals?: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: setV });
    return () => c.stop();
  }, [inView, value, duration]);
  const text = v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span ref={ref} aria-label={`${prefix}${value.toLocaleString("en-US", { minimumFractionDigits: decimals })}${suffix}`}>
      <span aria-hidden>
        {prefix}
        {text}
        {suffix}
      </span>
    </span>
  );
}
