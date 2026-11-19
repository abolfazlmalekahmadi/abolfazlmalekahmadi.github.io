"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { ResearchDomain } from "@/data/research";
import { mulberry32 } from "@/lib/noise";

const NODE_POS: [number, number, number][] = [
  [-2.1, 0.75, 0.2],
  [1.9, 1.05, -0.6],
  [-1.25, -1.25, 0.6],
  [2.15, -0.9, 0.3],
];

const CYAN = new THREE.Color("#55DFFF");

let glowTex: THREE.Texture | null = null;
function getGlow() {
  if (glowTex) return glowTex;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.12, "rgba(170,240,255,0.95)");
  grd.addColorStop(0.32, "rgba(85,223,255,0.35)");
  grd.addColorStop(1, "rgba(21,155,206,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  glowTex = new THREE.CanvasTexture(c);
  return glowTex;
}
const BLUE = new THREE.Color("#159BCE");

/** Scene objects whose screen positions drive the DOM labels. */
const registry: { nodes: (THREE.Object3D | null)[]; sats: (THREE.Object3D | null)[][] } = { nodes: [], sats: [] };

type Props = {
  /** DOM label per domain, positioned by projecting the node each frame. */
  labelEls: React.RefObject<(HTMLDivElement | null)[]>;
  /** DOM labels for the selected domain's topics. */
  topicEls: React.RefObject<(HTMLDivElement | null)[]>;
  /** DOM "click me" beacons centred on each node. */
  ringEls: React.RefObject<(HTMLDivElement | null)[]>;
  domains: ResearchDomain[];
  selected: number | null;
  hovered: number | null;
  onSelect: (i: number | null) => void;
  onHover: (i: number | null) => void;
  active: boolean;
  lowPower: boolean;
};

