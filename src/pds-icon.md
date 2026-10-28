# pds-icon

## When to use

For every icon on a screen. The library's icons are the Phillip Design
System V2 set (135 files in `icons/`, 24 x 24, listed in
`icons/icons.json`). Name the icon; the element fetches it once and inlines
it, so it takes the surrounding text colour.

```html
<pds-icon name="search"></pds-icon>
<pds-icon name="notification" label="Notifications"></pds-icon>
<pds-button><pds-icon slot="icon" name="add"></pds-icon> Add</pds-button>
```

Icons with two styles (`home`, `watchlist`, `globe`, `community`, `me`,
`like`, `edit`, `edit_individual`, `edit_group`, `fractional_share`) are
named `<name>_rounded` and `<name>_filled`; `sort` has `-default`,
`-ascending` and `-descending`.

## Do

- Use `label` when the icon stands alone and carries meaning; leave it
  off when text beside it already says the same thing.
- Change colour with `color` on the icon or its parent; never edit the SVG.

## Don't

- Never paste SVG paths from another icon set or draw an icon by hand. If
  the name you need is not in `icons/icons.json`, say so and pick the
  closest one.
- Never use `<img src="icons/...">`; it cannot take `currentColor`.

## Known limitations

- The page must import the library from a URL (the CDN or a served copy),
  so that `icons/icons.js` can be loaded next to it. A page that pastes the
  library's code inline has no `icons/` next to it and the icons render
  empty (a `error` event fires).
- No size tokens yet; `size` is a plain number of px.
