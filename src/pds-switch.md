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

## Known limitations

- No form participation via ElementInternals yet; read `.checked`
  directly rather than relying on a parent form's FormData.