function DomainNode({ index, domain, selected, hovered, onSelect, onHover }: { index: number; domain: ResearchDomain } & Pick<Props, "selected" | "hovered" | "onSelect" | "onHover">) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Sprite>(null);
  const glow = useMemo(() => getGlow(), []);
  const orbit = useRef<THREE.Group>(null);
  const isSel = selected === index;
  const isHov = hovered === index;
  const pos = NODE_POS[index];

  const satellites = useMemo(
    () =>
      domain.topics.map((t, i) => {
        const a = (i / domain.topics.length) * Math.PI * 2;
        return { topic: t, pos: new THREE.Vector3(Math.cos(a) * 0.95, Math.sin(a) * 0.55, Math.sin(a) * 0.5) };
      }),
    [domain.topics],
  );

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (!group.current || !shell.current || !core.current || !orbit.current) return;
    const target = isSel ? 1.55 : isHov ? 1.25 : 1;
    const s = THREE.MathUtils.lerp(group.current.scale.x, target, 1 - Math.exp(-dt * 6));
    group.current.scale.setScalar(s);
    group.current.position.set(pos[0], pos[1] + Math.sin(t * 0.6 + index * 1.7) * 0.08, pos[2]);
    shell.current.rotation.x = t * 0.2 + index;
    shell.current.rotation.y = t * 0.3;
    orbit.current.rotation.y = t * (isSel ? 0.35 : 0.18);
    const m = core.current.material as THREE.SpriteMaterial;
    m.opacity = 0.7 + Math.sin(t * 2 + index) * 0.15 + (isHov || isSel ? 0.25 : 0);
    core.current.scale.setScalar(0.9 + Math.sin(t * 2 + index) * 0.06 + (isHov || isSel ? 0.25 : 0));
  });

  return (
    <group
      ref={(g) => {
        group.current = g;
        registry.nodes[index] = g;
      }}
    >
      {/* Invisible hit area */}
      <mesh
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onHover(index);
        }}
        onPointerOut={() => onHover(null)}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onSelect(isSel ? null : index);
        }}
      >
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <sprite ref={core}>
        <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <sprite scale={2.6}>
        <spriteMaterial map={glow} color={BLUE} transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <mesh ref={shell}>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshBasicMaterial color={BLUE} wireframe transparent opacity={isSel || isHov ? 0.55 : 0.25} />
      </mesh>
      <group ref={orbit}>
        {satellites.map((s, j) => (
          <group
            key={s.topic}
            position={s.pos}
            ref={(g) => {
              (registry.sats[index] ??= [])[j] = g;
            }}
          >
            <mesh>
              <sphereGeometry args={[0.035, 10, 10]} />
              <meshBasicMaterial color={CYAN} transparent opacity={isSel ? 1 : 0.6} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function Connections({ selected, hovered, lowPower }: { selected: number | null; hovered: number | null; lowPower: boolean }) {
  // Main links between all domains + a field of small neurons wired to them.
  const { geo, mat, pts, ptsMat, pairs } = useMemo(() => {
    const r = mulberry32(3);
    const pairs: [number, number][] = [];
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) pairs.push([i, j]);

    const N = lowPower ? 90 : 220;
    const neurons: THREE.Vector3[] = [];
    for (let i = 0; i < N; i++) {
      neurons.push(new THREE.Vector3((r() - 0.5) * 8, (r() - 0.5) * 4.6, (r() - 0.5) * 3 - 0.5));
    }
    const verts: number[] = [];
    const owner: number[] = [];
    const t: number[] = [];
    // domain ↔ domain (curved, subdivided)
    pairs.forEach(([a, b], pi) => {
      const A = new THREE.Vector3(...NODE_POS[a]);
      const B = new THREE.Vector3(...NODE_POS[b]);
      const mid = A.clone().add(B).multiplyScalar(0.5).add(new THREE.Vector3(0, 0, 0.8 + (pi % 3) * 0.3));
      const curve = new THREE.QuadraticBezierCurve3(A, mid, B);
      const p = curve.getPoints(40);
      for (let k = 0; k < p.length - 1; k++) {
        verts.push(p[k].x, p[k].y, p[k].z, p[k + 1].x, p[k + 1].y, p[k + 1].z);
        owner.push(10 + pi, 10 + pi);
        t.push(k / 40, (k + 1) / 40);
      }
    });
    // neuron → nearest domain, and neuron ↔ neuron
    neurons.forEach((n, i) => {
      let best = 0;
      let bd = Infinity;
      NODE_POS.forEach((p, j) => {
        const d = n.distanceTo(new THREE.Vector3(...p));
        if (d < bd) {
          bd = d;
          best = j;
        }
      });
      if (bd < 2.4) {
        verts.push(n.x, n.y, n.z, ...NODE_POS[best]);
        owner.push(best, best);
        t.push(0, 1);
      }
      const m = neurons[(i * 7 + 3) % N];
      if (n.distanceTo(m) < 1.6) {
        verts.push(n.x, n.y, n.z, m.x, m.y, m.z);
        owner.push(-1, -1);
        t.push(0, 1);
      }
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute("aOwner", new THREE.Float32BufferAttribute(owner, 1));
    geo.setAttribute("aT", new THREE.Float32BufferAttribute(t, 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uFocus: { value: -5 },
        uPairA: { value: -5 },
        uPairB: { value: -5 },
        uPairC: { value: -5 },
        uColA: { value: BLUE },
        uColB: { value: CYAN },
      },
      vertexShader: /* glsl */ `
        attribute float aOwner; attribute float aT;
        uniform float uTime, uFocus, uPairA, uPairB, uPairC;
        varying float vA; varying float vPulse;
        void main(){
          float lit = 0.0;
          if (aOwner >= 0.0 && aOwner < 4.0 && abs(aOwner - uFocus) < 0.5) lit = 1.0;
          if (aOwner >= 10.0 && (abs(aOwner - uPairA) < 0.5 || abs(aOwner - uPairB) < 0.5 || abs(aOwner - uPairC) < 0.5)) lit = 1.0;
          float base = aOwner >= 10.0 ? 0.32 : (aOwner >= 0.0 ? 0.13 : 0.06);
          float head = fract(uTime * 0.25 + aOwner * 0.137);
          vPulse = aOwner >= 10.0 ? exp(-pow((aT - head) * 10.0, 2.0)) : 0.0;
          vA = base + lit * 0.55 + vPulse * 0.6;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColA, uColB; varying float vA; varying float vPulse;
        void main(){ vec3 c = mix(uColA, uColB, clamp(vA, 0.0, 1.0)); gl_FragColor = vec4(c * vA, vA); }`,
    });

    const pg = new THREE.BufferGeometry();
    pg.setFromPoints(neurons);
    const ptsMat = new THREE.PointsMaterial({ color: CYAN, size: 0.035, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending });
    return { geo, mat, pts: pg, ptsMat, pairs };
  }, [lowPower]);

  useEffect(() => () => (geo.dispose(), mat.dispose(), pts.dispose(), ptsMat.dispose()), [geo, mat, pts, ptsMat]);

  useFrame((state) => {
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    const focus = selected ?? hovered;
    mat.uniforms.uFocus.value = focus ?? -5;
    const touching = focus === null ? [] : pairs.map((p, i) => (p.includes(focus) ? 10 + i : -5)).filter((v) => v > 0);
    mat.uniforms.uPairA.value = touching[0] ?? -5;
    mat.uniforms.uPairB.value = touching[1] ?? -5;
    mat.uniforms.uPairC.value = touching[2] ?? -5;
  });

  return (
    <>
      <lineSegments geometry={geo} material={mat} />
      <points geometry={pts} material={ptsMat} />
    </>
  );
}

const tmp = new THREE.Vector3();
function place(el: HTMLElement | null | undefined, obj: THREE.Object3D | null | undefined, camera: THREE.Camera, w: number, h: number, offsetY = 0, visible = true) {
  if (!el) return;
  if (!obj || !visible) {
    el.style.opacity = "0";
    return;
  }
  tmp.set(0, offsetY, 0);
  obj.localToWorld(tmp);
  tmp.project(camera);
  const behind = tmp.z > 1;
  el.style.opacity = behind ? "0" : "1";
  el.style.transform = `translate3d(${((tmp.x + 1) / 2) * w}px, ${((1 - tmp.y) / 2) * h}px, 0) translate(-50%, -50%)`;
}

function Labels({ labelEls, topicEls, ringEls, selected }: Pick<Props, "labelEls" | "topicEls" | "ringEls" | "selected">) {
  useFrame(({ camera, size }) => {
    registry.nodes.forEach((n, i) => {
      place(labelEls.current?.[i], n, camera, size.width, size.height, -0.72);
      place(ringEls.current?.[i], n, camera, size.width, size.height, 0);
    });
    const sats = selected !== null ? registry.sats[selected] ?? [] : [];
    for (let j = 0; j < 6; j++) place(topicEls.current?.[j], sats[j], camera, size.width, size.height, 0, selected !== null);
  });
  return null;
}

function CameraRig({ selected }: { selected: number | null }) {
  const { camera, size } = useThree();
  const look = useRef(new THREE.Vector3());
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const on = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);
  useFrame((_, dt) => {
    const narrow = size.width < 768;
    const k = 1 - Math.exp(-dt * 2.5);
    let target: THREE.Vector3;
    let lookAt: THREE.Vector3;
    if (selected === null) {
      // Fit the whole network horizontally (half-width ≈ 3.1 units incl. labels).
      const fitZ = 3.1 / (Math.tan(THREE.MathUtils.degToRad(21)) * (size.width / Math.max(size.height, 1)));
      target = new THREE.Vector3(pointer.current.x * 0.4, pointer.current.y * 0.25, Math.max(7.4, fitZ));
      lookAt = new THREE.Vector3(0, 0, 0);
    } else {
      const p = new THREE.Vector3(...NODE_POS[selected]);
      // Offset so the node sits left of the info panel on desktop.
      lookAt = p.clone().add(new THREE.Vector3(narrow ? 0 : 1.1, narrow ? -0.6 : 0, 0));
      target = p.clone().add(new THREE.Vector3(narrow ? 0 : 0.9, narrow ? -0.4 : 0.15, narrow ? 6.2 : 4.8));
    }
    camera.position.lerp(target, k);
    look.current.lerp(lookAt, k);
    camera.lookAt(look.current);
  });
  return null;
}

export default function DomainNetwork(props: Props) {
  const { domains, active, lowPower } = props;
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={lowPower ? 1 : [1, 1.75]}
      camera={{ position: [0, 0, 7.4], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => props.onSelect(null)}
      style={{ position: "absolute", inset: 0 }}
    >
      <CameraRig selected={props.selected} />
      <Labels labelEls={props.labelEls} topicEls={props.topicEls} ringEls={props.ringEls} selected={props.selected} />
      <Connections selected={props.selected} hovered={props.hovered} lowPower={lowPower} />
      {domains.map((d, i) => (
        <DomainNode key={d.id} index={i} domain={d} selected={props.selected} hovered={props.hovered} onSelect={props.onSelect} onHover={props.onHover} />
      ))}
    </Canvas>
  );
}
