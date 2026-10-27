# pds-preview

## When to use

Wrap every generated screen in it. It is the reviewer's frame, not part of
the app: a phone-sized card with 48 px corners, and three toggles above
it, outside the screen: light/dark, rounded/square corners, and language
(EN, 中文 for modern Chinese in Simplified script, 日本語).

```html
<link rel="stylesheet" href="./tokens/tokens.css">
<script type="module">
  import "./index.js";
  import "./preview/pds-preview.js";
</script>

<pds-preview>
  <pds-top-app-bar title="Log in"></pds-top-app-bar>
  ...the screen...
</pds-preview>
```

## Copy in three languages

Give every user-facing string in English, modern Chinese (Simplified) and
Japanese. The Language toggle swaps them and sets `lang` on `<html>`.

Disclaimer: Chinese and Japanese copy is not taken from POEMS translation files. Claude is tasked to suggest the shortest wording possible; translators review it before anything ships. The preview shows this note under the toolbar
whenever 中文 or 日本語 is selected.

- Text: `<span data-zh="登录" data-ja="ログイン">Log in</span>`. Put the
  span inside the component (`<pds-button><span …>Log in</span></pds-button>`).
- Attribute copy: `data-<attr>-zh` and `data-<attr>-ja` on the element,
  for `title`, `label`, `placeholder`, `supporting-text`, `error`,
  `message` and `action-label`, for example
  `<pds-text-field label="User ID" data-label-zh="用户ID" data-label-ja="ユーザーID">`.
- English is read from the page and kept in `data-en` / `data-<attr>-en`,
  so EN restores it.

## What the page is

A line under the toolbar says it on every page: concept prototype, shows
the idea in the real components, not a requirements document, not a build
for developers. It cannot be switched off; that is the point.

## Status bar

The frame starts with `pds-status-bar` (time, signal, wifi, battery), as
every P3 screen in Figma does. Set `status-bar="off"` to hide it, or add
`notch` to draw the device notch (off by default: it reads as a black
stain on light screens at small sizes). A
screen inside the preview must not add its own.

## Home line

The frame ends with `pds-home-indicator` (the 34px zone with the home
line), as every P3 screen in Figma does. Set `home-indicator="off"` to
hide it. The bottom navigation bar is not part of the frame: add
`pds-navigation-bar` only on root screens.

## Stage

The preview paints no background of its own, so a page shows nothing
outside the frame's rounded corners; the frame has a shadow and a hairline
edge instead. Use the Corners toggle (Square) if a render must have no
radius at all.

## Font

The library asks for Roboto but loads no web font. On a device without
Roboto, text renders in the system font and may not be 100% accurate to
the design. The preview detects this and shows a note under the toolbar.

## Several screens on one page

A flow is one page with one `<pds-preview>` per screen, side by side or
stacked. Each preview carries its own toggles; its theme and language
apply to that frame only.

## Do

- Put exactly one screen inside each preview. A flow uses one preview per screen.
- Let it paint the surface: the frame sets `--pds-surface-1` and
  `--pds-on-surface-1`, so the screen does not need its own page
  background.
- Leave the toggles where they are. They belong to the reviewer, above
  the frame; the screen never carries a theme or corner control.

## Don't

- Never ship it in the app. It is for previews of generated screens only
  and is not exported from `index.js`.
- Never put the POEMS logo in the screen because the frame looks like a
  page. The rules in the README still apply inside the frame.

## Known limitations

- Width and height are plain attributes (`width="390"`); there is no
  device picker yet.
- Listen for `pds-preview-change` (detail `{ theme, corners, language }`),
  not `change`: the screen's own `change` events bubble through the wrapper.
- Copy added to the screen after the first language switch is not
  translated until the toggle is pressed again.
