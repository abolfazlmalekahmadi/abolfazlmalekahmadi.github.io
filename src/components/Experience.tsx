"use client";

import type { ReactNode } from "react";
import { ExperienceProvider } from "@/lib/experience";
import Assistant from "./assistant/Assistant";
import Background from "./Background";
import Cursor from "./Cursor";
import Grain from "./Grain";
import Intro from "./Intro";
import Nav from "./Nav";
import ScrollRail from "./ScrollRail";

/** Global chrome around the page: WebGL layer, intro, nav, cursor, assistant. */
export default function Experience({ children }: { children: ReactNode }) {
  return (
    <ExperienceProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg">
        Skip to content
      </a>
      <Background />
      <Intro />
      <Nav />
      <ScrollRail />
      <main id="main" className="relative z-10">
        {children}
      </main>
      <Assistant />
      <Grain />
      <Cursor />
    </ExperienceProvider>
  );
}
