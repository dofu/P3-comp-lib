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

## Rules from the design system documentation

- A numbered badge appears only in the Notification box. Everywhere else
  (Me, Community, gamification) it is the dot.
- The count comes from the server. It is never computed or incremented on
  the client.
- A count badge announces as part of its host ("Notifications, 5 new"); a
  dot announces as "new content". The badge itself is never focusable.
- A badge clears when the user views its source, and for no other reason.

## Known limitations

- The count cap defaults to 99; pass `max` to change it.
