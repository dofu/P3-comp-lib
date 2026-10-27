# pds-list / pds-list-row

## When to use

Use `pds-list` and `pds-list-row` for homogeneous, scannable content:
settings, menus, or data rows. Never use a card for a single repeating row
in a list; use `pds-list-row` instead.

```html
<pds-list>
  <pds-list-row divider>
    Notifications
    <pds-switch slot="trailing"></pds-switch>
  </pds-list-row>
  <pds-list-row lines="2">
    Apple Inc.
    <span slot="secondary">AAPL</span>
    <span slot="trailing">$113.11</span>
  </pds-list-row>
</pds-list>
```

## Do

- Let a row with a slotted control (a switch, a checkbox) make that
  control the tap target; the row becomes inert automatically.
- Keep values (prices, quantities) in the `trailing` slot; they never wrap or shrink.

## Don't

- Never truncate a financial value; let names truncate instead if space is tight.

## Known limitations

- No Hover/Pressed/Selected styling yet.
- No swipe actions.
- The divider colour token currently resolves to the same value in Dark
  and Light mode, so it reads faint on a light background.
