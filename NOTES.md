# NOTES

Rewritten after every step. Read this first.

## Context
- Goal: clean-room Android camera app that rebuilds the features and flows of the app at
  https://play.google.com/store/apps/details?id=com.blink.academy.nomopro, using public listing info only.
- Clean-room: no decompiling, no original name, logo, icons, copy, filters or LUT data.
- Working name is the repo name. **Rebrand before any public release.**
- All code follows the ponytail skill (full level): smallest change that fully works.
- UI surfaces use https://github.com/dashersw/liquid-glass-js.
- CI builds a debug APK on every push (added in step 4).

## Done
- Step 1: repo was empty; created this file.

## Next steps
1. Write docs/recon.md: feature list from the public listing, marked must / should / could.
2. Scaffold web app + Capacitor Android project.
3. Add .github/workflows/build-apk.yml (debug APK artifact on push) and confirm a green run.
4. Camera preview and photo capture.
5. App shell with liquid-glass controls.
6. One must-have feature per step from docs/recon.md.

## Could be better
- Nothing built yet. Check liquid-glass-js works inside an Android WebView before relying on it.

## Decisions
- Stack: plain web UI wrapped with Capacitor, because liquid-glass-js is a browser library. Repo was empty, so no existing stack to keep.

## Open questions
- Final app name and brand.
- Whether the glass effect performs well on low-end phones.
