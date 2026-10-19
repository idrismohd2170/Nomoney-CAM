// Turns a camera (value ranges) plus a seed into concrete, repeatable film parameters and the two
// lookup tables the shader reads: a 256x1 per-channel tone curve and a 16^3 colour-grade cube.
// Pure functions, so the same numbers drive the GPU shader, the CPU fallback and the node tests.

const FILM_DEFAULTS = {
  contrast: 0.3, fade: 0.04, sat: 1, vignette: 0.25, grain: 0.05, grainSize: 1.5, sharpen: 0.2,
  tint: [1, 1, 1], shadow: [0, 0, 0], high: [0, 0, 0]
};
const FILM_NUMBERS = ['contrast', 'fade', 'sat', 'vignette', 'grain', 'grainSize', 'sharpen'];
const FILM_VECTORS = ['tint', 'shadow', 'high'];
const LUT_N = 16;

function mulberry(a) {
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A number field is a number or [min, max]. A vector field is a fixed [r, g, b] or a range [[min...], [max...]]
// (one draw for all channels, so the hue direction stays put).
function pick(r, rand) {
  return typeof r === 'number' ? r : r[0] + (r[1] - r[0]) * rand();
}
function pickVec(r, rand) {
  if (!Array.isArray(r[0])) return r.slice();
  const t = rand();
  return r[0].map((a, i) => a + (r[1][i] - a) * t);
}

const clamp255 = v => (v < 0 ? 0 : v > 255 ? 255 : Math.round(v));

function makeCurve(p) {
  const out = new Uint8Array(256 * 4);
  for (let i = 0; i < 256; i++) {
    let x = i / 255;
    x += (x * x * (3 - 2 * x) - x) * p.contrast;   // S-curve
    x = p.fade + x * (1 - p.fade);                  // lifted blacks
    for (let k = 0; k < 3; k++) out[i * 4 + k] = clamp255(x * p.tint[k] * 255);
    out[i * 4 + 3] = 255;
  }
  return out;
}

// Row = green, column = blue * 16 + red (a 256x16 strip).
function makeLut(p) {
  const n = LUT_N, out = new Uint8Array(n * n * n * 4);
  for (let b = 0; b < n; b++) for (let g = 0; g < n; g++) for (let r = 0; r < n; r++) {
    const c = [r, g, b].map(v => v / (n - 1));
    const l = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
    const o = (g * n * n + b * n + r) * 4;
    for (let k = 0; k < 3; k++) out[o + k] = clamp255((l + (c[k] - l) * p.sat + p.shadow[k] * (1 - l) + p.high[k] * l) * 255);
    out[o + 3] = 255;
  }
  return out;
}

function makeParams(camera, seed) {
  const rand = mulberry(seed), cam = { ...FILM_DEFAULTS, ...camera }, p = {};
  for (const k of FILM_NUMBERS) p[k] = pick(cam[k], rand);
  for (const k of FILM_VECTORS) p[k] = pickVec(cam[k], rand);
  p.noise = rand() * 100;
  p.curve = makeCurve(p);
  p.lut = makeLut(p);
  return p;
}

if (typeof module !== 'undefined') module.exports = { makeParams, mulberry, pick, pickVec, LUT_N };
