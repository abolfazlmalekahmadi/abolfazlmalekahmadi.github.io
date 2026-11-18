"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { sceneState } from "@/lib/sceneStore";
import { buildBrain } from "./brainGeometry";
import {
  dustFragment,
  dustVertex,
  glowFragment,
  glowVertex,
  linesFragment,
  linesVertex,
  pointsFragment,
  pointsVertex,
} from "./shaders";

type Quality = "high" | "low";

const COLORS = {
  deep: new THREE.Color("#1747c9"),
  primary: new THREE.Color("#159BCE"),
  cyan: new THREE.Color("#55DFFF"),
  white: new THREE.Color("#dff6ff"),
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function Brain({ quality, reducedMotion }: { quality: Quality; reducedMotion: boolean }) {
  const { size, gl } = useThree();
  const data = useMemo(
    () =>
      buildBrain(
        quality === "high" ? { points: 9000, curves: 300, seed: 11 } : { points: 3800, curves: 120, seed: 11 },
      ),
    [quality],
  );

  const group = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Mesh>(null);
  const brainMatrix = useMemo(() => new THREE.Matrix4(), []);
  const smooth = useRef({ px: 0, py: 0, x: 0, y: 0, s: 1 });
  const wave = useRef({ value: 9, next: 2.5, start: -1 });

  const shared = useMemo(
    () => ({
      uTime: { value: 0 },
      uAssemble: { value: 0 },
      uMorph: { value: 0 },
      uTravel: { value: 0 },
      uBurst: { value: 0 },
      uOpacity: { value: 1 },
      uWave: { value: 9 },
      uAspect: { value: 1 },
      uRepel: { value: reducedMotion ? 0 : 1 },
      uMouse: { value: new THREE.Vector2(10, 10) },
      uBrainMatrix: { value: brainMatrix },
    }),
    [brainMatrix, reducedMotion],
  );

  const pointsMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: pointsVertex,
        fragmentShader: pointsFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          ...shared,
          uSize: { value: quality === "high" ? 2.1 : 2.6 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
          uColA: { value: COLORS.primary },
          uColB: { value: COLORS.cyan },
          uColC: { value: COLORS.white },
        },
      }),
    [shared, quality, gl],
  );

  const linesMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: linesVertex,
        fragmentShader: linesFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { ...shared, uColA: { value: COLORS.deep.clone().lerp(COLORS.primary, 0.45) }, uColB: { value: COLORS.cyan } },
      }),
    [shared],
  );

  const glowMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: glowVertex,
        fragmentShader: glowFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color("#0f4fa8") }, uOpacity: { value: 0.5 } },
      }),
    [],
  );

  const pointsGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.points.brain, 3));
    g.setAttribute("aTunnel", new THREE.BufferAttribute(data.points.tunnel, 3));
    g.setAttribute("aScatter", new THREE.BufferAttribute(data.points.scatter, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(data.points.seed, 4));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 60);
    return g;
  }, [data]);

  const linesGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.lines.brain, 3));
    g.setAttribute("aTunnel", new THREE.BufferAttribute(data.lines.tunnel, 3));
    g.setAttribute("aScatter", new THREE.BufferAttribute(data.lines.scatter, 3));
    g.setAttribute("aCurve", new THREE.BufferAttribute(data.lines.curve, 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 60);
    return g;
  }, [data]);

  useEffect(
    () => () => {
      pointsGeo.dispose();
      linesGeo.dispose();
      pointsMat.dispose();
      linesMat.dispose();
      glowMat.dispose();
    },
    [pointsGeo, linesGeo, pointsMat, linesMat, glowMat],
  );

  useFrame((state, delta) => {
    const s = sceneState;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const mobile = size.width < 768;
    const aspect = size.width / Math.max(size.height, 1);

    // ── Layout ───────────────────────────────────────────────────────
    const cam = state.camera as THREE.PerspectiveCamera;
    const halfW = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * 5.2 * aspect;
    const heroX = mobile ? 0 : Math.min(halfW * 0.4, 2.4);
    const heroY = mobile ? 0.75 : -0.05;
    const heroScale = mobile ? 0.68 : Math.min(1.08, 0.55 + aspect * 0.3);
    const center = Math.max(s.introCenter, s.heroShift, s.converge);
    const k = 1 - Math.exp(-dt * 4);
    const sm = smooth.current;
    sm.x = lerp(sm.x, lerp(heroX, 0, center), k);
    sm.y = lerp(sm.y, lerp(heroY, 0, center) + s.introCenter * (mobile ? 0.55 : 0.32), k);
    const targetScale = lerp(heroScale, mobile ? 0.85 : 1.05, s.introCenter) * (1 + s.heroShift * 0.45);
    sm.s = lerp(sm.s, targetScale, k);

    sm.px = lerp(sm.px, s.pointer.x, 1 - Math.exp(-dt * 2.5));
    sm.py = lerp(sm.py, s.pointer.y, 1 - Math.exp(-dt * 2.5));

    if (group.current) {
      const spin = reducedMotion ? t * 0.03 : t * 0.11;
      group.current.position.set(sm.x, sm.y, 0);
      group.current.rotation.set(0.12 + sm.py * 0.18, Math.PI / 2 + spin + sm.px * 0.45, 0);
      group.current.scale.setScalar(sm.s);
      group.current.updateMatrixWorld();
      brainMatrix.copy(group.current.matrixWorld);
    }

    // ── Camera ───────────────────────────────────────────────────────
    cam.position.x = lerp(cam.position.x, sm.px * 0.25, k);
    cam.position.y = lerp(cam.position.y, sm.py * 0.15, k);
    cam.position.z = 5.2 - s.dolly * 2.7;
    cam.lookAt(0, 0, -2);

    // ── Uniforms ─────────────────────────────────────────────────────
    const morph = s.morph * (1 - s.converge);
    const opacity = (1 - s.dim * 0.74) * (1 - s.fadeOut * 0.8);
    shared.uTime.value = t;
    shared.uAssemble.value = s.assemble;
    shared.uMorph.value = morph;
    shared.uTravel.value = s.travel + t * 0.35 * morph;
    shared.uBurst.value = s.burst;
    shared.uOpacity.value = opacity;
    shared.uAspect.value = aspect;
    shared.uMouse.value.set(s.pointer.x === 0 && s.pointer.y === 0 ? 10 : s.pointer.x, s.pointer.y);

    // Occasional sweeps of activity, at irregular intervals.
    const w = wave.current;
    if (w.start < 0 && t > w.next) w.start = t;
    if (w.start >= 0) {
      const p = (t - w.start) / 1.8;
      w.value = lerp(1.7, -1.7, p);
      if (p >= 1) {
        w.start = -1;
        w.next = t + 4 + Math.random() * 6;
        w.value = 9;
      }
    }
    shared.uWave.value = w.value;

    if (glow.current) {
      glow.current.position.set(sm.x, sm.y, -0.8);
      glow.current.scale.setScalar(sm.s * 5.2);
      glowMat.uniforms.uOpacity.value = 0.55 * (1 - morph) * s.assemble * opacity;
    }
  });

  return (
    <>
      <mesh ref={glow} material={glowMat} renderOrder={-1}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <group ref={group} />
      <lineSegments geometry={linesGeo} material={linesMat} frustumCulled={false} />
      <points geometry={pointsGeo} material={pointsMat} frustumCulled={false} />
    </>
  );
}

