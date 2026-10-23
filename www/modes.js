// Pure helpers for the camera modes: frame formats, crop and stage maths, the roll counter.
// ratio r is width/height for a landscape frame; `fixed` formats keep r whatever the source orientation (half frame is two 3:4 frames).
const FORMATS = [
  { id: '32', label: '3:2', r: 3 / 2 },
  { id: '43', label: '4:3', r: 4 / 3 },
  { id: '11', label: '1:1', r: 1 },
  { id: 'half', label: 'Half', r: 3 / 4, fixed: true }
];
const TIMERS = [0, 3, 10];
const ROLLS = [0, 12, 24];

// frame aspect (w/h) for a source of w x h: portrait sources get a portrait frame
const frameAspect = (f, w, h) => (f.fixed || w >= h ? f.r : 1 / f.r);
// largest centred rect of aspect `a` inside sw x sh
const cropRect = (sw, sh, a) => {
  let w = sw, h = Math.round(sw / a);
  if (h > sh) { h = sh; w = Math.round(sh * a); }
  return { x: Math.floor((sw - w) / 2), y: Math.floor((sh - h) / 2), w, h };
};
// largest box of aspect `a` that fits cw x ch
const stageSize = (cw, ch, a) => (cw / ch > a ? { w: Math.round(ch * a), h: ch } : { w: cw, h: Math.round(cw / a) });
const nextIn = (list, cur) => list[(list.indexOf(cur) + 1) % list.length];
// one more exposure on a roll; done when the last frame is used
const rollNext = roll => { const n = roll.n + 1; return { roll: { ...roll, n }, done: n >= roll.size }; };

if (typeof module !== 'undefined') module.exports = { FORMATS, TIMERS, ROLLS, frameAspect, cropRect, stageSize, nextIn, rollNext };
