# Happy 21st, Ling! 🎂

An interactive birthday-message website. Open `index.html` in a browser (or publish
the repo with GitHub Pages) to view it.

## How it works
- **Slide 1 → 2**: tap the toddler's belly.
- **Slide 2 → 3**: click anywhere.
- **From slide 3 on**: click the ladybug (bottom corner of each screen) to go forward.
- **Go back**: tap/click the left third of the screen.
- Click an **envelope** to open the letter popup (tap the cover to flip it open).
- Click any **photo** to view it full-size.
- The 6th-to-last screen (Kay's) has a scrollable photo filmstrip — scroll it, and
  click Snoopy to read the letter.
- The final screen: candles flicker, then **blow into your microphone** to blow
  them out (the browser will ask for microphone permission).

## Structure
- `index.html`, `style.css`, `app.js` — the site.
- `data.json.js` — all 43 birthday-message entries (name, message, template, photo
  list), generated from the submitted form responses.
- `assets/backgrounds/` — the 17 designed slide backgrounds (from the provided mockups).
- `assets/photos/<slug>/` — each person's photos, resized/compressed for the web.
- `assets/names/<slug>.png` — the cross-stitch-style name graphics used on envelopes
  (extracted from the provided design assets; 2 names without a usable source
  asset — "seow" and "raeanne" — were recreated in a matching style).
- `assets/props/` — the pin/magnet cutout graphics used on the corkboard/fridge templates.

## Notes on fidelity
Every friend's message is placed into one of the 7 template layouts (journal /
box / clothesline / corkboard / magnet / jeans / camera) based on their photo
count, exactly as specified. The backgrounds, props and ladybug placement are
untouched from the original designs. Because the templates were designed
around one example photo/name each, and now carry 37 different people's photos
and names, a few templates with many photos (corkboard/box/magnet for entries
with 4+ pictures) can show a sliver of the original example photo peeking out
behind the new ones — the layouts weren't built to hide that. Everything else
(navigation, envelopes, letters, photo counts, the family section, Kay's
photostrip, and the candle/mic finale) is fully implemented.

## Publishing
Since this repo is meant to be shared with one person, the simplest options are:
1. Add the repo in GitHub Desktop, push it, then enable **GitHub Pages** in the
   repo settings (Settings → Pages → Deploy from branch) and share the generated
   link, or
2. Keep the repo private and have the one person clone it / download the ZIP and
   open `index.html` directly.
