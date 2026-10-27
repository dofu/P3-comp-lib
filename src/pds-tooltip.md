# pds-tooltip

## When to use

Use the plain variant for a short label on an icon-only or unlabelled
control. Use the rich variant when a subhead, longer body text, or up to
two actions are needed.

```html
<pds-tooltip label="Settings">
  <button aria-label="Settings">&#9881;</button>
</pds-tooltip>

<pds-tooltip variant="rich" heading="New feature">
  <button>Learn more</button>
  <span slot="body">Try the new dashboard layout.</span>
  <button slot="primary-action">Try it</button>
</pds-tooltip>
```

## Do

- Keep a plain tooltip's label to one short phrase.
- Keep rich actions side by side, never stacked, and never more than two.

## Don't

- Never rely on a tooltip to carry information the user needs to complete
  a task; it can disappear before it's read.

## Known limitations

- No dynamic viewport-collision handling; placement is fixed CSS, not
  recalculated on scroll or resize.
