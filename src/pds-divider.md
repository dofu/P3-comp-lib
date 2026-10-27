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

## Known limitations

- The line's colour token currently resolves to the same value in Dark and
  Light mode, so it reads faint against a light background today.
