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
- Feature list and build order: docs/recon.md.

## Done
- Step 1: repo was empty; created this file.
- Step 2: docs/recon.md written from the public listing (11 features, 4 must-haves: F1 capture, F2 film look, F3 camera presets, F9 save/share).

## Next steps
1. Scaffold web app + Capacitor Android project.
2. Add .github/workflows/build-apk.yml (debug APK artifact on push) and confirm a green run.
3. Camera preview and photo capture (F1).
4. App shell with liquid-glass controls.
5. F9 save/share, then F2 film look, then F3 presets, one per commit.
6. Should-haves: gallery (F8), dust/frames (F4/F5), double exposure (F6), import (F7).

## Could be better
- Recon is thin: the listing names effect types but not parameters. Tune the look by eye on a real device.
- Listing was read once; re-check if the original adds features.

## Decisions
- Stack: plain web UI wrapped with Capacitor, because liquid-glass-js is a browser library. Repo was empty, so no existing stack to keep.
- No shop, payments or membership.

## Open questions
- Final app name and brand.
- Whether the glass effect performs well on low-end phones.
