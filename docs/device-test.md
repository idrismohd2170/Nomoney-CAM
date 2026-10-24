# Device test checklist

Nothing in this app has run on a real phone yet. Install the debug APK from the latest CI run (Actions, newest run, Artifacts, `nomoney-cam-debug-apk`), then go through this list top to bottom. Note any line that does not match. Android 10 or newer is the main target; lines marked (A7-9) are for older phones.

## 1. First start
1. Open the app. **Expect:** a camera permission prompt. Allow it.
2. **Expect:** a live picture with the Amber look (grain, slight vignette, warm brown controls). The top pill shows four icons, the picture area has a row of mode chips (3:2, Timer, Roll), a row of six family tabs (Classic, B&W, Slide, Instant, Film, Flash) and the camera chips of the open family under it, and the bottom bar shows an empty photo tile, a round orange-ring shutter and two round buttons (save, share).
3. If you see "Camera unavailable", note the name that follows it.

## 2. Viewfinder shows the look
1. Open each family tab and tap each camera chip: Classic (Amber, Fog, Ember, Moss, Peach, Snap), B&W (Noir, Grit 400), Slide (Slide, Vivid 50, Clear 100), Instant (Mini Print, Square Print, Wide Print), Film (Daylight 200, Everyday 400, Portrait 400, Verdant 400), Flash (Flash 400, Party 800). **Expect:** the live picture changes at once; the section 10 list says what each should look like. Noir is black and white, Ember is warm and strong, Fog is pale and cool.
2. Note whether the picture stays smooth. Write down if it stutters (the shader runs every frame; phone speed is unmeasured).
3. Tap the flip icon (third in the top pill). **Expect:** the front camera, mirrored. Tap again for the rear camera.

## 3. Take photos and save
1. Tap the shutter. **Expect:** the tile at the bottom left shows the new photo within about a second.
2. Take a second photo with the same camera. **Expect:** it looks different (dust, light leak or frame differ).
3. Tap the save button (down arrow in a tray). **Expect:** a message "Saved to Pictures/NomoneyCAM". Open the phone's Photos or Gallery app. **Expect:** the photo is in a NomoneyCAM album. (A7-9: a storage permission prompt appears first.)
4. Tap the share button. **Expect:** the system share sheet with the photo. Cancel it; no error message.
5. Check the photo size: open its details in Photos. Write down the resolution. It should be the camera's full photo size, not about 1280 pixels wide.

## 4. Gallery
1. Tap the photo tile. **Expect:** a gallery grid with both photos, newest first.
2. Tap a photo. **Expect:** a full-screen viewer with Save, Share and Delete.
3. Tap Delete, then confirm. **Expect:** back in the grid with one photo fewer.
4. Close the app completely (swipe it away) and open it again. **Expect:** the tile shows your newest photo and the gallery still lists your remaining photos.

## 5. Double exposure
1. Tap the double icon (two overlapping circles). **Expect:** it lights up orange.
2. Tap the shutter once. **Expect:** no new photo; the first frame stays faintly over the live picture.
3. Point at something else and tap the shutter again. **Expect:** one photo that mixes both scenes.
4. Tap the double icon again to turn it off. A half-finished pair is dropped.

## 6. Import
1. Tap the import icon (picture with a plus). **Expect:** the phone's file or photo picker.
2. Choose two photos. **Expect:** "2 photos imported", and both appear in the gallery with the selected camera's look, the right way up.

## 7. Settings: film development wait
1. Tap the settings icon (sliders). **Expect:** a Settings sheet with one switch, Off.
2. Switch it on, close, take a photo. **Expect:** the tile pulses and the photo shows up about 3 seconds later. Close the app and reopen: the switch is still on.
3. Switch it off. **Expect:** photos appear at once again.

