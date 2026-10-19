# NOTES

Rewritten after every step. Read this first.

## Context
- Goal: clean-room Android film-camera app that rebuilds the features and flows of the app at
  https://play.google.com/store/apps/details?id=com.blink.academy.nomopro, using the public listing description only. Everything is free and unlocked.
- Clean-room: no decompiling, no original name, logo, icons, camera/look names, lookup data, shader code, frames or copy. Our own cameras, names and generated assets.
- Working name is the repo name. **Rebrand before any public release.**
- All code follows the ponytail skill (full level): smallest change that fully works.
- UI surfaces use https://github.com/dashersw/liquid-glass-js.
- Feature list and build order: docs/recon.md (rewritten in phase 2).
- Layout: `www/` is the web app (static, no bundler), `android/` is the generated Capacitor project, `capacitor.config.json` points Capacitor at `www/`.
- CI: `.github/workflows/build-apk.yml` builds a debug APK on every push. Download it from the run's Artifacts (`nomoney-cam-debug-apk`).
- Phase 2 direction: one WebGL shader pipeline drives both the live viewfinder and capture. CPU `develop()` in `www/film.js` stays as the fallback and the test reference.

## Done
- Phase 1 (steps 1-7c): scaffold, APK workflow, camera preview and capture, liquid-glass shell, CPU film look, three manual looks, share via the share sheet. All green in CI, none run on a real phone.
- Phase 2 step 1: docs/recon.md rewritten as a new feature matrix (F1-F10, no paid rows, no shop). `reference/` added to .gitignore in case reference media is supplied later.
- Phase 2 step 2: GPU pipeline core. `www/film-params.js` `makeParams(camera, seed)` (pure) turns a camera's ranges into concrete values plus a 256x1 per-channel tone curve and a 16^3 colour cube. `www/film-gl.js` `createRenderer()` is a one-pass WebGL shader: sharpen, tone curve, colour cube, grain, vignette. Capture now renders through it; CPU `develop()` remains the fallback when WebGL is missing. `www/cameras.js` holds placeholder cameras (Sunny, Mono, Dusk as value ranges). Each shot picks random values in the camera's ranges. Tests: `test/params.test.js`, `test/film.test.js`; CI runs every `test/*.test.js`. Checked in headless Chromium with SwiftShader: rendered a test scene with each camera and viewed it, the GPU result sits within about 4-5 levels of the CPU reference, two seeds differ, camera cycling and capture work end to end.
- Phase 2 step 3: overlays. `makeParams` now also draws a 512x512 overlay (soft light-leak glow from a random edge, dust specks, short hairs) from the seed, and picks a frame (rounded border, short-side fractions, colour) from the camera's `frames` list. The shader screen-blends the overlay and draws the frame last. `test/overlay.test.js` checks determinism, sparse dust, leak peak on an edge and tinted by its colour, and frame choices. Viewed each effect alone and a full camera in headless Chromium.
- Phase 2 step 4: camera library. `www/cameras.js` now has 8 own cameras (Amber, Fog, Noir, Ember, Moss, Peach, Snap, Slide), all unlocked, each a set of value ranges (tone, tint, saturation, vignette, grain, sharpening, dust, hairs, leak, frames). Every shot picks fresh values inside its camera's ranges. `test/cameras.test.js` checks: 6+ cameras, unique short names, no unknown fields (no price/lock/pro flags), ordered ranges, enough per-shot variation, and that cameras differ from one another. Viewed all 8 on one scene plus four Ember seeds: distinct looks, different leak/frame/dust per shot. App cycles through all 8 and shoots with each.
- Phase 2 step 5: camera picker. The cycle pill is gone. A scrollable row of frosted chips (one per camera, CSS `backdrop-filter`) sits over the bottom of the viewfinder; the selected chip is highlighted and scrolled into view. The dock is now thumbnail, shutter (liquid glass) and Share (liquid glass). Checked in headless Chromium with the fake camera: 8 chips, selecting 5, 7 and 1 sets the right camera, the strip scrolls, nothing overflows at 320, 360 and 412 px, shots from different cameras differ.
- Phase 2 step 6: live viewfinder and full-resolution capture. A second renderer draws every new camera frame through the same shader onto a canvas over the video (`requestVideoFrameCallback`, falling back to `requestAnimationFrame`; without WebGL the plain video shows). `next` holds the look of the next shot: the viewfinder shows it, the shutter uses exactly it, then a fresh one is made (so the dust, leak and frame you see are the ones you get). The preview stream asks for 1280 wide at 4:3; the photo uses `ImageCapture.takePhoto()` for the sensor's full size, going through a 2D canvas first (WebGL ignores the flip flag for bitmaps), and falls back to the preview frame. A Flip chip toggles front/rear (front preview mirrored, saved photo not). Checked in headless Chromium: Noir viewfinder has zero channel spread and Amber is coloured, the photo used the previewed look, a stubbed 4000x3000 still comes out the right way up at full size, the failure fallback gives the preview size, Flip restarts the stream.
- Bug found and fixed in step 2: a fixed 3-vector like `tint: [1,1,1]` was read as a [min,max] range and became NaN, blackening Mono. `pickVec` now handles vectors and the tests check for it.

## Next steps
1. Double exposure.
2. Photo import.
3. Gallery and save (persist, view, delete, share). Store blobs, not data URLs: a 12 MP data URL is a multi-megabyte string.
4. Optional development wait (settings toggle, default off).
5. docs/device-test.md and layout checks at 320/360/412 px.

