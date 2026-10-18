# NOTES

Rewritten after every step. Read this first.

## Context
- Goal: clean-room Android camera app that rebuilds the features and flows of the app at
  https://play.google.com/store/apps/details?id=com.blink.academy.nomopro, using public listing info only.
- Clean-room: no decompiling, no original name, logo, icons, copy, filters or LUT data.
- Working name is the repo name. **Rebrand before any public release.**
- All code follows the ponytail skill (full level): smallest change that fully works.
- UI surfaces use https://github.com/dashersw/liquid-glass-js.
- Feature list and build order: docs/recon.md.
- Layout: `www/` is the web app (static, no bundler), `android/` is the generated Capacitor project, `capacitor.config.json` points Capacitor at `www/`.

## Done
- Step 1: repo was empty; created this file.
- Step 2: docs/recon.md written from the public listing (11 features, 4 must-haves: F1 capture, F2 film look, F3 camera presets, F9 save/share).
- Step 3: scaffold. Capacitor 8 + Android platform added, placeholder page in `www/index.html`, app id `com.nomoney.cam`. Not yet built anywhere.

## Next steps
1. Add .github/workflows/build-apk.yml (debug APK artifact on push) and confirm a green run.
2. Camera preview and photo capture (F1).
3. App shell with liquid-glass controls.
4. F9 save/share, then F2 film look, then F3 presets, one per commit.
5. Should-haves: gallery (F8), dust/frames (F4/F5), double exposure (F6), import (F7).

## Could be better
- Scaffold is unbuilt: there is no Android SDK in the authoring environment, so CI is the first real build.
- `npm install` printed audit warnings. Not reviewed yet. Do not run `npm audit fix --force`.
- App id `com.nomoney.cam` is a placeholder until the rebrand.
- Recon is thin: the listing names effect types but not parameters. Tune the look by eye on a real device.

## Decisions
- Stack: plain static web UI wrapped with Capacitor, because liquid-glass-js is a browser library. Repo was empty, so no existing stack to keep.
- No bundler: `www/` is served as is. Add one only if liquid-glass-js needs it.
- Capacitor 8 needs Java 21 and Node 22. The original task said JDK 17; that fails with this Capacitor version, so CI uses 21.
- No shop, payments or membership.

## Open questions
- Final app name and brand.
- Whether the glass effect performs well on low-end phones.
