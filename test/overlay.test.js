// Dust, light leak and frame checks. Run: node test/overlay.test.js
const assert = require('assert');
const { makeParams, OVERLAY_N: N } = require('../www/film-params.js');

const lit = o => { let c = 0; for (let i = 0; i < o.length; i += 4) if (o[i] | o[i + 1] | o[i + 2]) c++; return c; };
const base = { dust: 0, hairs: 0, leak: 0 };

// nothing asked for, nothing drawn; same seed gives the same overlay, another seed a different one
assert.strictEqual(lit(makeParams(base, 1).overlay), 0);
const d = { ...base, dust: 20, hairs: 2 };
assert.deepStrictEqual(makeParams(d, 5).overlay, makeParams(d, 5).overlay);
assert.notDeepStrictEqual(makeParams(d, 5).overlay, makeParams(d, 6).overlay);

// dust draws something, but stays a sparse sprinkling
const dust = lit(makeParams(d, 5).overlay);
assert(dust > 20 && dust < N * N * 0.05, `dust pixels ${dust}`);
assert(lit(makeParams({ ...base, dust: 60 }, 5).overlay) > lit(makeParams({ ...base, dust: 5 }, 5).overlay), 'more dust, more specks');

// leak: its brightest pixel sits on an edge, it is tinted by leakColor and lights a large area
const leak = makeParams({ ...base, leak: 0.5, leakSize: 0.5, leakColor: [1, 0, 0] }, 9).overlay;
let best = -1, bi = 0, red = 0, blue = 0;
for (let i = 0; i < leak.length; i += 4) { red += leak[i]; blue += leak[i + 2]; if (leak[i] > best) { best = leak[i]; bi = i / 4; } }
const bx = bi % N, by = Math.floor(bi / N);
assert(Math.min(bx, by, N - 1 - bx, N - 1 - by) <= 2, `leak peak at ${bx},${by} is not on an edge`);
assert(red > 0 && blue === 0, 'leak colour');
assert(lit(leak) > N * N * 0.05, 'leak covers a wide area');
assert(best > 0.4 * 255 && best <= 0.5 * 255 + 1, `leak peak ${best} follows intensity`);

// frames: none, one, and a mix both appear across seeds
assert.deepStrictEqual(makeParams(base, 1).frame.width, 0);
const one = makeParams({ ...base, frames: [{ width: 0.05, round: 0.02, color: [1, 0.9, 0.8] }] }, 3).frame;
assert.deepStrictEqual(one, { width: 0.05, round: 0.02, color: [1, 0.9, 0.8] });
const seen = new Set();
for (let s = 0; s < 40; s++) seen.add(makeParams({ ...base, frames: [null, { width: 0.04, color: [1, 1, 1] }] }, s).frame.width);
assert(seen.has(0) && seen.has(0.04), 'both frame choices occur');
console.log('overlay.test.js ok');
