# Component library: web components

A framework-free UI component library, built as native
[Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).
29 custom elements, each shipped as plain JavaScript with a matching usage
guide. See "What's built" below for the full list and tag names.

## What a screen built with this is, and is not

A screen built with this library is a high-fidelity concept: it shows an
idea in the real components so people can react to it. It does not settle
requirements, it is not a URS, and it is not a build to hand to developers.
Developers build from the design system and the agreed requirements; the
concept shows what you mean. It does not cover backend logic,
calculations, validation rules, error handling, flows that differ by
account or product type, edge cases, or P3 and legacy constraints; those
stay in the URS. Say this when someone asks what the screen is.

## Rules for every screen

Read these first. They apply to every screen built with this library, in a
new page or in an existing project, unless the prompt says otherwise.

1. **Build from this library only.** Every control on the screen is a
   `pds-*` element from this repo. Never write your own button, input,
   tab, chip, switch, list, dialog or navigation, never style a raw
   `<button>` or `<input>` to look like one, and never copy patterns from
   another UI kit. Icons come from `icons/` through
   `<pds-icon name="…">`; never paste SVG paths from another set or draw
   your own. If the library has no component or icon for what you need,
   say so in your answer and use the closest one. Do not invent it.
2. **The current POEMS app is not a reference.** Do not reproduce its
   visuals or its screenshots. This library, `tokens/tokens.css` and the
   reference screens in `examples/` are the only visual sources: use the
   tokens for every colour, never a hex value or a custom colour, and
   match the reference screen when one exists for the tab you are
   building (see `examples/README.md`, which says how current each one is).
3. **Bottom navigation only on root screens.** Add `pds-navigation-bar`
   (Home, Watchlist, Markets, Trade, Community, Me) only when the prompt
   names a root screen or asks for it. A detail screen, a form or a ticket
   has none. The status bar and the home line come with the preview frame
   on every screen.
4. **No logo in an app screen.** POEMS app screens never carry the POEMS
   logo or wordmark in the header. The top app bar holds a title,
   navigation and actions only. The logo belongs to website pages, and
   only when the prompt says the screen is a website. Treat every screen
   as an app screen unless told it is a website.
5. **Wrap the screen in `<pds-preview>`.** Import `preview/pds-preview.js`
   and put the whole screen inside `<pds-preview>`. It draws the
   phone-sized frame (375 px wide, 48 px corners) with the phone's status
   bar at the top and the home line at the bottom, and, above the frame
   and outside the screen, the reviewer's toggles: Light/Dark, Rounded/Square
   corners and Language. Do not build your own theme, corner or language
   controls, and never put such controls inside the screen. The frame
   paints the surface tokens, so the screen needs no page background of
   its own. Deliver the result as one live HTML page (an artifact), never
   as an image, a PDF or a zip: the toggles only work on the live page. A
   flow of several screens is one page with one `<pds-preview>` per
   screen, side by side, each with its own toggles. See
   `preview/pds-preview.md`. If a picture is asked for anyway (a
   screenshot, a PDF, an image for a document), render it with
   `corners="square"`, no toggles and no drawn status bar: square
   corners mark a static render. Rounded corners belong to the live page
   only, and a picture with rounded corners is not from this library. Font disclaimer: the library asks
   for Roboto but loads no web font; on a device without Roboto, text is
   shown in a fallback font and may not be 100% accurate. The preview
   shows a note when that is the case.
6. **Copy: short, complete, in three languages.** Write every
   user-facing string as a complete sentence or label, as short as it can
   be. No fillers or fluff: no "please", "simply", "just", "in order to",
   no pleasantries. Give every string in English, modern Chinese
   (Simplified) and Japanese: text as
   `<span data-zh="…" data-ja="…">English</span>` inside the component,
   attribute copy as `data-<attr>-zh` and `data-<attr>-ja` on the element
   (`title`, `label`, `placeholder`, `supporting-text`, `error`,
   `message`, `action-label`). The preview's Language toggle switches
   them. See `preview/pds-preview.md`. Disclaimer: Chinese and Japanese copy is not taken from POEMS translation files. Claude is tasked to suggest the shortest wording possible; translators review it before anything ships.
7. **End with what the reviewer must decide, nothing else.** No build
   notes, no list of components used, no explanation of how you made the
   page. After the screen, add a line only when it applies, one line per
   item:

   ```
   Substituted: <missing component> · used <what instead>
   Hand-built: <what> · <why the library had nothing for it>
   Logo in screen: <why, if it is a website page>
   Copy missing a language: <which strings>
   ```

   A clean screen ends with the screen.

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