## Could be better
- The picker chips are plain CSS frosted glass, not liquid-glass-js. The library gives every glass element its own WebGL context and a per-frame render loop, and 8 more of them would be too heavy on phones. Swap in real glass later only if it can share one context.
- The chips show no preview of each look; you pick by name. Showing the look in the viewfinder (next step) partly fixes this. A thumbnail per camera would help but costs a render each.
- `backdrop-filter` blur over live video is unmeasured on low-end phones. If it is slow, drop the blur and keep the translucent chip.
- Selecting a chip does not remember the choice across restarts.
- Camera numbers are guesses tuned only by eye on a synthetic scene (a drawn landscape). Real photos, skin tones and low light may need adjustment. Tune on a phone.
- The cameras are our own looks, not matched to any reference. A gitignored `reference/` folder of the user's own screenshots would allow side-by-side tuning.
- Camera names are placeholders, to be reviewed at the rebrand. The chips now fit longer names, but keep them short.
- No real-phone testing yet. The camera permission prompt, share sheet, glass rendering and (soon) WebGL performance are all unverified on a device.
- No reference screenshots or recordings. Looks will be tuned by eye. A gitignored `reference/` folder of the user's own screenshots would allow side-by-side comparison.
- Glass is a still: liquid-glass-js refracts one html2canvas snapshot of the page, not a live feed. Controls stay on the static bottom bar and never overlap the live preview.
- The glass snapshot is taken once at load. If layout or background changes later, glass refracts stale content. Retake it then.
- Vendored libraries are copies (liquid-glass-js has no npm package). Note the source commit when updating them.
- Only the latest shot is kept, in memory, until the gallery step.
- Share sheet is the only save path until the gallery step.
- The CPU fallback has no sharpening, colour cube (split tone), dust, light leak or frames (it has the tone curve, tint, saturation, vignette and grain). Only the GPU path does. Phones without WebGL get a plainer look.
- Scripts share one global scope (no bundler), so a top-level name in one file can break the inline app script. This already bit once (`pick`). Keep app-script variable names distinct from the helpers' names.
- No `webglcontextlost` handling: if the GPU context is lost, rendering stops until reload.
- html2canvas logs "Error loading image" for the empty thumbnail. Harmless, but could be silenced.
- `makeParams` (which draws the overlay) takes about 45-55 ms in desktop Chromium, probably several times that on a phone. It runs on each camera change and once after each shot (in a timeout), so expect a small hitch then. Could cache the overlay, shrink it, or build the next one in a worker.
- The overlay is 512x512 stretched over the picture, so dust specks get larger on full-resolution captures than on the viewfinder. Tune by eye.
- Frames crop into the picture (they cover the edges), they do not extend the canvas.
- Frame times measured only on SwiftShader (a software rasteriser, not a phone GPU): about 67 ms per viewfinder frame at 640x480, 154 ms at 1280x960, 1.8 s for a 4000x3000 capture. Real GPUs should be far faster, but nothing is measured on a phone. If the viewfinder stutters, lower the preview stream size or render at half size.
- `ImageCapture.takePhoto()` is unverified in the Android WebView. If it is missing or fails, photos fall back to the preview frame (about 1280 wide), which is much smaller than the sensor.
- Preview is requested at 4:3 but a phone's still may be a different shape or rotation, so the saved photo can frame slightly differently than the viewfinder. Check on a phone.
- The viewfinder grain, dust and leak are static (one draw per shot), not animated.
- Two WebGL contexts (viewfinder, capture) plus one per glass element. Browsers cap active contexts, and old phones may struggle. Unmeasured.
- The thumbnail is set from a data URL of the full-size JPEG. Heavy for 12 MP photos.
- CI has no Gradle cache and the actions are pinned to major tags only.
- The APK is debug-signed. It is for testing, not for release.
- `npm install` printed audit warnings. Not reviewed yet. Do not run `npm audit fix --force`.
- App id `com.nomoney.cam` is a placeholder until the rebrand.
- The authoring environment's `gh` token is invalid, so CI status is checked through the public GitHub API.

## Decisions
- Stack: plain static web UI wrapped with Capacitor, because liquid-glass-js is a browser library. No bundler.
- Capacitor 8 needs Java 21 and Node 22, so CI uses JDK 21.
- liquid-glass-js and html2canvas are vendored into `www/vendor/` (no CDN) so the APK works offline.
- Camera uses the WebView's `getUserMedia` with the manifest `CAMERA` permission, no camera plugin.
- Save/share uses the share sheet via `@capacitor/filesystem` and `@capacitor/share` (approved).
- Single source of parameters: cameras are value ranges, `makeParams` makes concrete values, and both the shader and the CPU fallback read them.
- The viewfinder renders through its own WebGL context at the preview size, capture through a second offscreen one at full size, both reading the same `next` look object, so what you see is what you get.
- The picker is a row of CSS frosted chips over the viewfinder, not liquid-glass-js (see Could be better). The shutter and Share keep liquid glass.
- Looks run on the GPU (WebGL shader pipeline) because a per-frame CPU loop is too slow for a live viewfinder on phones.
- No shop, payments, membership, locked content, face beauty or ML.

## Open questions
- Final app name and brand.
- Whether WebGL plus the glass effect performs well on low-end phones.
- Do you want glass over the live preview? It would need a different approach than snapshot sampling.
- Is `getUserMedia` at its highest resolution good enough, or do we need a native camera plugin?
