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

## Rules from the design system documentation

- Never a finance number, price or decision-relevant value only inside a
  tooltip.
- On mobile the trigger is a 48 dp info icon. Never rely on hover or long
  press alone.
- Tooltip text never truncates; the container grows, including for longer
  Chinese and Japanese strings.
- A rich tooltip stays until dismissed (outside tap, scroll, Esc, its own
  action). A plain one goes the moment focus or hover leaves the trigger.

## Known limitations

- No dynamic viewport-collision handling; placement is fixed CSS, not
  recalculated on scroll or resize.