## 8. Camera modes
- **Format:** tap the first mode chip repeatedly: 3:2, 4:3, 1:1, Half. **Expect:** the picture area changes shape each time. Take a photo in each and open it in the gallery: its shape matches the viewfinder. Write down any mismatch.
- **Half:** in Half mode take two photos. **Expect:** the first press keeps a faint frame, the second makes one wide picture with two portrait frames side by side. Double exposure is refused with a message in this mode.
- **Timer:** tap Timer until it says 3s, press the shutter. **Expect:** a big countdown 3, 2, 1, then a photo. Press the shutter during the countdown to cancel: "Cancelled", no photo.
- **Roll:** tap Roll until it says 12. **Expect:** a counter on the tile, for example 0/12. Take 12 photos. **Expect:** during the roll the tile and the gallery do not show them; after the 12th a message says the roll is developed and all 12 appear. (To shorten the test, tap Roll again to end a roll early; its photos then appear.)
- **Torch:** the lightning-bolt chip should appear only on the rear camera if the phone has a flashlight. Tap it. **Expect:** the light turns on and stays on while you take a photo. Tap again to turn it off. If the chip never appears, note it.
- **Remembered settings:** pick Ember, 1:1 and Timer 10s (in the Classic tab), close the app completely and reopen. **Expect:** the same choices are still selected.

## 9. Layout
Rotate nothing; the app is for portrait. Check that nothing is cut off or overlaps on your phone's screen, especially the top pill, the mode chips, the bottom bar and the viewer buttons. Pull the notification shade down and up; the layout should return.

## 10. New cameras, themes and picker
**Picker.** Tap each family tab. **Expect:** its chips replace the row under it, the tab lights up, and the camera you were on in that family is selected again (first visit: its first camera). Tap a chip in another family: it takes two taps at most (tab, chip). The selected chip and its tab are always on screen. Nothing overlaps the mode chips above or the bottom bar below. Close the app completely and reopen: the same camera, tab and theme are back. Note any chip cut off at the screen edge.

**Themes.** Each camera restyles the live-view controls and the bottom bar (accent colour of the shutter dot, chip shape, text weight), and draws a thin line or marks over the picture. The gallery and Settings stay the same neutral dark look whichever camera is selected. **Expect**, per family:
- Classic: Amber is warm brown with rounded chips and an inset rounded line; the others use the default dark controls.
- B&W: Noir and Grit 400 have square chips in capitals and corner marks over the picture.
- Slide: a thin pale border like a cardboard mount, square chips; Vivid 50 teal, Clear 100 light blue.
- Instant: paper-toned controls and a lighter strip along the bottom of the picture; accents pink, teal and amber.
- Film: an inset line and a small focus circle in the middle; accents honey, terracotta, rose and sage.
- Flash: an inset line and a small autofocus box; bold chips; orange and violet.

**Looks (take one photo with each and compare in the gallery).**
- Mini Print, Square Print, Wide Print: picking one changes the shape of the picture area (4:3, 1:1, 3:2); each photo has a paper-coloured border that is thicker at the bottom, soft bright centre with darker corners, slightly lifted blacks. After the shutter a small print slides out in the live view and turns from pale to clear in about 3 seconds, then disappears. **Check:** the photo is stored at once (tile updates) even with the development wait switch on, and the print animation does not hold anything up. Note whether the animation is smooth.
- Daylight 200 (clean, near-neutral), Everyday 400 (warmer, grainier), Portrait 400 (soft, fine grain), Verdant 400 (cooler, crisper): four visibly different looks on the same scene.
- Vivid 50 (very saturated, hard contrast), Clear 100 (clean, neutral, bright whites), Grit 400 (black and white, hard contrast, coarse grain, darker corners).
- Flash 400, Party 800: flash-lit centre with dark corners and a plastic-lens look. Take about ten photos with each: roughly half (Flash 400) or a bit more (Party 800) carry an orange date like '26 10 25 in the bottom-right corner, burned into the saved photo (it is not shown in the live view). Open one in Photos and check the date is the real date and readable, not cut off.

## What has not run on a real phone
Everything in this list: the 20 cameras, all themes, the print animation, the picker, the date stamp, and the speed of the live view with the new effects. The only checks so far were node tests, CI builds, and headless Chromium with a software GPU and a fake camera, at 320, 360 and 412 px. The `color-mix()` CSS used by the themes needs an Android System WebView from about 2023 on (an older one shows the default accent colours).

## What to send back
For each section: pass or fail, and for any fail the exact text of any message shown and what you tapped.
Things most likely to need work: the speed of the live view with the flash falloff and frames, the print animation, the date stamp size, save into Photos, full-resolution capture, the viewfinder format shape matching the photo, torch, and how smooth the live picture is on your phone.
