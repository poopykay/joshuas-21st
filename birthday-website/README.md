# Happy 21st Birthday, Joshua 🐞

A single-page website of 88 birthday slides. No build step, no dependencies —
just open `index.html`.

## Putting it on GitHub

1. Open **GitHub Desktop → File → New Repository**. Make it **Private**.
2. Copy everything in this folder into the repository folder
   (`index.html`, `data.js`, `slides/`, `photos/`, `assets/`, `.nojekyll`).
3. **Commit to main**, then **Publish repository** (keep "Keep this code private" ticked).

Total size is about 25 MB across ~105 files, and the largest single file is
under 0.5 MB — comfortably inside GitHub's limits (100 MB per file, 1 GB per repo).

## Sharing the link

On github.com, go to the repo → **Settings → Pages** → under *Build and deployment*
set **Source: Deploy from a branch**, **Branch: main**, **folder: / (root)** → **Save**.
After a minute or two your link appears at the top of that page, something like
`https://<your-username>.github.io/<repo-name>/`.

**One thing to know:** on a free GitHub account, a Pages site is public to anyone
who has the link, even when the repository itself is private. The URL isn't listed
or indexed anywhere, so in practice only the person you send it to will see it —
but if you'd rather it be truly private, either send them the folder as a zip
(everything works offline except the microphone) or use GitHub Pages' private
visibility setting, which needs a paid plan.

## Why Pages rather than just opening the file

Browsers only allow microphone access over `https://` or `localhost` — never from
a file opened straight off the disk. So the candle-blowing on the last slide needs
the Pages link. If the site is opened from a file instead, everything else works
and the candles can be blown out by tapping them.

## How it moves

| Slide | Go forward by |
|---|---|
| 1 | tapping the toddler's belly |
| 2 | tapping anywhere |
| Name / envelope slides | tapping the envelope |
| Message slides | tapping the ladybug |
| 86 (photo strip) | tapping the letter in Snoopy's hands |
| 87 (the letter) | tapping the ladybug |
| 88 | blow into the mic to put the candles out |

Tap anywhere in the **left third** of the screen to go back a slide.
Arrow keys work too.

The photo strip on slide 86 scrolls — drag it, scroll on it, or swipe it on a phone.
It gives a small nudge when the slide opens so it's clear it moves.

## What's in here

```
index.html      the whole site — layout, navigation, candles, mic
data.js         the tap targets for each slide, plus the photo list
slides/1..88    the 88 slides, unchanged, saved as high-quality JPEG
photos/1..10    the ten photos in the film strip
assets/flame1-4 the four candle flames, lifted out of slide 88 so they can
                flicker and be blown out
```

Every slide is used exactly as it was made: same size, same crop, same position,
nothing moved or redrawn. The only pixels that differ anywhere are on slide 88,
where the flames were separated from the background so they could move.

## Making changes later

- Different photos in the strip: drop new files into `photos/` and edit the
  `PHOTOS` list at the end of `data.js` (`ar` is width ÷ height).
- A tap target that feels off: each entry in `SPOTS` is `[x, y, width, height]`
  in the slide's own 1366 × 768 coordinates.
