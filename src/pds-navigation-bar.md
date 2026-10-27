# pds-navigation-bar / pds-nav-item

## When to use

Use for primary, always-visible destinations at the root of an app.
Recommended guidance caps a bottom bar at 5 destinations.

```html
<pds-navigation-bar>
  <pds-nav-item selected>
    <svg slot="icon">...</svg>
    Home
  </pds-nav-item>
  <pds-nav-item>
    <svg slot="icon">...</svg>
    <pds-badge slot="badge" count="3"></pds-badge>
    Orders
  </pds-nav-item>
</pds-navigation-bar>
```

## Do

- Keep exactly one destination selected at a time.
- Compose badges from `pds-badge` rather than a custom dot.

## Known limitations

- Hover and Focus colours are not finalised for individual items.
- No Disabled state for a destination yet.
