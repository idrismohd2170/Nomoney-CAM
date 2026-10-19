# Recon

Source: the public listing description only, plus the user's own notes at the level of general technique. Features and flows, written fresh. No assets, names, look data, shader code or copy from the original.

The original is a minimalist analog film camera: you pick a virtual camera, shoot, and the photo gets a random film look automatically, with no manual editing. In our version everything is free and unlocked.

## Feature matrix

| # | Feature | Priority | Notes |
|---|---------|----------|-------|
| F1 | Live camera preview and capture at the camera's highest resolution | must | Front/rear toggle included. |
| F2 | GPU film pipeline: tone curve, colour grade, grain, vignette, sharpening | must | One WebGL shader pipeline for viewfinder and capture. CPU `develop()` stays as fallback and test reference. |
| F3 | Dust, light leak and frame overlays | must | Procedurally generated from a seed. |
| F4 | Camera library, 6+ original cameras | must | Own names and looks. Each shot picks random values inside the selected camera's ranges. All unlocked. |
| F5 | Camera picker | must | Minimal, glass-styled. One-tap shutter stays primary. |
| F6 | Live viewfinder shows the selected look | must | What you see is what you get. |
| F7 | Double exposure | must | Toggle, hold first shot, blend second, develop once. |
| F8 | Photo import from device | should | Imported photos get the selected camera's look. Paid in the original, free here. |
| F9 | Gallery: persist, view, delete, share, save | must | Survives app restarts. |
| F10 | Optional development wait | could | Settings toggle, default off. Paid to disable in the original, so ours is simply optional. |

## Out of scope
- Camera shop, purchases, membership, locked content: no payments in this project.
- Face beauty retouch, segmentation, any ML: not in the listing, would add heavy dependencies.
- Accounts, analytics, push, any backend.
- The original's specific cameras, look names, lookup data, shaders, frames and icons: proprietary.
- Any claim of matching the original's exact look.

## Build order
Recon -> GPU pipeline core (F2) -> overlays (F3) -> cameras (F4) -> picker (F5) -> viewfinder and full-res capture (F6, F1) -> double exposure (F7) -> import (F8) -> gallery and save (F9) -> development wait (F10) -> device checklist.

## Notes
- No reference screenshots or recordings exist yet. Tune looks by eye with our own numbers; add a `reference/` folder (gitignored, never shipped) if you want side-by-side comparison.
- Reviews of the original report Android bugs (cameras off-screen, filters vanishing). Keep parameters simple and test on a real device.
- Real-time GPU processing is the technique that makes a live look possible. A CPU loop per frame would be too slow on phones.
