# Camera research

Step 1 of the camera-family work. Research only, no code. Brand and model names appear **only in this file**, as "inspired by". The app uses its own short names (the "Our name" column). Nothing here is copied from any LUT, preset or other app's filter data; every look is described from published characteristics and then translated by hand into our own parameters.

Rules used: each claim has a source URL or an `[uncertain]` flag. An `[uncertain]` claim is never the only basis for a look. Where a data sheet gave no number (for example contrast), that is stated rather than guessed.

Our parameters (from `www/cameras.js`): `contrast`, `fade` (lifted blacks), `tint` (overall cast, r/g/b gain), `shadow` and `high` (split-tone offsets), `sat`, `vignette`, `grain`, `grainSize`, `sharpen`, `dust`, `hairs`, `leak`, `leakColor`, `frames`. Step 3 may add: thick-bottom frame, date stamp, flash falloff.

## Summary

| # | Inspired by | Family | Our name (proposed) |
|---|---|---|---|
| 1 | Fujifilm instax mini | Instant, portrait | Mini Print |
| 2 | Fujifilm instax SQUARE | Instant, square | Square Print |
| 3 | Fujifilm instax WIDE | Instant, landscape | Wide Print |
| 4 | Kodak Gold 200 | Colour negative 35mm | Daylight 200 |
| 5 | Kodak Ultramax 400 | Colour negative 35mm | Everyday 400 |
| 6 | Kodak Portra 400 | Colour negative 35mm | Portrait 400 |
| 7 | Fujifilm Superia X-TRA 400 | Colour negative 35mm | Verdant 400 |
| 8 | Fujifilm Velvia 50 | Slide | Vivid 50 |
| 9 | Kodak Ektachrome E100 | Slide | Clear 100 |
| 10 | Kodak Tri-X 400 | Black and white | Grit 400 |
| 11 | Fujifilm QuickSnap Flash 400 | Disposable | Flash 400 |
| 12 | Kodak FunSaver | Disposable | Party 800 |

Fujifilm: 6 entries. Kodak: 6 entries.

---

## Instant (instax family)

Shared facts, used by 1-3.

