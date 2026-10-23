# Device test checklist

Nothing in this app has run on a real phone yet. Install the debug APK from the latest CI run (Actions, newest run, Artifacts, `nomoney-cam-debug-apk`), then go through this list top to bottom. Note any line that does not match. Android 10 or newer is the main target; lines marked (A7-9) are for older phones.

## 1. First start
1. Open the app. **Expect:** a camera permission prompt. Allow it.
2. **Expect:** a live picture with the Amber look (grain, slight vignette). The top pill shows four icons, the picture area has a row of mode chips (3:2, Timer, Roll) and camera chips under it, and the bottom bar shows an empty photo tile, a round orange-ring shutter and two round buttons (save, share).
3. If you see "Camera unavailable", note the name that follows it.

## 2. Viewfinder shows the look
1. Tap each camera chip (Amber, Fog, Noir, Ember, Moss, Peach, Snap, Slide). **Expect:** the live picture changes at once. Noir is black and white, Ember is warm and strong, Fog is pale and cool.
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
- **Remembered settings:** pick Ember, 1:1 and Timer 10s, close the app completely and reopen. **Expect:** the same choices are still selected.

## 9. Layout
Rotate nothing; the app is for portrait. Check that nothing is cut off or overlaps on your phone's screen, especially the top pill, the mode chips, the bottom bar and the viewer buttons. Pull the notification shade down and up; the layout should return.

## What to send back
For each section: pass or fail, and for any fail the exact text of any message shown and what you tapped.
Things most likely to need work: save into Photos, full-resolution capture, the viewfinder format shape matching the photo, torch, and how smooth the live picture is on your phone.
