# Apusonic — website

Concept marketing site for **Apusonic**, a sonic origination and rights house based in Lima, Perú.
Static site: plain HTML, CSS, and JavaScript, plus a single CDN `<script>` for Three.js.
No build step, no framework, no `npm install`.

## Run it locally

The site uses relative asset paths, so open it through a local web server (not `file://`,
which can block the logo and fonts).

**Python (no install needed):**
```bash
cd apusonic
python3 -m http.server 8000
# open http://localhost:8000
```

**Node, if you prefer:**
```bash
cd apusonic
npx serve .        # requires internet the first time to fetch `serve`
```

## The hero — a living mountain range

The flat parallax silhouette is now a **predawn Andean diorama**:

- **WebGL (default).** Twelve noise-generated ridge cutouts at staggered z-depths, scene fog
  that dissolves the far ranges into haze, drifting mist banks between the ridges, sparse warm
  motes, and a single pulsing **red ember** (`--red`) nested in a valley — the brand's one light
  source. The hero section is ~240svh tall with a sticky 100svh stage: scrolling **dollies the
  camera down through the ranges** (it pairs with the “Descend” cue), ridges fading just before
  the camera passes them, and the alpenglow/fog cooling warm→cool as you go. The cursor (or
  device tilt on touch devices) sways the camera so the valley reads volumetric.
- **2D fallback.** If WebGL or Three.js is unavailable (or the WebGL context is lost), the hero
  rebuilds as ten layered SVG ridges with scroll + cursor parallax and CSS mist, sharing the
  same sky, starfield, grain, and vignette.
- **Reduced motion.** With `prefers-reduced-motion`, the hero collapses to a clean **static**
  layered scene at 100svh — no dolly, no parallax, no animation.
- The sky gradient, starfield, alpenglow, film grain, and vignette are cheap DOM/CSS layers
  shared by every mode.

The render loop pauses when the hero is off-screen or the tab is hidden, handlers are
`requestAnimationFrame`-throttled, and pixel ratio is capped at 2.

## Where to edit

- **Brand colors, fonts, spacing:** CSS custom properties in the `:root{}` block at the top of
  `assets/css/styles.css` (`--paper`, `--ink`, `--red`, plus the hero sky tokens `--night-*`,
  `--glow-*`, `--haze`).
- **The 3D scene:** the `CFG` object inside `buildGL()` in `assets/js/main.js` — layer count and
  spacing, ridge amplitudes, the camera dolly path (`camStart`/`camEnd`), fog colors and range,
  mote and mist counts. The shared ridge shape lives in `ridgeProfile(...)`.
- **2D fallback layers:** `build2D()` in `main.js` (layer count, heights, parallax rates).
- **Sound:** a single Web Audio synth signature (`signature()` in `main.js`), triggered only by
  the header “Sound” button. Nothing plays automatically. To drop in real audio later, replace
  `signature()` with an `<audio>` element and a play handler.
- **Copy:** all in `index.html`, translated via `data-i18n` keys in `assets/js/i18n.js`
  (EN / ES-PE / PT-BR; the choice persists in `localStorage`).

## Structure

```
apusonic/
├── index.html              # markup / page structure (data-i18n keys throughout)
├── package.json            # name + start scripts (python http.server / npx serve)
├── .gitignore
├── README.md
└── assets/
    ├── css/styles.css      # all styles (design tokens in :root, hero atmosphere, switcher, banner)
    ├── js/i18n.js          # EN / ES-PE / PT-BR dictionary + language switcher
    ├── js/main.js          # WebGL diorama + 2D fallback, audio toggle, reveals, marquee
    └── img/
        ├── apusonic-logo.png                # transparent wordmark (live)
        ├── Apusonic_Logo_Concept1_Alpha.png # white-bg source (keep as source only)
        └── orchestra_Wide.jpg               # full-width banner photo
```

## Notes for development

- **Binary assets are not in this rebuild** — drop the three originals back into `assets/img/`
  (`apusonic-logo.png`, `Apusonic_Logo_Concept1_Alpha.png`, `orchestra_Wide.jpg`). Until then the
  site degrades gracefully: the logo renders as a typographic ▲PUSONIC wordmark and the banner
  shows a quiet placeholder panel.
- **Three.js** loads from jsDelivr (`three@0.152.2`, the last UMD build) via one `<script>` tag in
  `index.html`. Offline, the hero silently uses the 2D fallback.
- **Fonts** load from Google Fonts via a `<link>` in `index.html`. They need internet on first
  load; the page falls back to system fonts offline. To make the repo fully self-contained,
  download Jost + Mulish, drop the `.woff2` files in `assets/fonts/`, and swap the `<link>` for a
  local `@font-face` block.
- **The hero wordmark** is the same black-ink PNG inverted to paper white with CSS `filter`, so a
  single asset serves the dark hero and the light header/footer.
- **Mountains, dolly, parallax, reveals, marquee** all respect `prefers-reduced-motion`.

## Copy still to verify before launch

These come from the project brief and should be fact-checked / approved:
- PRO names: APDAYC, SAYCO, SCD.
- Market framing in the "Who we serve" cards (volumes, studio counts, club commissions).
- Contact: `hola@apusonic.pe` and the Lima address are placeholders.
