/** math.js — shared maths utilities */
export const lerp       = (a, b, t) => a + (b - a) * t;
export const invLerp    = (a, b, v) => (v - a) / (b - a);
export const remap      = (v, a1, b1, a2, b2) => lerp(a2, b2, invLerp(a1, b1, v));
export const clamp      = (v, mn, mx) => Math.max(mn, Math.min(mx, v));
export const clamp01    = v => clamp(v, 0, 1);
export const deg2rad    = d => d * Math.PI / 180;
export const rad2deg    = r => r * 180 / Math.PI;
export const dist       = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
export const smoothstep = (a, b, t) => { const x = clamp01((t - a) / (b - a)); return x * x * (3 - 2 * x); };
export function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
