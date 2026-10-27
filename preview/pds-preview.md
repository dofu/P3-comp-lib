# pds-preview

## When to use

Wrap every generated screen in it. It is the reviewer's frame, not part of
the app: a phone-sized card with 16 px corners, and two toggles above it,
outside the screen, for light/dark and rounded/square corners.

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

## Do

- Put exactly one screen inside it, and nothing else on the page.
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
- The theme toggle sets `data-theme` on `<html>`, so two previews on one
  page would fight over it. One screen per page.
- Listen for `pds-preview-change` (detail `{ theme, corners }`), not
  `change`: the screen's own `change` events bubble through the wrapper.
