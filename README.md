# Component library: web components

A framework-free UI component library, built as native
[Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).
25 custom elements, each shipped as plain JavaScript with a matching usage
guide. See "What's built" below for the full list and tag names.

## Why web components, and why plain JS

- **No framework required.** `<pds-button>` and `<pds-badge>` work in a
  plain HTML page, or inside React, Vue, or anything else, because Custom
  Elements are a browser standard, not a framework feature.
- **No build step.** Everything here is plain JavaScript with JSDoc type
  comments, loaded with a native `<script type="module">`. Building a page
  with these components doesn't require running a compiler.
- **Still typed, just not with TypeScript.** `custom-elements.json` is the
  [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest)
  standard: every attribute, its allowed values, its default, and every CSS
  custom property a component reads. A tool reading this repo gets the same
  exact-value guarantees a `.d.ts` file would give it, without anyone having
  to run `tsc`.

## How to build a screen with these components

1. Read `custom-elements.json` first: that's the ground truth for what each
   component accepts.
2. Read the matching `src/<component>.md` for the *when to use* and *do /
   don't* guidance a props list can't express on its own.
3. Write plain HTML using the tags, e.g. `<pds-button size="large">Buy</pds-button>`,
   importing `./index.js` (or the one component needed from `src/`) and
   `./tokens/tokens.css`.

## Rules for every screen

Read these before generating anything. They apply to every screen built
with this library unless the prompt says otherwise.

1. **No logo in an app screen.** POEMS app screens never carry the POEMS
   logo or wordmark in the header. The top app bar holds a title,
   navigation and actions only. The logo belongs to website pages, and
   only when the prompt says the screen is a website. Treat every screen
   as an app screen unless told it is a website.
2. **Wrap the screen in `<pds-preview>`.** Import `preview/pds-preview.js`
   and put the whole screen inside `<pds-preview>`. It draws the
   phone-sized frame (375 px wide, 16 px corners) and, above the frame and
   outside the screen, the reviewer's toggles: Light/Dark and
   Rounded/Square corners. Do not build your own theme or corner
   controls, and never put such controls inside the screen. The frame
   paints the surface tokens, so the screen needs no page background of
   its own. See `preview/pds-preview.md`.

## Brand assets

`brand/` holds the POEMS logo from the Foundations file, as SVG:

| File | Use |
|---|---|
| `brand/poems-logo.svg` | wordmark with the orange swoosh, 62 x 34, for light backgrounds |
| `brand/poems-logo-on-dark.svg` | same wordmark in white, for dark backgrounds |
| `brand/poems-mark.svg` | the square "p" mark, 34 x 34, for light backgrounds |
| `brand/poems-mark-on-dark.svg` | the "p" mark in white, for dark backgrounds |

Website pages only (see rule 1). Do not recolour, stretch or redraw them;
scale with `width`/`height` on an `<img>` and keep the aspect ratio.

## Folder layout

```
P3-comp-lib/
  tokens/tokens.css     - colour tokens as CSS custom properties (light + dark)
  brand/                - POEMS logo and mark as SVG (website pages only)
  preview/pds-preview.* - the reviewer's frame and toggles for generated screens (not in index.js)
  src/pds-<name>.js     - one file per component (25 files)
  src/pds-<name>.md     - usage guidance per component (when to use, do & don't, gaps)
  custom-elements.json  - machine-readable manifest of all 25 components
  index.js              - imports every component in one line
  package.json
```

## What's built

25 custom elements: Badge (`pds-badge`), Button (`pds-button`), Card
(`pds-card`, an early exploration, see below), Checkbox (`pds-checkbox`),
Chip (`pds-chip`), Dialog (`pds-dialog`), Divider (`pds-divider`), List
(`pds-list` + `pds-list-row`), Menu (`pds-menu` + `pds-menu-item`),
Navigation bar (`pds-navigation-bar` + `pds-nav-item`), Progress indicator
(`pds-progress`, circular and linear), Radio button (`pds-radio`), Search
(`pds-search`), Sheets (`pds-bottom-sheet` + `pds-side-sheet`), Snackbar
(`pds-snackbar`), Switch (`pds-switch`), Tabs (`pds-tabs` + `pds-tab`), Text
field (`pds-text-field`), Tooltip (`pds-tooltip`, plain and rich), Top app
bar (`pds-top-app-bar`).

Card is worth calling out on its own: it has no settled design yet, only an
early proposal, so `pds-card` is a clearly-labelled starting point built
from that proposal's own numbers, not a finished component like the other
eighteen.

## Known gaps

Each of these is a real, deliberate gap, not an oversight:

- **Hover, pressed, and focus colours** are not finalised yet for several
  components; the interaction styles in those files are a placeholder.
- **The badge count cap** (`max`, default `99`) is left to the caller to
  override rather than fixed by the library, since the right cap for a
  given product surface hasn't been settled.
- **Two outline tokens** in `tokens/tokens.css` currently resolve to the
  same value in both Dark and Light mode, so a border that relies on them
  for contrast against a light background is faint. See the comment in
  that file.

## Publishing

This folder is self-contained; push it as the root of its own repository,
or as a subfolder of an existing one. No `node_modules`, no build output:
everything here is checked-in source.
