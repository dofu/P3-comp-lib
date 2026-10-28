# pds-switch

## When to use

Use `pds-switch` for a setting that takes effect immediately, with no
separate save step. Use a checkbox instead when the choice only takes
effect once the user submits a form.

```html
<label>
  <pds-switch name="notifications"></pds-switch>
  Enable notifications
</label>
```

## Do

- Pair it with a visible label; this component has no text of its own.
- Toggle it only for settings the user expects to take effect right away.

## Don't

- Never use it for a choice that needs a separate confirm step; use a
  checkbox for that.

## Rules from the design system documentation

- Label the on state: "Enable biometric authentication". Never a
  question, never a bare noun, never a double negative ("Disable
  notifications", off).
- The change applies the instant the user taps. A switch never sits
  behind Apply or Submit. A failed save reverts the switch and shows an
  inline error, never silently.
- Not a two-option view picker (Chart / Table). That is a segmented
  button.
- An explanation goes in helper text under the row, not in the label. The
  label stays on one line where possible.

## Known limitations

- No form participation via ElementInternals yet; read `.checked`
  directly rather than relying on a parent form's FormData.
