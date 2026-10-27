# pds-badge

## When to use

A presence dot (no `count`) means "something changed here"; never put a
number on it. A count pill (`count="3"`) means "this many"; use it only
when the number itself is the point (unread messages, open orders), not as
decoration.

```html
<!-- presence dot: "there's something new" -->
<pds-badge></pds-badge>

<!-- count pill -->
<pds-badge count="3"></pds-badge>

<!-- capped at a custom max -->
<pds-badge count="1500" max="999"></pds-badge>
```

## Do

- Pair the badge with the element it belongs to (a tab, an icon button);
  this component does not position itself.
- Let the badge disappear entirely when there is nothing to show, rather
  than rendering `count="0"`.

## Don't

- Never put a number on the dot variant; use the count pill instead.
- Never make the badge itself clickable; it is deliberately
  `pointer-events: none`. Put the tap target on the thing it decorates.

## Known limitations

- The count cap defaults to 99; pass `max` to change it.
