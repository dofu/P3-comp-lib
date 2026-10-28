# pds-top-app-bar

## When to use

Use `pds-top-app-bar` at the top of a screen to show where the user is and
give them primary navigation and actions. Skip it when the screen's
primary purpose is search; a dedicated search header fits better there.

```html
<pds-top-app-bar title="Account">
  <button slot="leading" aria-label="Back">
    <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
  </button>
  <button slot="trailing" aria-label="Search">
    <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
  </button>
</pds-top-app-bar>
```

## Variants

| Variant | Height | Use |
|---|---|---|
| `short` | 64px | Default; single line title. |
| `short-with-sub` | 64px | Title plus a second, smaller line. |
| `long` | 96px, can grow | A longer headline that needs more room. |

Titles may truncate as a last resort; switch to `variant="long"` when the
title itself matters more than a fixed bar height.

## Rules from the design system documentation

- The subtitle is secondary context under a short title, such as an
  account or entity name. Never an independent second sentence.
- A long title switches to `variant="long"` and the bar grows. Never type
  an ellipsis into a title.
- A title may truncate as a last resort. A value (a price, a holding)
  never does; it is not a title.
- In Dark, scroll elevation is a hairline divider under the bar, never a
  drop shadow.

## Known limitations

- The scroll-tint opacity applied while `scrolled` is a placeholder, not
  a finalised value.

## Icon actions

Use `pds-icon-button` in the `leading` and `trailing` slots for back, close
and toolbar actions:

```html
<pds-top-app-bar title="Counter details">
  <pds-icon-button slot="leading" icon="arrow_left" label="Back"></pds-icon-button>
</pds-top-app-bar>
```
