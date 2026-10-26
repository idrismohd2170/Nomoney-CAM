# NOTES

Rewritten after every step. Read this first.

## Context
- Goal: a clean-room Android film-camera app that rebuilds the features and flows of a Play Store film-camera app using only its public listing description. Everything is free and unlocked: no shop, lock, membership or pro label (the camera test rejects such fields).
- Clean-room: no decompiling, no original name, logo, icons, camera or look names, lookup data, shader code, frames or copy. Our own cameras, names and generated assets. Brand and model names of real cameras and films appear ONLY in `docs/camera-research.md` (as "inspired by"); code, UI labels, file names and these notes use our own names.
- Working name is the repo name. **Rebrand before any public release** (name, app id, icon). Review camera names then too ("Portrait 400" sits close to a real film name).
- All code follows the ponytail skill: smallest change that fully works, one self-check for non-trivial logic.
- Stack (locked): static web app in `www/` (no bundler, scripts share ONE global scope, so top-level names must not collide) wrapped by Capacitor 8 for Android (`android/`, `capacitor.config.json` points at `www/`). No dependencies added.
- CI: `.github/workflows/build-apk.yml` (JDK 21, Node 22) runs every `test/*.test.js` and builds a debug APK on every push. Download it from the run's Artifacts (`nomoney-cam-debug-apk`). The gh token may be invalid; read runs from `https://api.github.com/repos/idrismohd2170/Nomoney-CAM/actions/runs?head_sha=<sha>`.
- Look: "darkroom" (`www/ui.css`): near-black base, warm paper ink, Geist (vendored, SIL OFL), 1.5px outline icons from one SVG sprite, hairline rings, bezel shells, one easing curve. The shutter is liquid glass (liquid-glass-js, vendored) on the static bottom bar only; everything over live video is CSS frosted glass. taste-skill rules that fit a camera app were applied (no emoji, no tinted icon circles, one gutter, reduced-motion support).

## How it fits together
- `www/film-params.js`: `makeParams(camera, seed)` (pure, seeded) turns a camera (value ranges) into concrete numbers plus a 256x1 tone curve, a 16^3 colour cube and a 512^2 dust/light-leak overlay; also `flashGain`, `stampText`, `stampBox`. About 50 ms on desktop per call.
- `www/film-gl.js`: one-pass WebGL shader (sharpen, tone curve, colour cube, grain, vignette, flash falloff, dust/leak screen blend, frame with optional thicker bottom) for the live viewfinder and the capture. `www/film.js` `develop()` is the CPU fallback and test reference (no sharpening, split tone, dust, leak, frame or flash falloff; it does get the date stamp).
- `www/cameras.js`: 20 cameras as value ranges. Fields beyond the film numbers: `family` (picker group, none = Classic), `ui` (chrome variant), `theme` (CSS token overrides), `fmt` (picture shape picked with the camera), `flash` (falloff 0-1), `stamp` (chance per shot of an orange date), frames with `bottom` (thick print strip).
- `www/theme.js`: `themeOf(camera)` (pure) maps `ui` and `theme` to CSS variables. The app sets them and `data-ui` on `#view` and `#bar` only, so the gallery and settings keep the neutral root look. `#chrome` (inside `#stage`) is the per-variant overlay. Variants: dark (default), mono, warm, print, film, slide, flash.
- `www/modes.js`: pure helpers for formats, crop, timer, roll, and `camFamilies`. `www/store.js`: IndexedDB shots (thumb + full JPEG). `GallerySaverPlugin.java`: save to Pictures/NomoneyCAM.
- App script in `www/index.html`: `finish()` develops a frame (GPU or CPU) and `burn()` draws the date stamp on a 2D copy; `showPrint()` runs the cosmetic print animation for `print` cameras (copy of the shot in `#reveal`, CSS only, never delays saving); `choose()`/`showCams()` drive the picker (six family tabs over the chips of the open family).
- Cameras: Classic (Amber, Fog, Ember, Moss, Peach, Snap), B&W (Noir, Grit 400), Slide (Slide, Vivid 50, Clear 100), Instant (Mini Print, Square Print, Wide Print), Film (Daylight 200, Everyday 400, Portrait 400, Verdant 400), Flash (Flash 400, Party 800).

## Done
- Phase 1: scaffold, APK workflow, camera preview and capture, liquid-glass shell, share.
- Phase 2: GPU pipeline, overlays (dust, leak, hairs, frames), 8 own cameras, picker, live viewfinder with full-size capture (the viewfinder shows the look the next shot will use), double exposure.
- Phase 3: gallery and storage, save to Pictures, photo import, optional development wait, darkroom redesign, modes (format 3:2/4:3/1:1/Half, timer, roll, torch), device test checklist (`docs/device-test.md`).
- Camera families (steps 1-9, each pushed with CI green):
  1. Research: `docs/camera-research.md`, 12 targets (3 instant, 4 colour negative, 2 slide, 1 B&W, 2 disposable, two manufacturers), every claim cited or `[uncertain]`. Gaps closed later: four manufacturer data sheets and a disposable-camera review. Still open: the square instant camera's specs and a review of the instant-print look (those looks stay `[uncertain]`, built from the brief).
  2. Theme system (`theme.js`, `ui`/`theme` fields, persisted with the camera choice).
  3. Effects in `makeParams`: thick-bottom frame, flash falloff, date stamp.
  4. Instant family with the print animation.
  5. Colour negative family (honest finding: the sources call the consumer 200-speed stock neutral, not warm).
  6. Slide and B&W (the current slide sheet says "low contrast", so Clear 100 only gets moderate contrast; Grit 400 is a pushed look so it differs from Noir).
  7. Disposable family with the stamp (no source mentions a stamp on single-use cameras, so it is an optional extra).
  8. Picker grouped by family (a first draft was in the working tree uncommitted; reviewed, kept, verified).
  9. Device checklist, contact sheet of all new themes at 360 px (`docs/design/themes-360.png`), these notes.
