// Our own cameras. Every field is a value range; each shot picks a random value inside it (see makeParams).
// Placeholder trio from phase 1, replaced by the full library in the camera-library step.
const CAMERAS = [
  { name: 'Sunny', contrast: [0.3, 0.4], fade: [0.02, 0.06], tint: [[1.03, 0.99, 0.9], [1.07, 1.01, 0.96]],
    sat: [1.05, 1.15], vignette: [0.2, 0.3], grain: [0.04, 0.06], grainSize: [1.3, 1.8], sharpen: [0.15, 0.3],
    shadow: [-0.01, 0, 0.02], high: [0.02, 0.01, -0.02] },
  { name: 'Mono', contrast: [0.45, 0.55], fade: [0.01, 0.03], tint: [1, 1, 1], sat: 0,
    vignette: [0.3, 0.4], grain: [0.07, 0.11], grainSize: [1.4, 2], sharpen: [0.2, 0.35] },
  { name: 'Dusk', contrast: [0.15, 0.25], fade: [0.1, 0.14], tint: [[0.94, 0.99, 1.05], [0.98, 1.01, 1.1]],
    sat: [0.8, 0.9], vignette: [0.25, 0.35], grain: [0.06, 0.08], grainSize: [1.4, 1.9], sharpen: [0.1, 0.2],
    shadow: [0, 0.01, 0.03], high: [0.02, 0, 0.02] }
];

if (typeof module !== 'undefined') module.exports = { CAMERAS };
