// CPU film look: fallback when WebGL is unavailable, and the reference the tests check. Takes makeParams() output.
// shortcut: no sharpening, dust, leak or frame on this path, and no colour cube (split tone), the GPU path has them.
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

if (typeof module !== 'undefined') module.exports = { develop };