function Dust({ count }: { count: number }) {
  const { gl } = useThree();
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = -22 + Math.random() * 24;
      seed[i] = Math.random();
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count]);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: dustVertex,
        fragmentShader: dustFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
          uOpacity: { value: 0.8 },
          uColor: { value: new THREE.Color("#4fbfe8") },
        },
      }),
    [gl],
  );
  useEffect(() => () => (geo.dispose(), mat.dispose()), [geo, mat]);
  useFrame((state) => {
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uOpacity.value = 0.8 * Math.min(1, 0.25 + sceneState.assemble);
  });
  return <points geometry={geo} material={mat} frustumCulled={false} />;
}

export default function NeuralScene({ lowPower, reducedMotion }: { lowPower: boolean; reducedMotion: boolean }) {
  const [quality, setQuality] = useState<Quality>(lowPower ? "low" : "high");
  const [dpr, setDpr] = useState(lowPower ? 1 : 1.5);

  // Pointer → normalised device coords, shared with the scene.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => {
      sceneState.pointer.x = 0;
      sceneState.pointer.y = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 5.2], fov: 38, near: 0.1, far: 80 }}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#05080D"]} />
      <PerformanceMonitor
        onDecline={() => {
          setDpr(1);
          setQuality("low");
        }}
        flipflops={2}
      />
      <Dust count={quality === "high" ? 1400 : 600} />
      <Brain quality={quality} reducedMotion={reducedMotion} />
      {quality === "high" && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.12} luminanceSmoothing={0.3} radius={0.72} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
