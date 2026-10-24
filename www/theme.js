// Interface theme of a camera: a few CSS tokens plus a `ui` variant name (chrome shown by the CSS in ui.css).
// Pure, so the node test and the app share it. A camera without `theme`/`ui` gets the default darkroom look.
const THEME_DEFAULT = { accent: '#ff6b3d', veil: 'rgba(12,12,14,.42)', ink: '#f4f1ea', dark: '#0b0b0d', chip: '999px', wt: '500' };
const THEME_UIS = ['dark', 'mono', 'warm', 'print', 'film', 'slide'];
const THEME_VARS = { accent: '--safe', veil: '--veil', ink: '--ink', dark: '--dark', chip: '--r-chip', wt: '--wt' };

function themeOf(cam) {
  const t = Object.assign({}, THEME_DEFAULT, cam.theme), vars = {};
  for (const k in THEME_VARS) vars[THEME_VARS[k]] = t[k];
  return { ui: cam.ui || 'dark', vars };
}

if (typeof module !== 'undefined') module.exports = { themeOf, THEME_DEFAULT, THEME_UIS };
