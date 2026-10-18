// Film look: tone curve + fade, colour tint, saturation, vignette, grain. In place on {data, width, height}.
// shortcut: no sharpening pass (needs a neighbour kernel), add it if shots look soft on device.
// Preset numbers are our own starting guesses, tune by eye on a device.
const PRESETS = {
  sunny: { contrast: 0.35, fade: 0.04, tint: [1.05, 1.0, 0.93], sat: 1.1, vignette: 0.25, grain: 0.05 },
  mono:  { contrast: 0.5,  fade: 0.02, tint: [1, 1, 1],         sat: 0,   vignette: 0.35, grain: 0.09 },
  dusk:  { contrast: 0.2,  fade: 0.12, tint: [0.96, 1.0, 1.08], sat: 0.85, vignette: 0.3, grain: 0.07 }
};

function develop(img, p, seed = 1) {
  const { data, width, height } = img;
  const cx = width / 2, cy = height / 2, maxD2 = cx * cx + cy * cy;
  let s = seed >>> 0 || 1;
  const rand = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
  for (let i = 0, px = 0; i < data.length; i += 4, px++) {
    const x = px % width, y = (px / width) | 0;
    const dx = x - cx, dy = y - cy;
    const vig = 1 - p.vignette * ((dx * dx + dy * dy) / maxD2);
    const g = (rand() - 0.5) * p.grain;
    const c = [0, 0, 0];
    for (let k = 0; k < 3; k++) {
      let v = data[i + k] / 255;
      v += (v * v * (3 - 2 * v) - v) * p.contrast;      // S-curve
      c[k] = (p.fade + v * (1 - p.fade)) * p.tint[k];  // lifted blacks, tint
    }
    const l = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
    for (let k = 0; k < 3; k++) {
      const v = ((l + (c[k] - l) * p.sat) * vig + g) * 255;
      data[i + k] = v < 0 ? 0 : v > 255 ? 255 : v;
    }
  }
  return img;
}

if (typeof module !== 'undefined') module.exports = { develop, PRESETS };
