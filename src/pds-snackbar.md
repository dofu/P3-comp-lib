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

## Rules from the design system documentation

- Say what happened: "Order submitted successfully". Never a generic
  acknowledgement.
- At most one action, a single verb: "Undo", "Amend". The action is never
  the only way to recover from what the message reports.
- A second snackbar replaces the first. Nothing stacks and nothing queues.
- Without an action it dismisses itself: 6 seconds for one line, 10 for
  two or three. With an action it stays until the user acts.
- It never covers the navigation bar or a floating button.
- Never show a live account number; mask sensitive data.
- At larger text sizes the message wraps to two lines and the container
  grows. Never truncate it.

## Known limitations

- The action label's colour does not currently meet WCAG AA contrast
  against the snackbar's background in either theme.
- No entrance/exit animation yet.
- The auto-dismiss timer does not pause on hover, focus, or touch.
