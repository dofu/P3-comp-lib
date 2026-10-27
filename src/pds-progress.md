# pds-progress

## When to use

Use the indeterminate (default) form when a wait time is unknown; use
`determinate` with a `value` when you can report real progress.

```html
<pds-progress></pds-progress>
<pds-progress determinate value="60"></pds-progress>
<pds-progress shape="linear" determinate value="30"></pds-progress>
```

## Do

- Switch to `determinate` the moment you have a real percentage to report.
- Use `shape="linear"` for a progress bar embedded in a layout; use the
  default circular shape for a standalone spinner.

## Don't

- Never set both a stalled `determinate` value and expect it to also spin;
  pick one mode.

## Known limitations

- The track colour token currently resolves to the same value in Dark and
  Light mode, so the track reads faint on a light background today.
- Stepper, segmented-bar, and pull-to-refresh style indicators are
  separate components, not covered here.
