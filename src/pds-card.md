# pds-card

This component is an early draft: sizes, spacing, and colours here are a
starting proposal, not settled values.

## When to use

Use a card to group related content, media, and actions into one visual
unit. Never use a card for a single repeating row in a homogeneous
list; use a list row instead.

```html
<pds-card variant="outlined" size="m" media-ratio="16:9">
  <img slot="media" src="chart.png" alt="" />
  <h3 slot="header">Weekly summary</h3>
  <p>Your portfolio is up 3.2% this week.</p>
  <pds-button slot="actions" variant="secondary">View details</pds-button>
</pds-card>
```

## Do

- Make the whole card one tap target only when it leads to one place; use
  `interactive`.

## Don't

- Never mix a whole-card tap target with other tappable rows inside it
  unless the pressed states are visually distinct.

## Known limitations

- This is a draft proposal, not a reviewed, final component.
- Filled and Tonal-raised currently look identical in Light mode.
