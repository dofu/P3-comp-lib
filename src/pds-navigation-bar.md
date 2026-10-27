# pds-navigation-bar / pds-nav-item

## When to use

The bottom bar of the POEMS app: primary, always-visible destinations at
the root. The P3 bar has six, in this order, with these icons from
`icons/`:

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

`icon` names the icon; the item shows the rounded style when unselected
and the filled style when selected (`trade` has one style). The selected
item gets a 2px orange line across its top, an orange icon and a bold
label; the others are grey. There is no pill.

## Do

- Keep exactly one destination selected at a time.
- Use `icon` with the names above. For a destination outside the P3 set,
  pick a name from `icons/icons.json`; use the `icon` slot only for an
  icon the set does not have, and say so.
- Compose badges from `pds-badge` (`slot="badge"`) rather than a custom dot.

## Don't

- Never draw the icons by hand or take them from another set.
- Never add a pill or background behind the selected icon.

## Known limitations

- Hover and Focus colours are not finalised for individual items.
- No Disabled state for a destination yet.