- Three print formats. Image area / whole print: mini 46 x 62 mm in 54 x 85 mm, SQUARE 62 x 62 mm in 86 x 72 mm, WIDE 99 x 62 mm in 108 x 85 mm. Source: https://instax.co.uk/faq/what-instax-film-formats-do-you-offer/ (the page gives sizes only; shapes are inferred from the dimensions).
- The image sits high on the print with a thicker strip below it. This follows from the sizes above (for mini the print is 85 mm tall and the image 62 mm tall, so 23 mm of border is shared between top and bottom) but **how it is split is not stated by any source I loaded** `[uncertain]`. The brief asks for a "thick-bottom" print frame, so step 3 builds it from the print/image size ratios above and tunes the split by eye.
- Film speed ISO 800. Source: https://en.wikipedia.org/wiki/Instax (mini and WIDE rated ISO 800/30; Square listed as ISO 800). The camera spec page also lists exposure as "Lv 5.0 to 14.5 (ISO 800)": https://www.instax.com/mini41/en/spec/
- Development about 90 seconds, depending on temperature. Source: https://www.instax.com/mini41/en/spec/ (mini) and https://en.wikipedia.org/wiki/Instax (WIDE).
- Flash: constant-firing with automatic light adjustment, effective range 0.3 m to 2.2 m on the mini camera listed. Source: https://www.instax.com/mini41/en/spec/ . Close flash range is the only published basis for "flash falloff"; how steep the falloff looks is **not published** `[uncertain]` and is tuned by eye.
- No source I loaded describes colour cast, contrast, grain or lifted blacks for the instant films. The manufacturer pages list no look-related specs (https://www.instax.com/mini41/en/spec/). So the **brief's description (soft flash falloff, slightly lifted blacks) is taken as the design intent, not as a measured fact** `[uncertain]`, and the look is built from the brief plus ISO 800 behaviour in general (coarser grain than a 100-200 film, which is a general photographic fact, not a cited one).

### 1. instax mini (Mini Print)
- Facts: 46 x 62 mm image, portrait, ISO 800, about 90 s development. https://www.instax.com/mini41/en/spec/
- Mapping: small portrait print frame with thick bottom; `fade` 0.06-0.12 (lifted blacks, design intent); `contrast` low-mid 0.15-0.3; `tint` slightly warm; `sat` 0.95-1.1; `grain` low-mid, `grainSize` large; `vignette` 0.2-0.3; `sharpen` low 0.05-0.15 (soft look, design intent); flash falloff stronger toward edges (close range 0.3-2.2 m).

### 2. instax SQUARE (Square Print)
- Facts: 62 x 62 mm image, 1:1, ISO 800. https://instax.co.uk/faq/what-instax-film-formats-do-you-offer/ , https://en.wikipedia.org/wiki/Instax
- Mapping: 1:1 print frame with thick bottom (print 86 x 72 mm per the FAQ is wider than tall because the extra length is the bottom strip; `[uncertain]` on exact proportions). Slightly cooler and cleaner than mini so the two are distinct: `tint` neutral to a touch cool, `fade` 0.05-0.1, `sat` 0.9-1.05, `leak` 0.

### 3. instax WIDE (Wide Print)
- Facts: 99 x 62 mm image, aspect about 1.6:1, ISO 800/30. https://en.wikipedia.org/wiki/Instax ; sizes also on the manufacturer page https://fujifilm.com/sg/en/consumer/instax/cameras/wide300/films
- Mapping: landscape print frame with thick bottom, `fade` 0.05-0.1, `sat` 1.0-1.15, `vignette` 0.15-0.25, small warm `leak`.

---

## Colour negative 35mm

### 4. Kodak Gold 200 (Daylight 200)
- Facts, from the Kodak tech sheet (E-7022) https://www.kodakprofessional.com/sites/default/files/wysiwyg/pro/resources/E7022%20Gold%20tech%20sheet.pdf :
  - ISO 200 in daylight or electronic flash, no filter; exposure latitude "two stops underexposure to three stops overexposure";
  - described as an "outstanding combination of color saturation, fine grain, and high sharpness", "bright, colorful prints";
  - grain given only as Print Grain Index: 44 for a 4 x 6 in print from 135 (25 is the approximate visual threshold); rms granularity not published;
  - contrast, skin-tone rendering and colour cast are **not published** by the sheet.
- Review (secondary) https://photofocus.com/reviews/kodak-gold-200-review-a-triumphant-return-to-medium-format/ : balance "nice and neutral", saturation "a bit more saturated than Portra, but not quite so much as Ektar", slightly grainier than Portra 160, the reviewer usually added scan contrast.
- **The popular "warm yellow" idea is not supported by the two sources read, so it is not used** `[uncertain]`. Mapping: near-neutral with a very small warm lean (design choice for variety), `sat` 1.05-1.15, `contrast` 0.26-0.34 (gentle; no published number), `grain` 0.04-0.055 (PGI 44), `sharpen` 0.2-0.3, small `vignette`.

### 5. Kodak Ultramax 400 (Everyday 400)
- Facts, from the Kodak data sheet (E-7023) https://kodakprofessional.com/sites/default/files/wysiwyg/pro/resources/E7023_max_400.pdf :
  - ISO 400/27, daylight balanced, "tolerant of mixed-lighting situations";
  - "consistently bright, vibrant colors with accurate skin-tone reproduction"; "fine grain and high sharpness";
  - grain given only as PGI 46 (4 x 6 in print from 135), a little above Gold 200's 44;
  - no numeric contrast or saturation.
- Review (secondary) https://parallaxphotographic.coop/kodak-ultramax-400-film-review/ : natural, true-to-life colour, warm tones contribute to the look, "reasonable saturation and contrast", good detail in highlights and shadows.
- Mapping: warm and natural: `tint` r-b about +0.08, `sat` 1.1-1.2, `contrast` 0.32-0.42, low `fade` (detail kept in shadows), `grain` 0.06-0.08 (PGI 46 vs 44).

### 6. Kodak Portra 400 (Portrait 400)
- Facts, from Kodak publication E-4050 (Feb 2016) https://business.kodakmoments.com/sites/default/files/files/products/e4050_portra_400.pdf :
  - rated ISO 400 in daylight or electronic flash;
  - Kodak describes exceptional colour saturation across a wide range of lighting and "natural" skin tones;
  - sharpness described as optimised, distinct edges and fine detail;
  - grain given as a Print Grain Index (37 for a 4x6 print from 135), not rms granularity, and a PGI of 25 is the approximate visual threshold for graininess;
  - no numeric contrast figure is published (characteristic curves only).
- Further, from Wikipedia (secondary, citing Kodak Q&A): saturation "balanced", grain "extremely fine", natural skin tones. https://en.wikipedia.org/wiki/Kodak_Portra
- Mapping: soft but not faded; `contrast` 0.15-0.28 `[uncertain]` (no numeric contrast published; chosen to read as "gentle"); `sat` 0.95-1.1; `tint` very slightly warm with skin-friendly `high` (+r); `grain` very low 0.025-0.045 with small `grainSize`; `fade` 0.04-0.08 `[uncertain]`; `sharpen` 0.1-0.2.

### 7. Fujifilm Superia X-TRA 400 (Verdant 400)
- Facts, from a Fujifilm data sheet https://asset.fujifilm.com/master/emea/files/2020-10/9a958fdcc6bd1442a06f71e134b811f6/films_superia-xtra400_datasheet_01.pdf :
  - ISO 400 in daylight, no filter for daylight or electronic flash;
  - skin tones "smooth and natural", gray balance kept from highlights to shadows;
  - diffuse RMS granularity 4; flat hexagonal grains used to reduce grain size;
  - resolving power 50 lines/mm at 1.6:1 and 125 lines/mm at 1000:1;
  - blue, green and red sensitive layers; the sheet mentions "a slightly reddish masking colour" relative to the then-current film. **The sheet is for a revised version of the film**, so treat the numbers as indicative for the family `[uncertain]`.
- Wikipedia: Superia is a general-purpose consumer film; the fourth colour layer was dropped in later films; "super uniform fine grain" wording. https://en.wikipedia.org/wiki/Fujifilm_Superia
- **A "green/cyan cast" is not stated in any source I loaded.** The popular idea that this film leans green is `[uncertain]` and is **not** used. Instead the look is: slightly cooler and a touch greener in shadows by design choice (`shadow` [-0.01,0.015,0.01]) to make it distinct from 4-6, and flagged as an artistic choice, not a measurement.
- Mapping: `sat` 1.0-1.15, `contrast` 0.3-0.4, `grain` 0.04-0.06, `tint` slightly cool.

---

## Slide / reversal

### 8. Fujifilm Velvia 50 (Vivid 50)
- Facts, from the Fujifilm data sheet https://asset.fujifilm.com/master/emea/files/2020-10/a71dda63e2662f012b3b74110794918a/films_velvia-50_datasheet_01.pdf :
  - ISO 50 in daylight;
  - saturation described as the highest available;
  - diffuse RMS granularity 9; resolving power 80 / 160 lines/mm;
  - no numeric contrast figure (curves only);
  - needs correction filters beyond a few seconds of exposure (reciprocity); not relevant to our look.
- Review (secondary): strong but well-balanced saturation, high contrast that rises in underexposed areas, strong shadow detail, highlights clip quickly, grain essentially invisible below large enlargements. https://analog.cafe/r/fujifilm-fujichrome-velvia-50-film-review-iv04
- Wikipedia (secondary): very high saturation. https://en.wikipedia.org/wiki/Velvia
- Mapping: `sat` 1.4-1.6, `contrast` 0.55-0.7, `fade` 0, `grain` 0.015-0.03, `sharpen` 0.3-0.45; highlights clip (`high` positive); `vignette` 0.2-0.3.

### 9. Kodak Ektachrome E100 (Clear 100)
- Facts, from Kodak publication E-4000 (revised Aug 2018) https://business.kodakmoments.com/sites/default/files/files/products/e4000_ektachrome_100.pdf (also quoted at https://www.jaskamerakauppa.fi/en/shop/7782-kodak-ektachrome-e100-36135-041771884574.html ):
  - exposure index EI 100 for daylight or electronic flash, no filter;
  - "neutral color balance", "moderately enhanced color saturation", "a low contrast tone scale";
  - "extremely fine grain (rms 8)";
  - whiter, brighter whites (low D-min), extended tonal range, "pleasing, natural skin tone reproduction";
  - sharpness not published as a number.
- Earlier E100G sheet (older film, kept for comparison): https://www.tate.org.uk/documents/600/page_8_2_data_sheet_ektachrome_e100g_e100gx_0.pdf
- **Conflict with the brief:** the brief wants slide looks "saturated, high contrast"; the current sheet says low-contrast tone scale. Clear 100 is therefore built as the clean, neutral, brighter-whites counterpart to 8, with only moderate contrast (above a negative, below Vivid 50). Contrast numbers remain our choice, since no value is published.
- Mapping: `sat` 1.12-1.25, `contrast` 0.34-0.44, `tint` neutral, `fade` 0, `high` slightly positive (bright whites), `grain` 0.015-0.025 (rms 8, extremely fine).

---

## Black and white

### 10. Kodak Tri-X 400 (Grit 400)
- Facts, from Kodak F-4017 (Dec 2016) https://business.kodakmoments.com/sites/default/files/files/products/f4017_trix_320400_0.pdf :
  - rated EI 400; diffuse rms granularity 17, described as "fine";
  - "rich tonality" when over- or under-exposed; contrast index about 0.56 as a processing target;
  - high sharpness;
  - underexposure with longer development raises contrast and graininess and loses shadow detail.
- Review (secondary): a strong, punchy contrast straight from the tank; grain visible when zoomed on 35mm. https://www.analog.cafe/r/kodak-tri-x-400-film-review-5pbm
- Mapping: `sat` 0; `contrast` 0.5-0.62; `grain` 0.09-0.13 with `grainSize` 1.5-2.2; `fade` 0.01-0.03; `sharpen` 0.25-0.4; `vignette` 0.3-0.4.
- **Built differently in step 6:** those numbers match our existing Noir, so Grit 400 follows the sheet's statement that underexposure with longer development raises contrast and graininess, i.e. a pushed look: `contrast` 0.62-0.72, `grain` 0.12-0.17, `grainSize` 2-2.8, `vignette` 0.4-0.5, dust. The amounts are our choice (the sheet gives no numbers).

---

## Disposable / point-and-shoot

### 11. Fujifilm QuickSnap Flash 400 (Flash 400)
- Facts, from the manufacturer spec page https://fujifilm.com/us/en/consumer/film-quicksnap/quicksnap/quicksnap-400/specifications :
  - ISO 400, 27 exposures per pack, 135 format;
  - plastic lens, 32 mm focal length, f/10, fixed focus;
  - shutter 1/100 s;
  - built-in electronic flash, effective range 1 m to 3 m.
- Mapping: flash-lit look; plastic-lens vignette (`vignette` 0.4-0.55, from f/10 fixed plastic lens: the lens facts are published, the amount of vignette is **not** `[uncertain]`); strong centre-bright flash falloff beyond 3 m (range is published, falloff curve is by eye); `sharpen` low-mid, `contrast` 0.4-0.5, `sat` 1.1-1.25; optional date stamp (step 3).
- Date stamp is a common feature on point-and-shoot cameras, but **no source loaded confirms one on single-use cameras**; the stamp is built as an optional toggle `[uncertain]`.

### 12. Kodak FunSaver (Party 800)
- Facts, from Kodak's single-use camera page https://www.kodakprofessional.com/photographers/film/single-use-cameras : "KODAK 800 speed, 27 exposure film"; a simple manual flash with a 4 to 11.5 foot (1.2 to 3.5 m) flash range; focus listed as 1 m to infinity (the page does not list aperture or shutter).
- Review (secondary) https://www.digitalcameraworld.com/reviews/kodak-funsaver-single-use-camera-review : single-element plastic lens, 30 mm, fixed f/10, sharpness "adequate for snapshots at best", flash range 1.2-3.5 m, pre-loaded with ISO 800 colour film. The review says nothing about falloff, vignette, grain or a date stamp.
- Retailer listings also state ISO 800, flash, 27 exposures: https://www.bhphotovideo.com/c/product/368243-USA/Kodak_8617763_35mm_One_Time_Use_Disposable_Camera.html , https://www.adorama.com/kodak-fun-saver-35-mm-disposable-camera-flash-27-exposures/p/kkfs35l
- Mapping: ISO 800 gives more grain than 11 (`grain` 0.08-0.12); soft plastic lens (`sharpen` low); flash-lit with strong falloff beyond the stated range (`flash` 0.6-0.9, curve by eye `[uncertain]`); `vignette` 0.35-0.5 (the amount is not published `[uncertain]`); `sat` 1.05-1.2; warm `tint` (design choice `[uncertain]`). **Date stamp: neither source mentions one**, so it stays an optional per-shot extra (`stamp`, a chance) and not a claimed feature of the camera `[uncertain]`.

---

## Gaps to close

These facts were not obtained because of a usage limit during research. None of them blocks step 2 (theme system). Close them before the step that builds each look.

1. ~~Kodak Gold 200 data sheet E-7022~~ closed in step 5.
2. ~~Kodak Ultramax 400 data sheet E-7023~~ closed in step 5.
3. ~~Kodak Ektachrome E100 current data sheet E-4000~~ closed in step 6.
4. ~~Kodak FunSaver specs~~ closed in step 7.
5. instax SQUARE SQ1 specs and a review of print/flash look (step 4): https://www.fujifilm.com/us/en/consumer/instax/cameras/squaresq1/specifications , https://www.dpreview.com/reviews/9554630048/review-fujifilm-instax-square-sq1-simple-square-format-fun/
6. ~~Disposable-camera review~~ read in step 7: it gives the lens and flash range only; falloff, vignette and date stamp remain unsourced.

## Licensing note

Only text facts were read, from manufacturer data sheets and publicly readable pages. No LUT, preset, image or font was downloaded. Two search results pointed at GitHub preset repositories (`peva3/Lightroom-Presets`); they were **not opened or used**.
