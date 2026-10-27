# pds-radio

## When to use

Use `pds-radio` when exactly one option can be chosen from a set. Give
every radio in the set the same `name` so selecting one clears the others.

```html
<fieldset>
  <legend>Text size</legend>
  <pds-radio name="text-size" value="regular" checked>Regular</pds-radio>
  <pds-radio name="text-size" value="large">Large</pds-radio>
  <pds-radio name="text-size" value="extra-large">Extra large</pds-radio>
</fieldset>
```

Arrow keys move both focus and selection between radios sharing a `name`,
matching how native radio groups behave.

## Do

- Give every radio in a group the same `name`.
- Prefer radio over checkboxes when only one answer makes sense.

## Don't

- Never leave a group with zero radios checked once the user has
  interacted with it.

## Known limitations

- Disabled currently looks identical to enabled; only interactivity is removed.
- Grouping is scoped to whatever contains the radios (their shared parent
  in the page, or a single shadow root), not to `name` alone, since a
  native `name`-based group does not reach across separate shadow roots.
  Keep every radio in a group in the same scope.
- The 40x40px control is short of the usual 48px touch-target guideline.
- No Focus colour is finalised yet; the focus ring is a placeholder.
