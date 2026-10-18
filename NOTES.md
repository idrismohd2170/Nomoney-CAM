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
- Step 6: liquid-glass shell. Library files vendored into `www/vendor/` (container.js, button.js, glass.css, plus html2canvas 1.4.1, both MIT, licenses alongside). Shutter is now a glass circle button inside a glass pill dock on a gradient bottom bar. Checked in headless Chromium with a fake camera: glass renders, click captures a frame.
- Step 7a (F2): film look. `www/film.js` `develop()` applies S-curve contrast, lifted blacks, colour tint, saturation, vignette and grain to every capture (hardcoded to the `sunny` preset for now). Pure function, so `node test/film.test.js` checks it with no browser; CI runs that test before the APK build. Checked a real capture in headless Chromium: grain, vignette and fade visible.

## Next steps
1. Install the APK on a phone and confirm the permission prompt, preview and glass button work. Fix first if not.
2. F3 presets: three are already defined in `film.js` (sunny, mono, dusk), add a glass button to pick one.
3. F9 save/share the captured photo. Needs a Capacitor plugin (Filesystem and/or Share): ask before adding, WebView cannot download or share files by itself.
4. Should-haves: gallery (F8), dust/frames (F4/F5), double exposure (F6), import (F7).
5. Could-haves: front/rear toggle (F11), development wait (F10).

## Could be better
- No sharpening pass in the film look (needs a neighbour kernel). Add it if shots look soft on a device.
- Preset numbers are guesses tuned only against a test pattern. Tune by eye on real photos.
- `develop()` runs on the main thread over every pixel. Fine in testing, unmeasured on a phone at full camera resolution. Downscale or use a worker if capture feels slow.
- Glass is a still: liquid-glass-js refracts one html2canvas snapshot of the page, not a live feed. So controls stay on the static bottom bar and never overlap the live preview. Glass floating over the video would show a frozen frame.
- The snapshot is taken once at load. If the bar's layout or background changes later (rotation, new controls), the glass will refract stale content. Retake it then.
- The thumbnail is a plain image beside the dock, not glass. Could move into the dock.
- Vendored libraries are copies (liquid-glass-js has no npm package). Note the source commit when updating them.
- WebGL cost on low-end phones is unmeasured.
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
- liquid-glass-js and html2canvas are vendored into `www/vendor/` (no CDN) so the APK works offline.
- Camera uses the WebView's `getUserMedia` with the manifest `CAMERA` permission, no camera plugin: fewer dependencies.
- Film look is plain canvas maths in a pure function, no image library. Looks are our own named presets.
- No shop, payments or membership.

## Open questions
- Final app name and brand.
- Whether the glass effect performs well on low-end phones.
- Do you want glass over the live preview? It would need a different approach than snapshot sampling.
- Is `getUserMedia` quality good enough, or do we need a native camera plugin?
