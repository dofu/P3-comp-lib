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
  confirm.showModal();
</script>
```

## Do

- Limit actions to two: one to confirm, one to dismiss.
- Give a destructive action its own colour, and never make it the default focus.

## Don't

- Never stack a second dialog on top of an open one.

## In a preview

Inside `pds-preview` the dialog opens inside the phone frame with its own
scrim, so it reads like the app. Outside a preview it is a real modal in
the browser's top layer.

## Known limitations

- No icon slot or scrollable-content layout yet, just title, body, and up
  to two actions.
