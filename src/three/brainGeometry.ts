import { createNoise3D, mulberry32 } from "@/lib/noise";

/**
 * Procedurally grows a brain made of glowing points and flowing filaments.
 *
 * Coordinates: x = left/right, y = up, z = front(+)/back(-).
 * Every vertex also gets a "tunnel" position (world space) and a "scatter"
 * position (world space) so the shader can morph between the intro swarm,
 * the brain and the travel tunnel without rebuilding any geometry.
 */

type V3 = [number, number, number];

const SCALE = 1.22;
export const TUNNEL_NEAR = 6;
export const TUNNEL_FAR = -34;
const TUNNEL_LEN = TUNNEL_NEAR - TUNNEL_FAR;

export type BrainBuffers = {
  points: {
    count: number;
    brain: Float32Array;
    tunnel: Float32Array;
    scatter: Float32Array;
    /** x: random, y: size, z: colour mix, w: kind (0 surface, 1 inner, 2 dust) */
    seed: Float32Array;
  };
  lines: {
    count: number;
    brain: Float32Array;
    tunnel: Float32Array;
    scatter: Float32Array;
    /** x: position along curve 0..1, y: curve seed, z: curve brightness */
    curve: Float32Array;
  };
};

export function buildBrain(opts: { points: number; curves: number; seed?: number }): BrainBuffers {
  const rand = mulberry32(opts.seed ?? 7);
  const noise = createNoise3D(rand);

  const norm = (v: V3): V3 => {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  };
  const randDir = (): V3 => {
    const u = rand() * 2 - 1;
    const t = rand() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    return [s * Math.cos(t), u, s * Math.sin(t)];
  };

  /** Ridged multi-octave noise → gyri and sulci. */
  const folds = (x: number, y: number, z: number) => {
    let f = 0;
    let amp = 1;
    let freq = 5.2;
    for (let o = 0; o < 3; o++) {
      const n = 1 - Math.abs(noise(x * freq, y * freq, z * freq));
      f += n * n * amp;
      amp *= 0.45;
      freq *= 2.1;
    }
    return f / 1.65;
  };

  /** Cerebrum surface for a unit direction. `depth` < 1 pulls inside. */
  const cerebrum = (d: V3, depth = 1): V3 => {
    const hemi = d[0] >= 0 ? 1 : -1;
    const ax = Math.abs(d[0]);
    const zf = d[2];
    let x = ax * 0.64;
    let y = d[1] * 0.6 * (1 + 0.07 * zf - 0.1 * zf * zf);
    const z = zf * 0.93;

    // Flatten the base; let the temporal lobes hang lower at the sides.
    const temporal = Math.exp(-((z - 0.1) ** 2) / 0.12) * Math.min(1, Math.max(0, (ax - 0.35) / 0.4));
    const base = -0.16 - 0.16 * temporal;
    if (y < base) y = base + (y - base) * (0.38 + 0.5 * temporal);
    // Frontal pole slightly narrower, occipital slightly pointed.
    x *= 1 - 0.12 * Math.max(0, zf) ** 2;

    // Lateral (Sylvian) fissure groove.
    let groove = 0;
    if (ax > 0.45 && z > -0.45 && z < 0.55) {
      const line = -0.05 - 0.28 * (z - 0.4);
      groove = Math.exp(-((y - line) ** 2) / 0.0016) * 0.06;
    }
    // Longitudinal fissure: pull the medial top edge down.
    const medial = Math.exp(-(ax * ax) / 0.004) * Math.max(0, d[1]) * 0.08;

    const fold = folds(x * hemi, y, z);
    const disp = 1 + 0.085 * fold - 0.045 - groove;
    x = (x * disp + 0.035) * depth;
    y = (y * disp - medial) * depth;
    return [x * hemi * SCALE, y * SCALE, z * disp * depth * SCALE];
  };

  const cerebellum = (d: V3, depth = 1): V3 => {
    const hemi = d[0] >= 0 ? 1 : -1;
    const stri = 1 + 0.035 * Math.sin(d[1] * 34 + d[2] * 6);
    const r = stri * depth;
    const x = (Math.abs(d[0]) * 0.46 * r + 0.015) * hemi;
    const y = d[1] * 0.22 * r - 0.4;
    const z = d[2] * 0.3 * r - 0.62;
    return [x * SCALE, y * SCALE, z * SCALE];
  };

  const stem = (t: number, a: number, depth = 1): V3 => {
    const r = (0.11 - 0.03 * t) * depth;
    const cx = 0;
    const cy = -0.28 - 0.62 * t;
    const cz = -0.24 - 0.14 * t;
    return [(cx + Math.cos(a) * r) * SCALE, cy * SCALE, (cz + Math.sin(a) * r) * SCALE];
  };

  const tunnelPoint = (angleBias?: number): V3 => {
    const a = angleBias ?? rand() * Math.PI * 2;
    const r = 1.5 + Math.sqrt(rand()) * 2.8;
    const z = TUNNEL_FAR + rand() * TUNNEL_LEN;
    return [Math.cos(a) * r, Math.sin(a) * r, z];
  };

  const scatterPoint = (): V3 => {
    const d = randDir();
    const r = 3.5 + rand() * 6;
    return [d[0] * r * 1.4, d[1] * r * 0.8, d[2] * r * 0.8 - 3];
  };

  // ── Points ──────────────────────────────────────────────────────────
  const P = opts.points;
  const pb = new Float32Array(P * 3);
  const pt = new Float32Array(P * 3);
  const ps = new Float32Array(P * 3);
  const pseed = new Float32Array(P * 4);

  for (let i = 0; i < P; i++) {
    const roll = rand();
    let v: V3;
    let kind = 0;
    if (roll < 0.7) {
      const inner = rand() < 0.14;
      v = cerebrum(randDir(), inner ? 0.35 + rand() * 0.55 : 0.97 + rand() * 0.05);
      kind = inner ? 1 : 0;
    } else if (roll < 0.84) {
      v = cerebellum(randDir(), 0.9 + rand() * 0.12);
    } else if (roll < 0.89) {
      v = stem(rand(), rand() * Math.PI * 2, 0.8 + rand() * 0.3);
    } else {
      // Halo dust around the brain.
      const d = randDir();
      const r = 1.25 + rand() * 1.3;
      v = [d[0] * r, d[1] * r * 0.8, d[2] * r * 1.1];
      kind = 2;
    }
    pb.set(v, i * 3);
    pt.set(tunnelPoint(), i * 3);
    ps.set(scatterPoint(), i * 3);
    const big = rand() < 0.04;
    pseed[i * 4] = rand();
    pseed[i * 4 + 1] = kind === 2 ? 0.5 + rand() * 0.6 : big ? 2.2 + rand() * 1.5 : 0.6 + rand() * 0.9;
    pseed[i * 4 + 2] = rand();
    pseed[i * 4 + 3] = kind;
  }

  // ── Filaments ───────────────────────────────────────────────────────
  type Curve = V3[];
  const curves: Curve[] = [];
  const C = opts.curves;

  for (let c = 0; c < C; c++) {
    const roll = rand();
    const pts: Curve = [];
    const steps = 34 + Math.floor(rand() * 46);
    const seedOffset = rand() * 100;

    if (roll < 0.86) {
      // Wander across the cortex like a fibre bundle.
      const depth = rand() < 0.25 ? 0.55 + rand() * 0.35 : 0.985 + rand() * 0.04;
      let d = randDir();
      let h = norm([rand() - 0.5, rand() - 0.5, rand() - 0.5]);
      const step = 0.03 + rand() * 0.02;
      for (let k = 0; k < steps; k++) {
        pts.push(cerebrum(d, depth));
        // Project heading onto tangent plane, then bend it with noise.
        const dot = h[0] * d[0] + h[1] * d[1] + h[2] * d[2];
        h = norm([h[0] - dot * d[0], h[1] - dot * d[1], h[2] - dot * d[2]]);
        const bend = noise(d[0] * 2.2 + seedOffset, d[1] * 2.2, d[2] * 2.2) * 1.4;
        // Rotate h around d by `bend` (Rodrigues).
        const cs = Math.cos(bend);
        const sn = Math.sin(bend);
        const cross: V3 = [d[1] * h[2] - d[2] * h[1], d[2] * h[0] - d[0] * h[2], d[0] * h[1] - d[1] * h[0]];
        h = norm([h[0] * cs + cross[0] * sn, h[1] * cs + cross[1] * sn, h[2] * cs + cross[2] * sn]);
        d = norm([d[0] + h[0] * step, d[1] + h[1] * step, d[2] + h[2] * step]);
      }
    } else if (roll < 0.94) {
      // Cerebellum: follow its horizontal folia.
      let a = rand() * Math.PI * 2;
      const yb = rand() * 1.6 - 0.8;
      const da = (0.025 + rand() * 0.025) * (rand() < 0.5 ? -1 : 1);
      for (let k = 0; k < steps; k++) {
        const yy = yb + Math.sin(k * 0.2 + seedOffset) * 0.08;
        const s = Math.sqrt(Math.max(0, 1 - yy * yy));
        pts.push(cerebellum([s * Math.cos(a), yy, s * Math.sin(a)], 1.02));
        a += da;
      }
    } else {
      // Brain stem: long vertical fibres.
      let a = rand() * Math.PI * 2;
      for (let k = 0; k < steps; k++) {
        const t = k / (steps - 1);
        pts.push(stem(t, a, 1.02));
        a += 0.02;
      }
    }
    curves.push(pts);
  }

  let segVerts = 0;
  for (const cv of curves) segVerts += (cv.length - 1) * 2;

  const lb = new Float32Array(segVerts * 3);
  const lt = new Float32Array(segVerts * 3);
  const ls = new Float32Array(segVerts * 3);
  const lc = new Float32Array(segVerts * 3);

  let o = 0;
  curves.forEach((cv) => {
    const cseed = rand();
    const bright = 0.4 + rand() * 0.6;
    const angle = rand() * Math.PI * 2;
    const radius = 1.4 + Math.sqrt(rand()) * 2.6;
    const z0 = TUNNEL_FAR + rand() * TUNNEL_LEN;
    const dz = 0.05 + rand() * 0.05;
    const sc = scatterPoint();
    const n = cv.length;

    const tunnelAt = (k: number): V3 => {
      const a = angle + k * 0.006;
      return [Math.cos(a) * radius, Math.sin(a) * radius, z0 - k * dz];
    };
    const scatterAt = (k: number): V3 => [sc[0] + k * 0.02, sc[1], sc[2] - k * 0.02];

    for (let k = 0; k < n - 1; k++) {
      for (const kk of [k, k + 1]) {
        lb.set(cv[kk], o * 3);
        lt.set(tunnelAt(kk), o * 3);
        ls.set(scatterAt(kk), o * 3);
        lc[o * 3] = kk / (n - 1);
        lc[o * 3 + 1] = cseed;
        lc[o * 3 + 2] = bright;
        o++;
      }
    }
  });

  return {
    points: { count: P, brain: pb, tunnel: pt, scatter: ps, seed: pseed },
    lines: { count: segVerts, brain: lb, tunnel: lt, scatter: ls, curve: lc },
  };
}
