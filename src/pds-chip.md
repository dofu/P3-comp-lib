# pds-chip

## When to use

Use a chip for a compact filter, input, or choice. Keep the label to one
or two words, sentence case; chips are not subject to the casing rule
buttons use.

```html
<pds-chip selected>Equities</pds-chip>
<pds-chip dismissible>AAPL</pds-chip>
```

## Do

- Use `selected` for filter/choice chips; the check icon replaces any
  leading icon automatically.
- Use `dismissible` for a chip representing something removable (a filter,
  a recent search).

## Don't

- Never use a chip as a substitute for a button; it is for filtering,
  input, or choice, not a primary action.

## Rules from the design system documentation

- POEMS uses three kinds of chip. Filter: several can be active at
  once, a selected chip shows the check. Selector: opens a picker, the
  label shows the current choice, with a trailing dropdown icon. Input: a
  user-added entry, dismissible. Assist and Suggestion chips are not used,
  by decision.
- Chips select independently and never deselect a sibling. One choice
  from a set (Buy / Sell, Cash / CPF / SRS, Day / GTD) is a segmented
  button or a radio group, not a chip row: that is `pds-segmented-button`.
- A label is one or two words, a noun or an attribute ("SG", "Futures",
  "Dividends"). Never a verb: a verb chip is a button. No punctuation.
  Render the label as written; no casing transform.
- A chip row is one horizontal line that scrolls, with the next chip
  peeking. It never wraps to a second line. A wrapping grid belongs only
  inside a filter sheet.
- A chip grows with its label and never truncates. Never shrink a chip
  below 32 px to fit a container.
- Add a leading icon only when it disambiguates. Show selection with the
  check, never with colour alone.
- Something chip-shaped that does not tap is not a chip; it is a tag, and
  for now that is plain text.

## Known limitations

- Hover and Pressed colours are not finalised yet.
