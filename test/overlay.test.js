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
assert.deepStrictEqual(one, { width: 0.05, bottom: 0, round: 0.02, color: [1, 0.9, 0.8] });
assert.strictEqual(makeParams({ ...base, frames: [{ width: 0.04, bottom: 0.12, color: [1, 1, 1] }] }, 3).frame.bottom, 0.12, 'thick bottom border');
const seen = new Set();
for (let s = 0; s < 40; s++) seen.add(makeParams({ ...base, frames: [null, { width: 0.04, color: [1, 1, 1] }] }, s).frame.width);
assert(seen.has(0) && seen.has(0.04), 'both frame choices occur');

// flash falloff: no flash changes nothing, the centre gains light and the corner loses it
const { flashGain, stampText, stampBox } = require('../www/film-params.js');
assert.strictEqual(flashGain(0.7, 0), 1);
assert(flashGain(0, 0.8) > 1 && flashGain(1, 0.8) < 1 && flashGain(0.3, 0.8) > flashGain(0.9, 0.8), 'centre bright, corners dim');

// date stamp: text format, place inside the picture, and the per-shot chance (0 never, 1 always)
assert.strictEqual(stampText(new Date(2026, 9, 4)), "'26 10 04");
const b = stampBox(4000, 3000);
assert(b.x < 4000 && b.y < 3000 && b.x > 3000 && b.y > 2500 && b.size > 50, `stamp box ${JSON.stringify(b)}`);
assert(!makeParams({ ...base, stamp: 0 }, 1).stamp && makeParams({ ...base, stamp: 1 }, 1).stamp, 'stamp chance');
assert(new Set(Array.from({ length: 40 }, (_, s) => makeParams({ ...base, stamp: 0.5 }, s).stamp)).size === 2, 'half the shots stamped');
console.log('overlay.test.js ok');
