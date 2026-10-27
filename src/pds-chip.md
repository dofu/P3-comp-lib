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

## Known limitations

- Hover and Pressed colours are not finalised yet.
