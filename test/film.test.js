// Run: node test/film.test.js
const assert = require('assert');
const { develop, PRESETS } = require('../www/film.js');

const flat = (v, w = 9, h = 9) => ({ width: w, height: h, data: new Uint8ClampedArray(w * h * 4).fill(v) });
const px = (img, x, y) => Array.from(img.data.slice((y * img.width + x) * 4, (y * img.width + x) * 4 + 3));

// vignette darkens corners relative to centre (grain off so only the vignette differs)
const v = develop(flat(128), { ...PRESETS.sunny, grain: 0 });
assert(px(v, 0, 0)[1] < px(v, 4, 4)[1], 'corner should be darker than centre');

// mono has equal channels everywhere
const m = develop(flat(200), PRESETS.mono);
for (let i = 0; i < m.data.length; i += 4) assert(m.data[i] === m.data[i + 1] && m.data[i] === m.data[i + 2]);

// same seed, same grain; different seed, different grain
const a = develop(flat(100), PRESETS.dusk, 7), b = develop(flat(100), PRESETS.dusk, 7), c = develop(flat(100), PRESETS.dusk, 8);
assert.deepStrictEqual(a.data, b.data);
assert.notDeepStrictEqual(a.data, c.data);

// alpha is untouched for every preset (range is guaranteed by the clamped array)
for (const name in PRESETS) for (const val of [0, 255]) {
  const o = develop(flat(val), PRESETS[name]);
  for (let i = 0; i < o.data.length; i += 4) assert(o.data[i + 3] === val);
}
console.log('film.test.js ok');
