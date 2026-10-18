# Recon

Source: the public Play listing only. Features and flows, written fresh. No assets, names or copy from the original.

The original is a minimalist analog film camera: you pick a virtual camera, shoot, and the photo gets a film look automatically, with no manual editing.

## Feature matrix

| # | Feature | Priority | Notes |
|---|---------|----------|-------|
| F1 | Live camera preview and photo capture | must | Rear/front switch is a could. |
| F2 | Automatic film look applied after capture | must | Own implementation on canvas: tone curve, grain, vignette, sharpening. |
| F3 | Pick from several virtual cameras (looks) | must | Our own presets with our own names and parameters. |
| F4 | Dust and light-leak overlays | should | Generated procedurally, not copied. |
| F5 | Frames / borders | should | Simple generated borders. |
| F6 | Double exposure (blend two photos) | should | Capture or import a second image, blend into one. |
| F7 | Photo import from gallery | should | Original gates this behind its paid tier. |
| F8 | Gallery of saved shots | should | Needed to view results. |
| F9 | Save and share to device | must | Store the processed image. |
| F10 | Optional "development wait" before a shot appears | could | Pure delay, skip unless asked. |
| F11 | Front/rear camera toggle | could | |

## Out of scope
- Camera shop, purchases and membership: no payments in this project.
- The original's specific cameras, filter data, frames and icons: proprietary.
- Any claim of matching the original's exact look.

## Build order
F1 -> F9 -> F2 -> F3 -> app shell -> F8 -> F4/F5 -> F6/F7 -> could items.

## Notes
- Reviews report Android bugs in the original (cameras off-screen, filters vanishing). Keep presets simple and test on a real device.