- Verified in headless Chromium (SwiftShader software GPU, fake camera): all 20 cameras selectable at 320, 360 and 412 px, no overflow or overlap, each new theme screenshotted at 360 px and viewed, rendered samples of every family viewed, print animation runs and ends, a stored full photo carries the orange stamp bottom-right, the choice survives a reload. Node tests: params, film, overlay (frames, flash, stamp), cameras (fields, themes, families, distinctness), modes, store.
- Audit fixes (browser-verified): imports no longer join an open roll or get a date stamp; quick Flip taps no longer leave extra camera streams running. Audit items left open on purpose: the Back button probably closes the app from the gallery (check on a phone, then handle with history entries, no dependency), no automated browser test (needs a dev dependency: ask first), two leftover Android template tests and `allowBackup` (android/ and file deletion: ask first), shared photos stay in the cache.
- Bugs found by running the page and fixed: `pickVec` read a fixed 3-vector as a range; `#empty{display:flex}` beat `hidden`; `getCapabilities` called detached from its track; `$` used before its `const` (emptied the picker).

## Next steps
1. Run `docs/device-test.md` on a real phone (sections 1-10) and fix what fails: save into Photos, full-size capture, format crop vs photo, torch, viewfinder speed with the new effects, print animation, stamp size, theme rendering on the phone's WebView.
2. Tune the looks on real photos (skin tones, low light, bright sky) with a gitignored `reference/` folder of your own screenshots for side-by-side tuning. Numbers so far were set by eye on drawn test scenes.
3. Close the last research gap (the square instant camera's specs, an instant-print look review) and re-check the three instant looks against it.
4. Rebrand: name, app id, icon, camera names.

## Could be better
- Nothing has run on a real phone: camera permission, share sheet, glass rendering, WebGL speed, the picker, themes, print animation, stamp. Frame times were only measured on SwiftShader (about 67 ms per viewfinder frame at 640x480, 154 ms at 1280x960, 1.8 s for a 4000x3000 capture).
- Looks: all numbers are by eye on synthetic scenes. The instant looks have no published look data (flash falloff, lifted blacks come from the brief); the warm lean of Daylight 200, plastic-lens vignette amounts and the green lean of Verdant 400 are design choices, flagged in the research doc.
- Frames crop into the picture instead of extending the canvas, so a print frame hides some of the shot. The overlay is 512x512 stretched over the picture, so dust gets larger on full-size captures.
- The date stamp is not shown in the viewfinder and is a fixed size and place (bottom right). It sits in the thumbnail too. Imports never get one.
- Selecting an instant camera overrides the chosen picture shape (the user can change it afterwards; a saved shape is not overridden at startup).
- The glass shutter refracts one snapshot taken at load, so a theme change recolours its dot and ring but not the glass. The snapshot is never retaken.
- Themes need `color-mix()` (Android System WebView from about 2023); older ones show default accents. Variants are shared by family, not one chrome per camera, on purpose (cost).
- `backdrop-filter` blur over live video is unmeasured on low-end phones; if slow, drop the blur and keep the translucent chip. Liquid glass on every chip would be too heavy (one WebGL context each).
- `makeParams` costs about 50 ms on desktop, probably several times that on a phone, once per camera change and once after each shot. Could cache or shrink the overlay or build it in a worker.
- No `webglcontextlost` handling: if the GPU context is lost, rendering stops until reload.
- The CPU fallback lacks sharpening, split tone, dust, leak, frames (so no print border) and flash falloff, so phones without WebGL get a plainer look. It does draw the date stamp.
- The print animation copies the finished shot into a 360 px canvas on every `print` shot (cheap, unmeasured on a phone). It does not play for imports.
- Modes were checked with a landscape fake camera and stubbed stills; a real preview may arrive rotated or in a different shape than the still, so the crop in the viewfinder could differ from the saved photo. The Half held frame covers the whole picture area at 40% instead of its own half.
- A roll hides its photos until it ends, so a crash mid-roll leaves them stored but hidden (the roll chip ends it). The roll counter counts saved photos, not presses.
- Double exposure holds up to three full-size canvases (about 48 MB each at 12 MP); the blend mode is random per pair; the held frame is lost if the app closes mid-pair.
- During the development wait the photo exists only in memory (closing the app within 3 s loses it).
- Import runs photos one after another on the main thread and shrinks images larger than the GPU texture limit; it does not read the original date or location.
- Gallery: no multi-select, no pagination, no swipe between photos. Photos live in the WebView's IndexedDB, so clearing app data deletes them; Save to Photos is the durable copy. Save sends the whole JPEG to Java as base64 (several MB at 12 MP); saved names are the shot id; saving twice makes two files; the Android 7-9 permission path is untested.
- Icon buttons have aria labels but no tooltips; the top pill is icon-only. The faint warm gradient on the bottom bar and sheets goes against taste-skill's no-gradient rule.
- Torch is untested on a real phone (front cameras never report it). The timer has no sound or haptics.
- Vendored libraries are copies (liquid-glass-js has no npm package): note the source commit when updating. html2canvas logs "Error loading image" for the empty thumbnail (harmless).