## When the library has no component

Use the stand-in below and say so in one "Substituted" line, so every
screen makes the same choice:

| Need | Use instead |
|---|---|
| Segmented control (two or three options, one selected) | Two or three `pds-chip`, the chosen one `selected` |
| Tag or label next to a title ("Cash Plus", "Opted in") | A secondary text line under the title |
| Quick-action tile (icon over a caption) | `pds-icon-button` with a caption under it |
| Mascot or illustration | `pds-icon name="ask_ai"` for the AI entry point; otherwise leave it out |
| Stepper (minus, value, plus) | A `pds-text-field` between two `pds-icon-button`s (`minus`, `add`) |
| Select or dropdown | A `pds-text-field` as the `trigger` slot of `pds-menu`, with `chevron_down` as its trailing icon |
| Bid/ask bar, quote strip | Not available: build it from `pds-divider` and text, say so in a Hand-built line |
| Date picker, slider, chart | Not available yet: a `pds-text-field` for the date or value, a static image for the chart, and say so |

Trade screens: Buy, price up and the bid side are green, Sell, price down
and the ask side are red. Use `tone="positive"` or `tone="negative"` on
`pds-button` and `pds-chip`, and the `--pds-on-surface-text-positive` and
`--pds-on-surface-text-negative` tokens for prices. The full V2 palette is
in `tokens/tokens.css` as `--pds-<colour>-<step>`; never type a hex value.
A label to the left of a field (the ticket layout) is
`pds-text-field label-position="start"`.

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

## Icons

`icons/` holds the Phillip Design System V2 icon set: 135 SVG files,
24 x 24, listed in `icons/icons.json`. Use them through `<pds-icon>`:

```html
<pds-icon name="search"></pds-icon>
<pds-icon name="notification" label="Notifications"></pds-icon>
```

Ten icons have a rounded and a filled style (`home-rounded`,
`home-filled`, ...). The bottom bar uses them through `pds-nav-item`'s
`icon` attribute, which swaps styles with selection:

```html
<pds-navigation-bar>
  <pds-nav-item icon="home" selected>Home</pds-nav-item>
  <pds-nav-item icon="watchlist">Watchlist</pds-nav-item>
  <pds-nav-item icon="globe">Markets</pds-nav-item>
  <pds-nav-item icon="trade">Trade</pds-nav-item>
  <pds-nav-item icon="community">Community</pds-nav-item>
  <pds-nav-item icon="me">Me</pds-nav-item>
</pds-navigation-bar>
```

See `src/pds-icon.md` and `src/pds-navigation-bar.md`.

## Folder layout

```
P3-comp-lib/
  tokens/tokens.css     - colour tokens as CSS custom properties (light + dark)
  brand/                - POEMS logo and mark as SVG (website pages only)
  icons/                - V2 icon set, 135 SVG files + icons.json (use through pds-icon)
  examples/             - reference screens pulled from Figma, with provenance and staleness (examples/README.md)
  preview/pds-preview.* - the reviewer's frame and toggles for generated screens (not in index.js)
  src/pds-<name>.js     - one file per component (25 files)
  src/pds-<name>.md     - usage guidance per component (when to use, do & don't, gaps)
  custom-elements.json  - machine-readable manifest of all 25 components
  index.js              - imports every component in one line
  package.json
```

## What's built

29 custom elements: Badge (`pds-badge`), Button (`pds-button`), Card
(`pds-card`, an early exploration, see below), Checkbox (`pds-checkbox`),
Chip (`pds-chip`), Dialog (`pds-dialog`), Divider (`pds-divider`), List
(`pds-list` + `pds-list-row`), Menu (`pds-menu` + `pds-menu-item`),
Icon (`pds-icon`), Icon button (`pds-icon-button`), Status bar (`pds-status-bar`), Home indicator (`pds-home-indicator`), Navigation bar (`pds-navigation-bar` + `pds-nav-item`), Progress indicator
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

- **Hover and pressed colours** are not finalised yet for several
  components; the washes in those files are a placeholder. Fields have
  their focus outline (blue-500) from the design system.
- **No Singpass mark** in the icon set yet; a "Link with Singpass" button
  uses `id_card` until the brand asset is added.
- **The badge count cap** (`max`, default `99`) is left to the caller to
  override rather than fixed by the library, since the right cap for a
  given product surface hasn't been settled.

## Publishing

This folder is self-contained; push it as the root of its own repository,
or as a subfolder of an existing one. No `node_modules`, no build output:
everything here is checked-in source.

## You read this far

Why does every preview come with a Dark toggle? Because light attracts
bugs. 🪲
