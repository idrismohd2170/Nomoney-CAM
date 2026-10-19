// Our own cameras. Every field is a value range; each shot picks a random value inside it (see makeParams).
// Number fields: n or [min, max]. Vector fields: fixed [r,g,b] or a range [[min],[max]]. frames: a list, one is picked per shot.
// All cameras are free and unlocked. Names are placeholders until the rebrand; keep them short (the label is a small pill).
const CAMERAS = [
  { name: 'Amber', contrast: [0.3, 0.4], fade: [0.02, 0.05], tint: [[1.04, 1, 0.9], [1.08, 1.02, 0.95]], sat: [1.1, 1.2],
    vignette: [0.2, 0.3], grain: [0.04, 0.06], grainSize: [1.3, 1.8], sharpen: [0.15, 0.3],
    shadow: [-0.01, 0, 0.02], high: [0.03, 0.015, -0.02],
    dust: [6, 14], hairs: [0, 1], leak: [0, 0.4], leakSize: [0.35, 0.6], leakColor: [[1, 0.55, 0.15], [1, 0.4, 0.2]],
    frames: [null, null, { width: 0.035, round: 0.01, color: [0.96, 0.94, 0.88] }] },
  { name: 'Fog', contrast: [0.12, 0.22], fade: [0.1, 0.16], tint: [[0.93, 0.99, 1.04], [0.97, 1.02, 1.08]], sat: [0.7, 0.85],
    vignette: [0.2, 0.3], grain: [0.05, 0.08], grainSize: [1.6, 2.2], sharpen: [0.05, 0.15],
    shadow: [0, 0.015, 0.03], high: [0.01, 0.015, 0.02],
    dust: [3, 8], leak: [0, 0.15], leakSize: [0.5, 0.8], leakColor: [0.7, 0.8, 1] },
  { name: 'Noir', contrast: [0.5, 0.6], fade: [0.01, 0.03], sat: 0,
    vignette: [0.3, 0.45], grain: [0.08, 0.13], grainSize: [1.4, 2.1], sharpen: [0.25, 0.4],
    dust: [10, 26], hairs: [0, 3],
    frames: [null, { width: 0.05, color: [0.97, 0.97, 0.97] }, { width: 0.05, color: [0.05, 0.05, 0.05] }] },
  { name: 'Ember', contrast: [0.4, 0.5], fade: [0.01, 0.04], tint: [[1.06, 0.98, 0.88], [1.12, 1, 0.92]], sat: [1.25, 1.4],
    vignette: [0.3, 0.4], grain: [0.05, 0.08], grainSize: [1.3, 1.9], sharpen: [0.2, 0.3],
    shadow: [0, -0.01, 0.04], high: [0.05, 0.01, -0.04],
    dust: [8, 18], hairs: [0, 2], leak: [0.25, 0.6], leakSize: [0.4, 0.7], leakColor: [[1, 0.3, 0.1], [1, 0.45, 0.15]],
    frames: [null, { width: 0.03, round: 0.02, color: [0.1, 0.07, 0.06] }] },
  { name: 'Moss', contrast: [0.28, 0.38], fade: [0.05, 0.09], tint: [[0.94, 1.04, 0.96], [0.98, 1.08, 1]], sat: [0.85, 0.95],
    vignette: [0.35, 0.5], grain: [0.05, 0.08], grainSize: [1.4, 2], sharpen: [0.1, 0.22],
    shadow: [-0.01, 0.02, 0.02], high: [0.01, 0.02, 0],
    dust: [10, 22], hairs: [0, 2], leak: [0, 0.2], leakSize: [0.4, 0.6], leakColor: [[0.6, 1, 0.5], [0.9, 1, 0.4]],
    frames: [null, null, { width: 0.04, color: [0.92, 0.93, 0.88] }] },
  { name: 'Peach', contrast: [0.1, 0.2], fade: [0.08, 0.13], tint: [[1.03, 0.99, 0.96], [1.06, 1, 0.99]], sat: [1, 1.1],
    vignette: [0.1, 0.2], grain: [0.03, 0.05], grainSize: [1.2, 1.6], sharpen: [0.05, 0.15],
    shadow: [0.02, 0, 0], high: [0.03, 0.015, 0.01],
    dust: [2, 6], leak: [0, 0.25], leakSize: [0.5, 0.8], leakColor: [[1, 0.65, 0.6], [1, 0.8, 0.7]],
    frames: [null, { width: 0.05, round: 0.05, color: [1, 0.97, 0.95] }] },
  { name: 'Snap', contrast: [0.45, 0.55], fade: [0, 0.02], tint: [[1.02, 1, 0.96], [1.05, 1.02, 0.99]], sat: [1.15, 1.3],
    vignette: [0.4, 0.55], grain: [0.07, 0.1], grainSize: [1.5, 2.2], sharpen: [0.3, 0.45],
    dust: [8, 20], hairs: [0, 2], leak: [0.1, 0.45], leakSize: [0.3, 0.55], leakColor: [[1, 0.5, 0.2], [1, 0.9, 0.5]],
    frames: [null, { width: 0.03, color: [0.97, 0.96, 0.9] }] },
  { name: 'Slide', contrast: [0.5, 0.62], fade: 0, tint: [[1, 0.99, 0.97], [1.03, 1, 1]], sat: [1.3, 1.45],
    vignette: [0.25, 0.35], grain: [0.02, 0.04], grainSize: [1.2, 1.5], sharpen: [0.25, 0.4],
    dust: [2, 8],
    frames: [null, { width: 0.045, color: [0.04, 0.04, 0.04] }] }
];

if (typeof module !== 'undefined') module.exports = { CAMERAS };
