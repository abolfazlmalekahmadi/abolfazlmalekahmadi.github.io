"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { detectLowPower, hasWebGL } from "@/lib/hooks";
import { useExperience } from "@/lib/experience";

const NeuralScene = dynamic(() => import("@/three/NeuralScene"), { ssr: false });

/** Fixed full-screen WebGL layer behind every section. */
export default function Background() {
  const { reducedMotion } = useExperience();
  const [mode, setMode] = useState<"pending" | "webgl" | "fallback">("pending");
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    setLowPower(detectLowPower());
    setMode(hasWebGL() ? "webgl" : "fallback");
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 z-0 bg-bg">
      {mode === "webgl" && <NeuralScene lowPower={lowPower} reducedMotion={reducedMotion} />}
      {mode === "fallback" && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(40% 45% at 68% 48%, rgb(21 155 206 / 0.28), transparent 70%), radial-gradient(25% 30% at 68% 48%, rgb(85 223 255 / 0.18), transparent 70%)",
          }}
        />
      )}
      <div className="vignette" />
    </div>
  );
}
