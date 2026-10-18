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
- Step 1: NOTES.md created.
- Step 2: docs/recon.md written from the public listing (11 features, 4 must-haves: F1 capture, F2 film look, F3 camera presets, F9 save/share).
- Step 3: scaffold. Capacitor 8 + Android platform, app id `com.nomoney.cam`.
- Step 4: APK workflow. Runs #1 and #2 green, ~3.7 MB debug APK each.
- Step 5 (F1): live rear-camera preview (`getUserMedia`), shutter draws the frame to a canvas and shows it as a thumbnail. `CAMERA` permission added to the manifest. Not yet run on a device.

## Next steps
1. Install the APK on a phone and confirm the permission prompt and preview work. Fix first if not.
2. App shell with liquid-glass controls (replace the plain shutter and thumbnail).
3. F9 save/share, then F2 film look, then F3 presets, one per commit.
4. Should-haves: gallery (F8), dust/frames (F4/F5), double exposure (F6), import (F7).
5. Could-haves: front/rear toggle (F11), development wait (F10).

## Could be better
- The APK has never been run on a device. Camera preview and permission flow are unverified.
- Capture is in memory only: the thumbnail is lost on restart until F9 lands.
- Captures use the preview's resolution, not the sensor's full resolution. Revisit with ImageCapture or a native plugin if quality matters.
- No front/rear toggle, so a device with no rear camera falls back to whatever the browser picks.
- CI has no Gradle cache and the actions are pinned to major tags only. Add a cache if builds get slow.
- The APK is debug-signed. It is for testing, not for release.
- `npm install` printed audit warnings. Not reviewed yet. Do not run `npm audit fix --force`.
- App id `com.nomoney.cam` is a placeholder until the rebrand.
- Recon is thin: the listing names effect types but not parameters. Tune the look by eye on a real device.
- The authoring environment's `gh` token is invalid, so CI status is checked through the public GitHub API.

## Decisions
- Stack: plain static web UI wrapped with Capacitor, because liquid-glass-js is a browser library.
- No bundler: `www/` is served as is. Add one only if liquid-glass-js needs it.
- Capacitor 8 needs Java 21 and Node 22. The original task said JDK 17; that fails with this Capacitor version, so CI uses 21.
- Camera uses the WebView's `getUserMedia` with the manifest `CAMERA` permission, no camera plugin: fewer dependencies.
- No shop, payments or membership.

## Open questions
- Final app name and brand.
- Whether the glass effect performs well on low-end phones.
- Is `getUserMedia` quality good enough, or do we need a native camera plugin?
