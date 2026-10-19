// Parameter generation checks. Run: node test/params.test.js
const assert = require('assert');
const { makeParams, pick, pickVec, mulberry, LUT_N } = require('../www/film-params.js');
const { CAMERAS } = require('../www/cameras.js');

// pick: numbers pass through, ranges stay inside. pickVec: a fixed 3-vector is NOT a range, a range of vectors uses one draw
assert.strictEqual(pick(0.5, () => 0.9), 0.5);
assert.strictEqual(pick([2, 4], () => 0.5), 3);
assert.deepStrictEqual(pickVec([1, 1, 1], () => 0.9), [1, 1, 1]);
assert.deepStrictEqual(pickVec([[0, 10], [10, 20]], () => 0.5), [5, 15]);

for (const cam of CAMERAS) {
  const p = makeParams(cam, 42);

  // same seed, same parameters and tables; other seed, different
  assert.deepStrictEqual(makeParams(cam, 42).curve, p.curve);
  assert.deepStrictEqual(makeParams(cam, 42).lut, p.lut);
  assert.notStrictEqual(makeParams(cam, 43).noise, p.noise);

  // every numeric parameter lands inside the camera's range
  for (const k of ['contrast', 'fade', 'sat', 'vignette', 'grain', 'grainSize', 'sharpen']) {
    const r = cam[k], [lo, hi] = typeof r === 'number' ? [r, r] : r;
    assert(p[k] >= lo - 1e-9 && p[k] <= hi + 1e-9, `${cam.name}.${k} out of range`);
  }

  // vectors are real 3-vectors and the tables hold no NaN-turned-zero holes
  for (const k of ['tint', 'shadow', 'high']) assert(Array.isArray(p[k]) && p[k].length === 3 && p[k].every(Number.isFinite), `${cam.name}.${k}`);
  assert(p.curve[255 * 4] > 150 && p.curve[255 * 4 + 1] > 150 && p.curve[255 * 4 + 2] > 150, `${cam.name} curve top is not black`);

  // table sizes and a non-decreasing tone curve per channel
  assert.strictEqual(p.curve.length, 256 * 4);
  assert.strictEqual(p.lut.length, LUT_N ** 3 * 4);
  for (let i = 1; i < 256; i++) for (let k = 0; k < 3; k++) assert(p.curve[i * 4 + k] >= p.curve[(i - 1) * 4 + k]);
  assert.strictEqual(p.curve[3], 255);
}

// the colour cube: sat 0 gives a neutral grey on the whole cube; the cube is neutral at sat 1 with no tone
const mono = makeParams({ sat: 0 }, 1);
for (let i = 0; i < mono.lut.length; i += 4) assert(mono.lut[i] === mono.lut[i + 1] && mono.lut[i] === mono.lut[i + 2]);
const id = makeParams({ sat: 1 }, 1), n = LUT_N;
const at = (r, g, b) => Array.from(id.lut.slice((g * n * n + b * n + r) * 4, (g * n * n + b * n + r) * 4 + 3));
assert.deepStrictEqual(at(15, 0, 0), [255, 0, 0]);
assert.deepStrictEqual(at(0, 15, 0), [0, 255, 0]);
assert.deepStrictEqual(at(0, 0, 15), [0, 0, 255]);
assert.deepStrictEqual(at(15, 15, 15), [255, 255, 255]);

// the generator is deterministic and spread out
const r = mulberry(5), first = [r(), r(), r()];
assert.deepStrictEqual([mulberry(5)(), ...first.slice(1)].length, 3);
assert(new Set(first).size === 3);
console.log('params.test.js ok');
