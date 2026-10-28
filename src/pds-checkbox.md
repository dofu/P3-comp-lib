# pds-checkbox

## When to use

Use a checkbox when selections are independent, more than one can be true
at once, or the choice only takes effect once the user submits a form.
Use `pds-switch` instead when the setting takes effect immediately.

```html
<pds-checkbox name="terms">I agree to the Terms and Conditions</pds-checkbox>
```

## Do

- Keep the label in the same tap target as the box; this component does
  that by default when you slot text.
- Use `indeterminate` only to reflect a "some but not all" state of a
  group this checkbox summarises.

## Don't

- Never use a checkbox where only one of several options can be true; use
  radio buttons instead.

## Rules from the design system documentation

- Phrase the option so that checked means yes: "Send me updates", never
  "Don't send me updates".
- Sentence case, no full stop, two lines at most.
- Never for a one-of-N choice. The in-app font-size setting shipped that
  mistake and was changed to radio buttons.
- Every state (checked, unchecked, mixed) has its own mark. Never colour
  alone.
- The whole label is the tap target, ideally the whole row.

## Known limitations

- No form participation via ElementInternals yet; read `.checked` /
  `.indeterminate` directly rather than relying on a parent form's FormData.
