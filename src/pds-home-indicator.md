# pds-home-indicator

## When to use

At the very bottom of every app screen, below the navigation bar when the
screen has one, exactly as the P3 screens in Figma carry it: a 34px zone
with the home line. `pds-preview` adds it to the frame on its own, so a
screen wrapped in the preview does not need to include it.

The bottom navigation bar is a different thing. Only root screens (Home,
Watchlist, Markets, Trade, Community, Me) carry `pds-navigation-bar`; a
detail screen, a form or a ticket does not. The home line is always there.

```html
<pds-navigation-bar>…</pds-navigation-bar>
<pds-home-indicator></pds-home-indicator>
```

## Do

- Let it take the screen's surface; it has no background of its own.

## Don't

- Never draw the home line yourself or make it part of the navigation bar.

## Known limitations

- iPhone layout only (375 wide, 34 tall); no Android variant yet.
