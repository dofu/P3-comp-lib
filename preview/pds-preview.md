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
- Listen for `pds-preview-change` (detail `{ theme, corners, language }`),
  not `change`: the screen's own `change` events bubble through the wrapper.
- Copy added to the screen after the first language switch is not
  translated until the toggle is pressed again.
