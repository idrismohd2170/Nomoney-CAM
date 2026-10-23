const assert = require('assert');
const { FORMATS, TIMERS, ROLLS, frameAspect, cropRect, stageSize, nextIn, rollNext } = require('../www/modes.js');

const f = id => FORMATS.find(x => x.id === id);
// aspect follows the source orientation, except fixed formats
assert.strictEqual(frameAspect(f('32'), 4000, 3000), 1.5);
assert.strictEqual(frameAspect(f('32'), 3000, 4000), 2 / 3);
assert.strictEqual(frameAspect(f('11'), 3000, 4000), 1);
assert.strictEqual(frameAspect(f('half'), 4000, 3000), 0.75);
assert.strictEqual(frameAspect(f('half'), 3000, 4000), 0.75);

// crop: right aspect, centred, inside the source, for every format and both orientations
for (const [w, h] of [[4000, 3000], [3000, 4000], [1280, 720], [640, 480]]) {
  for (const fmt of FORMATS) {
    const a = frameAspect(fmt, w, h), r = cropRect(w, h, a);
    assert(r.x >= 0 && r.y >= 0 && r.x + r.w <= w && r.y + r.h <= h, 'inside');
    assert(Math.abs(r.w / r.h - a) < 0.01, `aspect ${fmt.id} ${w}x${h}`);
    assert(Math.abs(r.x - (w - r.w - r.x)) <= 1 && Math.abs(r.y - (h - r.h - r.y)) <= 1, 'centred');
  }
}
assert.deepStrictEqual(cropRect(4000, 3000, 1), { x: 500, y: 0, w: 3000, h: 3000 });

// stage: fits the container, keeps the aspect
for (const a of [1.5, 4 / 3, 1, 0.75, 2 / 3]) {
  const s = stageSize(360, 600, a);
  assert(s.w <= 360 && s.h <= 600 && Math.abs(s.w / s.h - a) < 0.01);
}
assert.deepStrictEqual(stageSize(360, 600, 1), { w: 360, h: 360 });

// cycling and roll
assert.strictEqual(nextIn(TIMERS, 0), 3); assert.strictEqual(nextIn(TIMERS, 10), 0);
assert.strictEqual(nextIn(ROLLS, 24), 0);
let roll = { id: 'r', size: 3, n: 0 }, out;
out = rollNext(roll); assert.deepStrictEqual([out.roll.n, out.done], [1, false]); assert.strictEqual(roll.n, 0, 'input untouched');
out = rollNext(rollNext(out.roll).roll); assert.deepStrictEqual([out.roll.n, out.done], [3, true]);

// no paid or locked fields on modes
assert(FORMATS.every(x => Object.keys(x).every(k => ['id', 'label', 'r', 'fixed'].includes(k))));
console.log('modes tests passed');
