/** GLSL for the neural brain. Both materials share the same morph logic. */

const common = /* glsl */ `
  uniform float uTime;
  uniform float uAssemble;
  uniform float uMorph;
  uniform float uTravel;
  uniform float uBurst;
  uniform float uOpacity;
  uniform float uWave;
  uniform float uAspect;
  uniform float uRepel;
  uniform vec2 uMouse;
  uniform mat4 uBrainMatrix;

  attribute vec3 aTunnel;
  attribute vec3 aScatter;

  const float T_NEAR = 6.0;
  const float T_FAR = -34.0;

  vec3 tunnelWorld(vec3 t, out float zf) {
    float len = T_NEAR - T_FAR;
    float z = mod(t.z - T_FAR + uTravel, len) + T_FAR;
    float ang = uTime * 0.035 + z * 0.035;
    float c = cos(ang);
    float s = sin(ang);
    zf = smoothstep(T_FAR, T_FAR + 9.0, z) * smoothstep(T_NEAR, 2.5, z);
    return vec3(t.x * c - t.y * s, t.x * s + t.y * c, z);
  }

  // Shared morph: scatter → brain (assemble) → tunnel (morph).
  vec3 morphPosition(vec3 brainLocal, float seed, out float tunnelMix, out float tunnelFade, out float assembled) {
    vec3 b = brainLocal * (1.0 + uBurst * (0.35 + seed * 0.9));
    vec3 bw = (uBrainMatrix * vec4(b, 1.0)).xyz;
    vec3 tw = tunnelWorld(aTunnel, tunnelFade);
    tunnelMix = smoothstep(seed * 0.4, seed * 0.4 + 0.6, uMorph);
    vec3 p = mix(bw, tw, tunnelMix);
    assembled = smoothstep(seed * 0.55, seed * 0.55 + 0.45, uAssemble);
    float e = assembled * assembled * (3.0 - 2.0 * assembled);
    return mix(aScatter, p, e);
  }

  // Pushes geometry away from the cursor in screen space.
  void repel(inout vec4 clip, float strength, out float hit) {
    vec2 ndc = clip.xy / clip.w;
    vec2 d = ndc - uMouse;
    d.x *= uAspect;
    float l = length(d);
    hit = smoothstep(0.32, 0.0, l) * strength;
    vec2 dir = d / max(l, 1e-4);
    dir.x /= uAspect;
    clip.xy += dir * hit * 0.07 * clip.w;
  }
`;

export const pointsVertex = /* glsl */ `
  ${common}
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uColA;
  uniform vec3 uColB;
  uniform vec3 uColC;
  attribute vec4 aSeed;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float s = aSeed.x;
    vec3 local = position + 0.012 * vec3(
      sin(uTime * 0.7 + s * 40.0),
      sin(uTime * 0.9 + s * 23.0),
      cos(uTime * 0.8 + s * 31.0)
    );
    float tm; float tf; float asmb;
    vec3 p = morphPosition(local, s, tm, tf, asmb);
    vec4 mv = viewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float hit;
    repel(gl_Position, uRepel * (1.0 - tm), hit);

    // A pulse of activity sweeping front→back through the brain.
    float wave = exp(-pow(position.z - uWave, 2.0) * 18.0) * (1.0 - tm);
    float flick = 0.55 + 0.45 * sin(uTime * (0.8 + s * 2.5) + s * 100.0);

    float size = uSize * aSeed.y * (1.0 + hit * 1.6 + wave * 0.8) * (1.0 + tm * 1.6);
    gl_PointSize = min(size * uPixelRatio * (8.0 / max(-mv.z, 0.5)), 42.0 * uPixelRatio);

    vec3 col = mix(uColA, uColB, aSeed.z);
    col = mix(col, uColC, step(0.93, aSeed.z) * 0.8);
    vColor = col + wave * vec3(0.35, 0.75, 1.0) + hit * vec3(0.2, 0.5, 0.6);

    float dust = step(1.5, aSeed.w);
    float base = mix(0.85, 0.35, dust);
    vAlpha = base * flick * mix(1.0, tf * 1.5, tm) * uOpacity * (0.45 + 0.55 * asmb);
  }
`;

export const pointsFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.18, 0.0, d);
    vec3 col = vColor * a + core * 0.6;
    gl_FragColor = vec4(col * vAlpha, a * vAlpha);
  }
`;

export const linesVertex = /* glsl */ `
  ${common}
  uniform vec3 uColA;
  uniform vec3 uColB;
  attribute vec3 aCurve;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float t = aCurve.x;
    float s = aCurve.y;
    float tm; float tf; float asmb;
    // Connections form after the particles have gathered.
    vec3 p = morphPosition(position, s * 0.6 + 0.4, tm, tf, asmb);
    vec4 mv = viewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float hit;
    repel(gl_Position, uRepel * (1.0 - tm), hit);

    // Signals travelling along each fibre.
    float head = fract(uTime * (0.08 + s * 0.12) + s * 7.0);
    float pulse = exp(-pow((t - head) * 14.0, 2.0));
    float wave = exp(-pow(position.z - uWave, 2.0) * 18.0) * (1.0 - tm);
    float ends = smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.92, t);

    vColor = mix(uColA, uColB, pulse * 0.85 + wave * 0.5) + pulse * vec3(0.25, 0.4, 0.45);
    float a = (0.13 + 0.12 * aCurve.z) + pulse * 0.75 + wave * 0.35 + hit * 0.3;
    vAlpha = a * ends * mix(1.0, tf * 0.8, tm) * uOpacity * asmb * asmb;
  }
`;

export const linesFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(vColor * vAlpha, vAlpha);
  }
`;

export const glowVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = pow(max(0.0, 1.0 - d), 2.6);
    gl_FragColor = vec4(uColor * a * uOpacity, a * uOpacity);
  }
`;

export const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uOpacity;
  attribute float aSeed;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.12 + aSeed * 30.0) * 0.25;
    p.x += cos(uTime * 0.1 + aSeed * 20.0) * 0.25;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.0 + aSeed * 2.2) * uPixelRatio * (6.0 / max(-mv.z, 0.5));
    vAlpha = (0.25 + 0.5 * fract(aSeed * 13.7)) * uOpacity * (0.6 + 0.4 * sin(uTime * (0.5 + aSeed) + aSeed * 50.0));
  }
`;

export const dustFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    gl_FragColor = vec4(uColor * a, a);
  }
`;
