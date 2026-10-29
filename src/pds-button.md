# pds-button

## When to use

Use `pds-button` for the one action a screen wants the user to take. Never
put more than one filled (`variant="primary"`) button in view at once; a
second action is `variant="secondary"` or a text link, never a second
primary.

## Sizes

| Size | Height (minimum) | Padding | Label |
|---|---|---|---|
| `small` | 40px | 12px / 16px | 12px, sentence case (your text, unchanged) |
| `medium` (default) | 44px | 12px / 24px | 14px, forced uppercase |
| `large` | 92px | 12px / 48px | 28px, forced uppercase |

Height is a minimum, not a cap: a longer label or a larger text setting
grows the button rather than clipping it.

## Width

A button has no fixed width. The content decides which of three modes applies:

| Mode | When | How |
|---|---|---|
| Hug (default) | A button inline in content or in a card | Width is the label plus padding, never narrower than the label. |
| Reserved | A button whose label toggles (Follow / Following, Add / Added, Save / Saved), or the same button repeated down a column of list rows | `reserve="Following"`: the button takes the width of its widest label, so the width does not change on tap and the column lines up on both edges. It measures the real labels, so it holds in every language and at every text size. |
| Block | The single screen-level action (a trade ticket's Review or Confirm), and a pair or stack of actions that share one width | `block`: the button fills its container. A secondary action under a block primary is block too. |

```html
<pds-button size="small" reserve="Following">Follow</pds-button>
<pds-button size="small" reserve="Follow" variant="secondary">Following</pds-button>

<pds-button block tone="positive">Review buy order</pds-button>
```

Give `reserve` the alternate labels in the same language as the label,
comma-separated if there are several. When the page switches language,
switch `reserve` as well.

Never set a pixel width on a button, and never truncate a label (see the
rules below). There is no minimum width today: whether Hug gets one is an
open design-system decision (Android ships Material's 88 dp minimum, iOS
has none), so until it is decided a toggling label uses `reserve`, not a
minimum.

## Async actions (`pending`)

Any button that submits something with a real consequence, an order, a
payment, should set `pending` while the request is in flight:

```html
<pds-button id="submit">PLACE BUY LIMIT ORDER</pds-button>
<script type="module">
  submit.addEventListener("click", async () => {
    submit.pending = true;
    try {
      await placeOrder();
    } catch (e) {
      submit.pending = false; // re-enable so the user can retry
      showError(e);
      return;
    }
    // leave pending, or navigate away; don't silently re-enable on success
  });
</script>
```

This keeps the label, shows a spinner, and blocks a second tap while the
request is in flight.

## Buy and Sell

`tone="positive"` makes the button green (Buy, price up), `tone="negative"`
red (Sell, price down), in both variants. Everything else stays orange.

## Do

- Keep the label short: 1 to 3 words, action-first ("Place order", not
  "Order will be placed").
- Use `variant="secondary"` for the button next to a primary action.
- Actions stacked on one screen share one width: `block` on each. A
  secondary button under a block primary is block too; never a small pill
  beside or under a large one.
- A lesser action such as "Reset password" or "Forgot password?" is a text
  link, not a third button. (No text variant ships yet; use a plain link
  styled with `--pds-on-container-tertiary` until it does.)

## Don't

- Never use two `variant="primary"` buttons on one screen.
- Never override the casing the component applies; type sentence case and
  let `size` decide.

## Rules from the design system documentation

- Never truncate a label, at any text size. The label fits, then the
  button grows taller, then the label wraps to two lines, then a
  side-by-side pair stacks with the primary on top. Never shrink the font
  to force a fit.
- A money action never reads OK, Yes or Submit. The label restates the
  action and its consequence: "Place order", "Cancel transfer".
- A value in a label is the full value with its currency code, never
  rounded. The amount on the button is the amount that gets sent.
- Three actions in one group means the screen needs a menu or a page.
- No text-only or ghost button for a destructive or money-moving action.
- An icon-only button for a money action needs an unambiguous glyph and
  an accessible label.
- Casing applies to Latin labels only; Chinese and Japanese labels are
  never transformed.
- An edge-to-edge, full-bleed button (`block`) is only for the single
  screen-level action (a trade ticket's Review or Confirm). Inside scrolling
  content a button keeps the 16 px side margins.
- A button that toggles its label reserves the width of its widest label
  (`reserve`), so it never resizes on tap and a column of them lines up.
- On web at 1024 px and above use `size="medium"`.

## Known limitations

- Hover, Pressed and Focus colours are not finalised; the focus ring shown
  today is a placeholder.
- The disabled fill does not adapt per theme, so it is hard to read
  against a light background.
- `size="small"` is 40px tall, short of the usual 48px touch-target
  guideline. No extra hit area is applied yet.
- A ghost/text-only variant is planned but not implemented.
