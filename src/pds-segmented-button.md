# pds-segmented-button / pds-segment

## When to use

One choice from two to four options, all visible, one always chosen:
Buy / Short sell / Sell, Cash / CPF / SRS, Day / GTD, Chart / Table.
The chosen segment is filled, the others are outlined, and there is no
check icon: the fill is the state.

Not this component: several choices at once (chips), a setting that
applies the moment it is tapped (switch), more than four options or
options that need explaining (radio buttons), switching between sections
of a screen (tabs).

```html
<pds-segmented-button id="side" value="buy" full>
  <pds-segment value="buy" tone="positive">Buy</pds-segment>
  <pds-segment value="short">Short sell</pds-segment>
  <pds-segment value="sell" tone="negative">Sell</pds-segment>
</pds-segmented-button>
<script type="module">
  side.addEventListener("change", (e) => console.log(e.detail.value));
</script>
```

## Do

- Give every segment a `value`, and set `value` on the group (or `selected`
  on one segment) so one is chosen from the start.
- Use `full` when the control is the row, as on a trade ticket; leave it
  off when it sits beside a label.
- Buy and price-up choices take `tone="positive"`, Sell and price-down
  take `tone="negative"`; the rest stay orange.
- Keep labels to one or two words. A label never wraps or truncates; at a
  larger text size the control grows taller instead.

## Don't

- Never use chips for a single choice; chips never deselect each other.
- Never leave a group with nothing chosen.
- Never put more than four segments in a row; from five, use radio
  buttons or a menu.

## Rules from the design system documentation

- Two to four segments, equal width, 48 px tall at Regular text; at
  Extra Large the control grows to 56 px and labels stay on one line.
- Labels stay short by nature and are rendered as written; the button
  casing rule does not apply.
- A label too long to hold one line is too long for a segment.

## Known limitations

- Label only; no icon configuration yet.
- Single choice only; a multi-select segmented button is not implemented.
