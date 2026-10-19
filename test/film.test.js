// CPU fallback checks. Run: node test/film.test.js
const assert = require('assert');
const { develop } = require('../www/film.js');
const { makeParams } = require('../www/film-params.js');
const { CAMERAS } = require('../www/cameras.js');

const P = (name, seed = 1) => makeParams(CAMERAS.find(c => c.name === name), seed);
const flat = (v, w = 9, h = 9) => ({ width: w, height: h, data: new Uint8ClampedArray(w * h * 4).fill(v) });
const px = (img, x, y) => Array.from(img.data.slice((y * img.width + x) * 4, (y * img.width + x) * 4 + 3));

// vignette darkens corners relative to centre (grain off so only the vignette differs)
const v = develop(flat(128), { ...P('Amber'), grain: 0 });
assert(px(v, 0, 0)[1] < px(v, 4, 4)[1], 'corner should be darker than centre');

// mono has equal channels everywhere
const m = develop(flat(200), P('Noir'));
for (let i = 0; i < m.data.length; i += 4) assert(m.data[i] === m.data[i + 1] && m.data[i] === m.data[i + 2]);

// same seed, same grain; different seed, different grain
const a = develop(flat(100), P('Fog'), 7), b = develop(flat(100), P('Fog'), 7), c = develop(flat(100), P('Fog'), 8);
assert.deepStrictEqual(a.data, b.data);
assert.notDeepStrictEqual(a.data, c.data);

// alpha is untouched for every camera (range is guaranteed by the clamped array)
for (const cam of CAMERAS) for (const val of [0, 255]) {
  const o = develop(flat(val), makeParams(cam, 3));
  for (let i = 0; i < o.data.length; i += 4) assert(o.data[i + 3] === val);
}
console.log('film.test.js ok');
