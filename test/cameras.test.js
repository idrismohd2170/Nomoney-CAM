// Camera library checks. Run: node test/cameras.test.js
const assert = require('assert');
const { makeParams } = require('../www/film-params.js');
const { CAMERAS } = require('../www/cameras.js');
const { themeOf, THEME_DEFAULT, THEME_UIS } = require('../www/theme.js');

const ALLOWED = new Set(['name', 'contrast', 'fade', 'sat', 'vignette', 'grain', 'grainSize', 'sharpen', 'dust', 'hairs', 'leak',
  'leakSize', 'tint', 'shadow', 'high', 'leakColor', 'frames', 'ui', 'theme', 'flash', 'stamp', 'fmt']);
const NUMBERS = ['contrast', 'fade', 'sat', 'vignette', 'grain', 'grainSize', 'sharpen', 'dust', 'hairs', 'leak', 'leakSize'];

// enough cameras, unique short names, and nothing that smells like a paywall
assert(CAMERAS.length >= 6, 'at least 6 cameras');
assert.strictEqual(new Set(CAMERAS.map(c => c.name)).size, CAMERAS.length, 'unique names');
for (const c of CAMERAS) {
  assert(c.name && c.name.length <= 12, `${c.name}: name fits the label`);
  for (const k of Object.keys(c)) assert(ALLOWED.has(k), `${c.name}: unknown field ${k} (no price, lock or pro flags allowed)`);
  for (const k of NUMBERS) if (Array.isArray(c[k])) assert(c[k][0] <= c[k][1], `${c.name}.${k} range is ordered`);
  // vectors are a fixed [r,g,b] or two endpoint colours that a shot blends between (channels may go either way)
  for (const k of ['tint', 'shadow', 'high', 'leakColor']) if (c[k]) {
    const ends = Array.isArray(c[k][0]) ? c[k] : [c[k]];
    for (const e of ends) assert(e.length === 3 && e.every(Number.isFinite), `${c.name}.${k} is a 3-vector`);
  }
  for (const k of Object.keys(c.theme || {})) assert(k in THEME_DEFAULT, `${c.name}: unknown theme token ${k}`);
  assert(THEME_UIS.includes(themeOf(c).ui), `${c.name}: unknown ui variant`);
  for (const f of c.frames || []) if (f) assert(f.width > 0 && f.width < 0.2 && (f.bottom || 0) < 0.3 && f.color.length === 3, `${c.name} frame`);
}

// theme: defaults fill the gaps, overrides win, and a themed camera really differs from the default
assert.deepStrictEqual(themeOf({ name: 'x' }), themeOf({ name: 'y', theme: {} }));
assert.strictEqual(themeOf({ theme: { accent: '#123456' } }).vars['--safe'], '#123456');
assert.strictEqual(themeOf({}).vars['--ink'], THEME_DEFAULT.ink);
assert(CAMERAS.filter(c => c.ui && c.ui !== 'dark').length >= 2, 'two cameras prove the theme system');

// instant family: three print shapes, each with a thick-bottom frame, a known format and the print chrome
const { FORMATS } = require('../www/modes.js');
const prints = CAMERAS.filter(c => c.ui === 'print');
assert(prints.length >= 3, 'three instant cameras');
assert.strictEqual(new Set(prints.map(c => c.fmt)).size, prints.length, 'one print shape each');
for (const c of prints) {
  assert(FORMATS.some(f => f.id === c.fmt), `${c.name}: known format`);
  assert(c.frames.every(f => f && f.bottom > f.width), `${c.name}: always a thick-bottom print frame`);
  assert(c.flash, `${c.name}: flash falloff`);
}

// colour negative family: four stocks with the shared film chrome, none framed, each with its own accent
const negs = CAMERAS.filter(c => c.ui === 'film');
assert(negs.length >= 4, 'four colour negative cameras');
assert.strictEqual(new Set(negs.map(c => c.theme.accent)).size, negs.length, 'own accent each');

// slide family: two reversal stocks (saturated) and a pushed black-and-white that is not the old Noir
const slides = CAMERAS.filter(c => c.ui === 'slide');
assert(slides.length >= 2, 'two slide cameras');
assert(slides.every(c => c.sat[0] > 1.1), 'slides are saturated');
const grit = CAMERAS.find(c => c.name === 'Grit 400');
assert(grit && grit.sat === 0 && grit.grain[0] + grit.grain[1] > 1.2 * (CAMERAS.find(c => c.name === 'Noir').grain[0] + CAMERAS.find(c => c.name === 'Noir').grain[1]), 'one extra black-and-white, grainier than Noir');

// disposable family: flash-lit, plastic-lens vignette, and a date stamp that may be burned in
const flashes = CAMERAS.filter(c => c.ui === 'flash');
assert(flashes.length >= 2, 'two disposable cameras');
assert(flashes.every(c => c.flash[0] >= 0.5 && c.vignette[0] >= 0.3 && c.stamp > 0 && c.stamp <= 1), 'flash falloff, vignette and a stamp chance');
assert(CAMERAS.length - 8 >= 12, 'at least 12 cameras added to the original 8');

// each shot differs within a camera: over 25 seeds most ranged fields take several different values
const sample = c => Array.from({ length: 25 }, (_, s) => makeParams(c, s + 1));
for (const c of CAMERAS) {
  const ps = sample(c), varied = NUMBERS.filter(k => new Set(ps.map(p => p[k].toFixed(4))).size > 5);
  assert(varied.length >= 4, `${c.name} varies on ${varied.length} fields only`);
  assert(new Set(ps.map(p => p.frame.width)).size >= (c.frames && c.frames.length > 1 ? 2 : 1), `${c.name} frame choice`);
}

// cameras differ from each other: compare their average look
const sig = c => {
  const ps = sample(c), avg = f => ps.reduce((a, p) => a + f(p), 0) / ps.length;
  return [avg(p => p.contrast), avg(p => p.fade), avg(p => p.sat) / 2, avg(p => p.vignette), avg(p => p.grain) * 5,
    avg(p => p.tint[0] - p.tint[2]) * 2, avg(p => p.leak), avg(p => p.dust) / 20];
};
const sigs = CAMERAS.map(sig);
for (let i = 0; i < CAMERAS.length; i++) for (let j = i + 1; j < CAMERAS.length; j++) {
  const d = Math.hypot(...sigs[i].map((v, k) => v - sigs[j][k]));
  assert(d > 0.12, `${CAMERAS[i].name} and ${CAMERAS[j].name} look too alike (${d.toFixed(3)})`);
}
console.log('cameras.test.js ok');
