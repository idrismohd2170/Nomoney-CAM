// Turns a camera (value ranges) plus a seed into concrete, repeatable film parameters and the textures
// the shader reads: a 256x1 per-channel tone curve, a 16^3 colour-grade cube and a 512^2 dust/light-leak overlay.
// Pure functions, so the same numbers drive the GPU shader, the CPU fallback and the node tests.

const FILM_DEFAULTS = {
  contrast: 0.3, fade: 0.04, sat: 1, vignette: 0.25, grain: 0.05, grainSize: 1.5, sharpen: 0.2,
  dust: 8, hairs: 0, leak: 0, leakSize: 0.4, flash: 0, stamp: 0,
  tint: [1, 1, 1], shadow: [0, 0, 0], high: [0, 0, 0], leakColor: [1, 0.45, 0.2],
  frames: [null]
};
const FILM_NUMBERS = ['contrast', 'fade', 'sat', 'vignette', 'grain', 'grainSize', 'sharpen', 'dust', 'hairs', 'leak', 'leakSize', 'flash'];
const FILM_VECTORS = ['tint', 'shadow', 'high', 'leakColor'];
const LUT_N = 16;
const OVERLAY_N = 512;

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

// Light added on top of the picture (screen blend): a soft leak glow from one edge, dust specks and a few hairs.
// Row 0 is the bottom of the picture. Consumes `rand` so the whole look stays a function of the seed.
function makeOverlay(p, rand) {
  const n = OVERLAY_N, acc = new Float32Array(n * n * 3);
  const add = (x, y, v, col) => { const i = (y * n + x) * 3; for (let k = 0; k < 3; k++) acc[i + k] = Math.max(acc[i + k], v * col[k]); };
  const WHITE = [1, 1, 1];

  if (p.leak > 0) {
    const side = Math.floor(rand() * 4), t = rand();
    const cx = side === 0 ? 0 : side === 1 ? 1 : t, cy = side === 2 ? 0 : side === 3 ? 1 : t;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const g = Math.max(0, 1 - Math.hypot(x / n - cx, y / n - cy) / p.leakSize);
      if (g > 0) { const i = (y * n + x) * 3, glow = g * g * p.leak; for (let k = 0; k < 3; k++) acc[i + k] = glow * p.leakColor[k]; }
    }
  }

  const disc = (x, y, r, v) => {
    for (let j = Math.max(0, Math.floor(y - r)); j <= Math.min(n - 1, Math.ceil(y + r)); j++)
      for (let i = Math.max(0, Math.floor(x - r)); i <= Math.min(n - 1, Math.ceil(x + r)); i++) {
        const a = v * (1 - Math.hypot(i - x, j - y) / r);
        if (a > 0) add(i, j, a, WHITE);
      }
  };
  for (let s = Math.round(p.dust); s > 0; s--) {
    const x = rand() * n, y = rand() * n, r = 1 + rand() ** 3 * 3.5;
    disc(x, y, r, 0.45 + rand() * 0.5);
  }
  for (let h = Math.round(p.hairs); h > 0; h--) { // a hair is a short curved stroke
    const x0 = rand() * n, y0 = rand() * n, len = 25 + rand() * 60, a = rand() * 6.283, bend = (rand() - 0.5) * 1.5;
    for (let t = 0; t <= 1; t += 0.02) {
      const ang = a + bend * t;
      disc(x0 + Math.cos(ang) * len * t, y0 + Math.sin(ang) * len * t, 1.1, 0.4);
    }
  }

  const out = new Uint8Array(n * n * 4);
  for (let i = 0, px = 0; px < n * n; px++, i += 4) {
    for (let k = 0; k < 3; k++) out[i + k] = clamp255(acc[px * 3 + k] * 255);
    out[i + 3] = 255;
  }
  return out;
}

// A frame is { width, bottom, round, color } as fractions of the short side (`bottom` is extra border at the bottom, the
// thick strip of an instant print), or null for none.
function pickFrame(frames, rand) {
  const f = frames[Math.floor(rand() * frames.length)];
  return f ? { width: f.width, bottom: f.bottom || 0, round: f.round || 0, color: f.color.slice() } : { width: 0, bottom: 0, round: 0, color: [1, 1, 1] };
}

// Flash falloff: brightness gain at distance d from the centre (0 centre, 1 corner). The shader uses the same formula.
const flashGain = (d, flash) => 1 + flash * (0.35 - 1.1 * d * d);

// Date stamp: text like '26 10 24 and its place (right-aligned, bottom right) on a w x h picture. Drawn on a 2D canvas after development.
const stampText = d => `'${String(d.getFullYear()).slice(2)} ${String(d.getMonth() + 1).padStart(2, '0')} ${String(d.getDate()).padStart(2, '0')}`;
function stampBox(w, h) {
  const size = Math.round(Math.min(w, h) * 0.04), m = Math.round(Math.min(w, h) * 0.05);
  return { x: w - m, y: h - m, size };
}

function makeParams(camera, seed) {
  const rand = mulberry(seed), cam = { ...FILM_DEFAULTS, ...camera }, p = {};
  for (const k of FILM_NUMBERS) p[k] = pick(cam[k], rand);
  for (const k of FILM_VECTORS) p[k] = pickVec(cam[k], rand);
  p.frame = pickFrame(cam.frames, rand);
  p.noise = rand() * 100;
  p.curve = makeCurve(p);
  p.lut = makeLut(p);
  p.overlay = makeOverlay(p, rand);
  p.stamp = rand() < cam.stamp; // drawn last so the other draws keep their seeds
  return p;
}

if (typeof module !== 'undefined') module.exports = { flashGain, stampText, stampBox, makeParams, makeOverlay, mulberry, pick, pickVec, LUT_N, OVERLAY_N };
