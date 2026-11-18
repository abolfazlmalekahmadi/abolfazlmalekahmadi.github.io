/**
 * Mutable, render-loop-friendly state shared between the DOM (GSAP /
 * ScrollTrigger) and the WebGL scene. It is deliberately NOT React state:
 * it changes every frame and must never trigger re-renders.
 */
export const sceneState = {
  /** 0 → particles scattered, 1 → brain assembled (intro). */
  assemble: 0,
  /** 1 → brain centred for the intro, 0 → hero layout. */
  introCenter: 1,
  /** Camera push toward the core (intro "enter" / finale). */
  dolly: 0,
  /** Radial expansion of the network (intro "enter"). */
  burst: 0,
  /** Hero → centre + expand as scrolling begins. */
  heroShift: 0,
  /** Brain → particle tunnel. */
  morph: 0,
  /** Distance travelled through the tunnel. */
  travel: 0,
  /** Dims the whole scene behind reading-heavy sections. */
  dim: 0,
  /** Finale: everything converges back into the core. */
  converge: 0,
  /** Finale: fade the core toward darkness. */
  fadeOut: 0,
  /** Normalised pointer, -1..1. */
  pointer: { x: 0, y: 0 },
};

export type SceneState = typeof sceneState;
