# pds-dialog

## When to use

Use a dialog when a decision must block the user: a destructive-action
confirmation, or a blocking error. Never show more than one dialog at once.

```html
<pds-dialog id="confirm">
  <span slot="title">Discard this order?</span>
  <pds-button slot="actions" variant="secondary">Cancel</pds-button>
  <pds-button slot="actions" variant="primary">Discard</pds-button>
</pds-dialog>
<script type="module">
  confirm.show();
</script>
```

## In a preview

Inside `pds-preview` the dialog opens inside the phone frame with its own
scrim, so it reads like the app. Outside a preview it is a real modal in
the browser's top layer.

## Do

- Limit actions to two: one to confirm, one to dismiss.
- Give a destructive action its own colour, and never make it the default focus.

## Don't

- Never stack a second dialog on top of an open one.

## Rules from the design system documentation

- The headline is a specific question or statement: "Cancel this
  order?". Never "Warning", never "Are you sure?".
- Actions restate the outcome: "Cancel order" and "Keep order". Never OK,
  Yes or No, and never two labels that both read as confirmation.
- Money is the full value with its currency code, never rounded. The
  amount shown is the amount that gets sent.
- One decision per dialog. The consequence goes in the body, not the
  headline.
- Never a dialog for a success confirmation (that is the snackbar's job),
  never a dialog on launch for a promotion, never a dialog over a dialog.
- A dialog that requires a decision cannot be dismissed by tapping the
  scrim or pressing back. Use `dismissible` only when closing is safe.
- A confirming action that calls an API: the button shows a spinner and
  keeps its label, both actions disable, and the dialog cannot be
  dismissed while the request is in flight. On failure the dialog stays
  open with an inline error line above the actions. On success it closes
  and a snackbar confirms.
- Max width 560 px, never touching the screen edges. Long content scrolls
  inside the dialog past 80 % of the screen height.

## Known limitations

- No icon slot or scrollable-content layout yet, just title, body, and up
  to two actions.
