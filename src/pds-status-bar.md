# pds-status-bar

## When to use

At the very top of every app screen, above the top app bar, exactly as the
P3 screens in Figma carry it: time on the left, signal, wifi and battery on
the right. `pds-preview` adds it to the frame on its own (with the notch),
so a screen wrapped in the preview does not need to include it. Include it
yourself only when you render a screen without the preview frame.

```html
<pds-status-bar></pds-status-bar>
<pds-top-app-bar title="Counter details"></pds-top-app-bar>
```

## Do

- Leave the time at 9:41 unless the screen's story needs another time.
- Let it take the screen's surface; it has no background of its own.

## Don't

- Never draw your own status bar or paste one from a screenshot.
- Never put live data in it; it is decorative and hidden from assistive
  technology.

## Known limitations

- iPhone layout only (375 wide, 44 tall, notch); no Android or Dynamic
  Island variant yet.
- The clock uses Roboto, not the system font Figma shows.
