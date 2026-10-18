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
- CI: `.github/workflows/build-apk.yml` builds a debug APK on every push. Download it from the run's Artifacts (`nomoney-cam-debug-apk`).

## Done
- Step 1: repo was empty; created this file.
- Step 2: docs/recon.md written from the public listing (11 features, 4 must-haves: F1 capture, F2 film look, F3 camera presets, F9 save/share).
- Step 3: scaffold. Capacitor 8 + Android platform added, placeholder page in `www/index.html`, app id `com.nomoney.cam`.
- Step 4: APK workflow added. First run (#1) green, uploaded a ~3.7 MB debug APK.

## Next steps
1. Camera preview and photo capture (F1).
2. App shell with liquid-glass controls.
3. F9 save/share, then F2 film look, then F3 presets, one per commit.
4. Should-haves: gallery (F8), dust/frames (F4/F5), double exposure (F6), import (F7).

## Could be better
- The APK has never been run on a device. Install it and check the camera permission prompt works before building more.
- CI has no Gradle cache and the actions are pinned to major tags only. Add a cache if builds get slow.
- The APK is debug-signed. It is for testing, not for release.
- `npm install` printed audit warnings. Not reviewed yet. Do not run `npm audit fix --force`.
- App id `com.nomoney.cam` is a placeholder until the rebrand.
- Recon is thin: the listing names effect types but not parameters. Tune the look by eye on a real device.
- Authoring environment's `gh` token is invalid, so CI status was checked through the public GitHub API instead.

## Decisions
- Stack: plain static web UI wrapped with Capacitor, because liquid-glass-js is a browser library. Repo was empty, so no existing stack to keep.
- No bundler: `www/` is served as is. Add one only if liquid-glass-js needs it.
- Capacitor 8 needs Java 21 and Node 22. The original task said JDK 17; that fails with this Capacitor version, so CI uses 21.
- No shop, payments or membership.

## Open questions
- Final app name and brand.
- Whether the glass effect performs well on low-end phones.
