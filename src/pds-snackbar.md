# pds-snackbar

## When to use

Use a snackbar to confirm a background action that already finished
("Order submitted successfully"). It never carries information the user
needs to complete a task or avoid an error; use a dialog for that.

```html
<pds-snackbar message="Order submitted successfully" dismissible></pds-snackbar>
<pds-snackbar message="Message deleted" action-label="Undo"></pds-snackbar>
```

## Do

- Keep the message to one short, plain-language line.
- Append it inside the screen (inside `pds-preview`), never to `document.body`,
  so it sits at the bottom of the phone frame and not of the browser window.
- Give it an action only when there's something to undo or follow up on.

## Don't

- Never add an icon next to the message; that's what a dialog is for.
- Never use a filled or elevated button as the action; it's a plain text button.
- Never show more than one snackbar at a time.

## Known limitations

- The action label's colour does not currently meet WCAG AA contrast
  against the snackbar's background in either theme.
- No entrance/exit animation yet.
- The auto-dismiss timer does not pause on hover, focus, or touch.
