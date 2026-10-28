# pds-divider

## When to use

Use a divider to separate content within one context (rows in a list,
sections in a menu). Never use a divider to mark a card's edge, that is
containment, not separation; use a card boundary instead.

## Attributes

| Attribute | Values | Default |
|---|---|---|
| `direction` | `horizontal`, `vertical` | `horizontal` |
| `length` | `full-width`, `inset`, `middle-inset` | `full-width` |

`inset` offsets only the leading edge (16px); the trailing edge stays
flush. `middle-inset` offsets both edges by 16px.

## Rules from the design system documentation

- Inset between rows inside one group; full-width where a group ends.
  Never both back to back: drop the last row's divider before a
  full-width closer.
- Prefer spacing when it already reads as separate groups. A divider is a
  quiet, low-contrast line by design; never a darker or heavier one "for
  visibility".
- Never label a divider, and never pair it with a colour band to mark the
  same edge twice.

## Known limitations

